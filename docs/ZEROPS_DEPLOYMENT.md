# Deploy Xraves Campaigns to Zerops

This deployment builds directly from GitHub. It does not use Docker and does
not run PostgreSQL inside the application service.

The configuration follows the current Zerops
[pipeline specification](https://docs.zerops.io/zerops-yaml/specification),
[GitHub integration guide](https://docs.zerops.io/references/github-integration),
and [PostgreSQL connection model](https://docs.zerops.io/postgresql/how-to/connect).

## Architecture

Create exactly these services in one Zerops project:

1. `dblistmonk`: `postgresql:ha@18` for production. Use
   `postgresql:single@18` only for development/staging where database downtime
   is acceptable.
2. `listmonk`: `alpine@3.24`, with the service hostname exactly `listmonk`.

The `zerops.yaml` build phase uses `ubuntu/nodejs@22`, downloads the
repository-required Go 1.26.1 archive from `go.dev`, verifies its pinned SHA-256,
and runs upstream `make dist`. Only `listmonk` and
`scripts/zerops-start.sh` are deployed. The runtime installs only CA
certificates and timezone data and listens on port 9000.

Zerops currently exposes Go 1.22 as its named Go runtime, which cannot compile
this checkout's `go 1.26.1` module. Installing the official pinned Go toolchain
inside the supported Node build base is therefore intentional. Revisit this
when Zerops adds a Go 1.26 base.

## Environment variables

`zerops.yaml` maps Listmonk's required runtime variables to the managed service
variables generated for `dblistmonk`:

| Listmonk variable | Zerops value |
| --- | --- |
| `LISTMONK_app__address` | `0.0.0.0:9000` |
| `LISTMONK_db__host` | `${dblistmonk_hostname}` |
| `LISTMONK_db__port` | `${dblistmonk_port}` (internal port 5432) |
| `LISTMONK_db__user` | `${dblistmonk_user}` |
| `LISTMONK_db__password` | `${dblistmonk_password}` |
| `LISTMONK_db__database` | `${dblistmonk_dbName}` |
| `LISTMONK_db__ssl_mode` | `disable` |

Internal PostgreSQL port 5432 is private and does not support TLS on Zerops, so
`ssl_mode=disable` is correct for service-to-service traffic. If the PostgreSQL
service has another hostname, update only the six `${dblistmonk_*}` references in
`zerops.yaml`.

Add `XRAVES_DB_MODE` as a service secret only when performing a database action:

- `install`: first installation; runs `--install --idempotent --yes`.
- `upgrade`: existing installation; runs `--upgrade --yes`.
- unset or `none`: normal startup; does not change the database.

Optionally add `LISTMONK_ADMIN_USER` and `LISTMONK_ADMIN_PASSWORD` as Zerops
secrets before the first install for a non-interactive initial administrator.
The username must be at least 3 characters and the password at least 8. The
preferred approach is to omit both and create the first administrator in the
browser. Never place credentials in Git or `zerops.yaml`.

## First deployment

1. Create the `dblistmonk` service and wait until it is ready.
2. Create the `listmonk` Alpine service.
3. In `listmonk` service secrets, set `XRAVES_DB_MODE=install`. Add the optional
   administrator secrets only if browser setup is not desired.
4. Open **Build, Deploy, Run Pipeline Settings**, connect the GitHub fork, and
   authorize Zerops for the repository.
5. For staging, select **Push to branch** and a dedicated branch such as
   `staging`. For production, select **New tag** and filter Xraves release tags,
   for example `^xraves-v[0-9]+\.[0-9]+\.[0-9]+-[0-9]+$`.
6. Trigger the first deployment. The startup wrapper performs the idempotent
   install once and then starts Listmonk.
7. Confirm the pipeline readiness check and `https://<service>/health` return
   HTTP 200.
8. Remove `XRAVES_DB_MODE` (or change it to `none`) and restart the service so a
   future container restart cannot request installation again.
9. Open the admin UI and create the first super administrator if it was not
   supplied through secrets.

The install mode cannot wipe an existing database: the wrapper always combines
`--install` with `--idempotent`. It is still deliberately opt-in rather than run
on every deployment.

## Domains and HTTPS

In Zerops public access, route the desired domain to the `listmonk` service on
port 9000 and enable managed HTTPS. Point DNS exactly as Zerops instructs and
wait for certificate issuance. Then set Listmonk's public root URL, site name,
logo URL, favicon URL, and trusted URLs in Admin > Settings.

## Upgrades and normal deployments

For a code-only release with no new migrations, leave `XRAVES_DB_MODE` unset and
push the staging branch or production tag. Zerops rebuilds from source and the
startup wrapper launches the binary without touching the schema.

When the upstream release contains migrations:

1. Back up PostgreSQL and verify the backup can be restored.
2. Set the `listmonk` secret `XRAVES_DB_MODE=upgrade`.
3. Deploy the tested release tag. `temporaryShutdown: true` stops the old binary
   before the new binary runs the idempotent migration, matching Listmonk's
   documented upgrade ordering.
4. Verify `/health`, login, dashboard queries, and a non-sending campaign flow.
5. Remove the variable (or set `none`) and restart the service.

Schema upgrades are forward-only for practical purposes. Rolling back code
after a migration may require restoring the matching pre-upgrade backup.

## SMTP and media

Configure SMTP later in Admin > Settings; no SMTP credentials belong in the
repository. Check that the selected Zerops plan permits the provider's outbound
SMTP port.

The application container filesystem is not durable business storage. For
production media uploads, configure Listmonk's S3-compatible media provider
against durable object storage rather than relying on a local `uploads/`
directory.

## Local development without Docker

Install Go 1.26.1, Node.js 22, Yarn 1.22.22, GNU Make, and PostgreSQL 14 or
newer (local or externally reachable). Then:

```sh
export LISTMONK_app__address=127.0.0.1:9000
export LISTMONK_db__host=127.0.0.1
export LISTMONK_db__port=5432
export LISTMONK_db__user=listmonk
export LISTMONK_db__password='local-password'
export LISTMONK_db__database=listmonk
export LISTMONK_db__ssl_mode=disable

make dist YARN="yarn --frozen-lockfile --non-interactive"
./listmonk --config="" --install --idempotent --yes
./listmonk --config=""
```

For split frontend development, run the backend with `make run` and the Vite
server with `make run-frontend`; use `frontend/.env.sample` to point Vite at the
backend. Keep local credentials in an ignored shell profile or `config.toml`,
never in `.env.example`.
