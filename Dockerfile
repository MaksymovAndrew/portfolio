FROM node:24-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS builder

WORKDIR /app

# inlined into every page at build time: a new address needs a new image, not a restart
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:24-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# the standalone server listens on loopback by default, out of the proxy's reach
ENV HOSTNAME=0.0.0.0
# an unprivileged user cannot bind a port below 1024
ENV PORT=8080

COPY --from=builder --chown=node:node /app/.next/standalone ./
# the standalone output leaves out both folders
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

EXPOSE 8080

# the probe and timings of the server's compose file; busybox wget ships with alpine
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5     CMD wget -qO- http://127.0.0.1:8080/health | grep -q ok || exit 1

USER node

CMD ["node", "server.js"]
