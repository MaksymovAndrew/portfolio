FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS builder

WORKDIR /app

# inlined into every page at build time: a new address needs a new image, not a restart
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS runner

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
