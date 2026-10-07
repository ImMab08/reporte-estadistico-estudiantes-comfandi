# Hostinger VPS deployment

The production Compose file reuses the existing `edumetricks_default` Docker network and the `edumetricks-postgres` container. PostgreSQL remains private and its host data volume is unchanged. Caddy provides HTTPS and proxies the domain to Next.js.

## Prepare the VPS

1. Point the domain's DNS A record to the VPS public IPv4 address. Allow inbound TCP ports 80 and 443 in the Hostinger firewall.
2. Confirm the existing PostgreSQL Compose project is running and the `edumetricks_default` network exists.
3. Create `env.production` from `env.production.example`. Set the actual domain, a unique random `AUTH_SECRET`, and a `DATABASE_URL_DOCKER` using the current database name/user/password. URL-encode any reserved characters in the username or password.
4. Keep `env.production` private and restrict its permissions: `chmod 600 env.production`.

Generate the signing secret on the VPS, without committing it:

```bash
openssl rand -base64 48
```

## Deploy

Run these commands from `/opt/edumetricks/app`:

```bash
docker compose --env-file env.production -f docker-compose.production.yml build web
docker compose --env-file env.production -f docker-compose.production.yml run --rm web npx prisma migrate deploy
docker compose --env-file env.production -f docker-compose.production.yml up -d
docker compose --env-file env.production -f docker-compose.production.yml ps
docker compose --env-file env.production -f docker-compose.production.yml logs -f web caddy
```

The first deploy should not use `prisma migrate reset` or recreate the PostgreSQL volume. Verify the site over HTTPS, administrator login, `/attendance` authentication, and the `/statistics` role restriction before announcing the deployment.

## Update

After pulling a reviewed commit, rebuild, apply forward migrations, and restart:

```bash
docker compose --env-file env.production -f docker-compose.production.yml build web
docker compose --env-file env.production -f docker-compose.production.yml run --rm web npx prisma migrate deploy
docker compose --env-file env.production -f docker-compose.production.yml up -d
```