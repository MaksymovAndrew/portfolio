#!/usr/bin/env bash
# Rolls out one release. The deploy workflow calls it over SSH with a key the server pins to this
# script, so the request arrives in SSH_ORIGINAL_COMMAND as "<owner> <tag>".
#
# Installed at /srv/bin/deploy-portfolio.sh
set -euo pipefail

STACK_DIR=/srv/portfolio
ENV_FILE="$STACK_DIR/.env"
REGISTRY=ghcr.io
IMAGE_NAME=portfolio
BOOTSTRAP_TAG=bootstrap
HEALTH_TIMEOUT_SECONDS=150
POLL_INTERVAL_SECONDS=5
PUBLIC_PROBE_ATTEMPTS=6

log() { echo "[$(date '+%H:%M:%S')] $*"; }
die() { echo "[$(date '+%H:%M:%S')] ERROR: $*" >&2; exit 1; }

read -r OWNER TAG _ <<< "${SSH_ORIGINAL_COMMAND:-${*:-}}"
[ -n "${OWNER:-}" ] && [ -n "${TAG:-}" ] || die "expected \"<owner> <tag>\", got: ${SSH_ORIGINAL_COMMAND:-nothing}"
[[ "$OWNER" =~ ^[a-z0-9][a-z0-9-]*$ ]] || die "refusing suspicious owner: $OWNER"
[[ "$TAG" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]] || die "refusing suspicious tag: $TAG"

cd "$STACK_DIR"

# strips the quotes and carriage returns compose tolerates and curl does not
read_env() { grep -oP "(?<=^$1=).*" "$ENV_FILE" | tr -d '\r"' || true; }

grep -q '^IMAGE=' "$ENV_FILE" || die "IMAGE missing from $ENV_FILE"
PREVIOUS_IMAGE=$(read_env IMAGE)
PREVIOUS_TAG=$(read_env IMAGE_TAG)
SITE_DOMAIN=$(read_env SITE_DOMAIN)
[ -n "$PREVIOUS_TAG" ] || die "IMAGE_TAG missing from $ENV_FILE"
[ -n "$SITE_DOMAIN" ] || die "SITE_DOMAIN missing from $ENV_FILE"

write_release() {
    sed -i -e "s|^IMAGE=.*|IMAGE=$1|" -e "s|^IMAGE_TAG=.*|IMAGE_TAG=$2|" "$ENV_FILE"
}

web_healthy() {
    local container
    container=$(docker compose ps -q web)
    [ -n "$container" ] && [ "$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null)" = healthy ]
}

wait_for_healthy() {
    local deadline=$(( SECONDS + HEALTH_TIMEOUT_SECONDS ))
    until web_healthy; do
        [ "$SECONDS" -lt "$deadline" ] || return 1
        sleep "$POLL_INTERVAL_SECONDS"
    done
}

roll_back() {
    if [ "$PREVIOUS_TAG" = "$BOOTSTRAP_TAG" ]; then
        # back to bootstrap, so a retry is a first deploy again and no broken container stays on the proxy network
        docker compose down >/dev/null 2>&1 || true
        write_release "$PREVIOUS_IMAGE" "$PREVIOUS_TAG"
        die "first deploy of $TAG failed, there is no earlier release to restore"
    fi
    log "rolling back to $PREVIOUS_IMAGE:$PREVIOUS_TAG"
    write_release "$PREVIOUS_IMAGE" "$PREVIOUS_TAG"
    docker compose up -d >/dev/null 2>&1 || true
    wait_for_healthy || die "deploy failed, and the restored $PREVIOUS_TAG is NOT healthy either"
    die "deploy failed, previous version $PREVIOUS_TAG restored and healthy"
}

# through Caddy, as a visitor gets there: the container's own health check never sees the proxy
public_ok() {
    curl -fsS -o /dev/null --max-time 10 --resolve "$SITE_DOMAIN:443:127.0.0.1" "https://$SITE_DOMAIN$1"
}

probe_public() {
    local attempt
    for attempt in $(seq "$PUBLIC_PROBE_ATTEMPTS"); do
        public_ok /health && public_ok / && return 0
        log "public probe $attempt/$PUBLIC_PROBE_ATTEMPTS failed, retrying"
        sleep "$POLL_INTERVAL_SECONDS"
    done
    return 1
}

# this project's images only, minus the running tag and the rollback target: other projects on
# the server keep their own history
stale_images() {
    docker image ls --format '{{.Repository}} {{.Tag}}' \
        | awk -v name="/$IMAGE_NAME" -v current="$TAG" -v previous="$PREVIOUS_TAG" \
            'substr($1, length($1) - length(name) + 1) == name && $2 != current && $2 != previous && $2 != "<none>" { print $1 ":" $2 }'
}

log "deploying $OWNER/$TAG (current: $PREVIOUS_TAG)"
write_release "$REGISTRY/$OWNER/$IMAGE_NAME" "$TAG"

log "pulling the image"
docker compose pull --quiet || roll_back

log "starting the container"
docker compose up -d || roll_back

log "waiting for the container to report healthy"
if ! wait_for_healthy; then
    docker compose logs --tail 40 web || true
    roll_back
fi

log "probing the site through the proxy"
probe_public || roll_back

log "deployed $TAG successfully"
stale_images | xargs -r docker image rm >/dev/null 2>&1 || true
# a re-pushed tag leaves its old image without a name
docker image prune -f --filter 'until=168h' >/dev/null 2>&1 || true
log "cleaned up: kept images $TAG and $PREVIOUS_TAG"
