FROM node:lts-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY src ./src
COPY public ./public
COPY prisma ./prisma
COPY next.config.mjs .
COPY tsconfig.json .
COPY next-env.d.ts .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG AUTH_TRUST_HOST
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}

ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ARG YANDEX_CLIENT_ID
ENV YANDEX_CLIENT_ID=${YANDEX_CLIENT_ID}
ARG YANDEX_CLIENT_SECRET
ENV YANDEX_CLIENT_SECRET=${YANDEX_CLIENT_SECRET}
ARG DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
ARG DISCORD_CLIENT_SECRET
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

ARG SMTP_EMAIL
ENV SMTP_EMAIL=${SMTP_EMAIL}
ARG SMTP_HOST
ENV SMTP_HOST=${SMTP_HOST}
ARG SMTP_PASS
ENV SMTP_PASS=${SMTP_PASS}
ARG SMTP_PORT
ENV SMTP_PORT=${SMTP_PORT}

ARG TWO_FACTOR_TOKEN_LIFETIME
ENV TWO_FACTOR_TOKEN_LIFETIME=${TWO_FACTOR_TOKEN_LIFETIME}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma db push
RUN npx prisma generate

# Build Next.js based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else yarn build; \
  fi

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG AUTH_TRUST_HOST
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}

ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ARG YANDEX_CLIENT_ID
ENV YANDEX_CLIENT_ID=${YANDEX_CLIENT_ID}
ARG YANDEX_CLIENT_SECRET
ENV YANDEX_CLIENT_SECRET=${YANDEX_CLIENT_SECRET}
ARG DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
ARG DISCORD_CLIENT_SECRET
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

ARG SMTP_EMAIL
ENV SMTP_EMAIL=${SMTP_EMAIL}
ARG SMTP_PASS
ENV SMTP_PASS=${SMTP_PASS}
ARG SMTP_PORT
ENV SMTP_PORT=${SMTP_PORT}
ARG SMTP_HOST
ENV SMTP_HOST=${SMTP_HOST}

ARG TWO_FACTOR_TOKEN_LIFETIME
ENV TWO_FACTOR_TOKEN_LIFETIME=${TWO_FACTOR_TOKEN_LIFETIME}




# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]
