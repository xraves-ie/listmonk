# Xraves customizations

This fork keeps Xraves-specific code in `frontend/src/xraves/` and deployment
files at the repository root. The goal is to make upstream merges mechanical
and keep Listmonk behavior unchanged.

## Repository and build findings

The repository is an upstream-style Go application with a Vue 2/Buefy admin
frontend and a separate React/TypeScript email builder.

- Go is pinned to **1.26.1** in both `.go-version`, `go.mod`, and upstream CI.
- Neither frontend declares a Node.js version. The strictest installed tool is
  Vite 6.4.2 in the email builder; Vite 6 supports Node 18, 20, and 22+. This
  fork standardizes Zerops builds on supported LTS **Node.js 22**.
- Both frontend packages declare **Yarn Classic 1.22.22** through their
  `packageManager` field. Lockfiles are committed and Zerops uses
  `--frozen-lockfile`. The pipeline skips the unused Cypress browser binary
  while retaining the Cypress package for upstream dependency consistency.
- `make dist` installs `stuffbin`, compiles a `CGO_ENABLED=0` Go binary, builds
  the email builder into `frontend/public/static/email-builder`, builds the
  Vue frontend into `frontend/dist`, and packs the frontend plus SQL, queries,
  permissions, public templates, email templates, and translations into the
  final binary.
- Build-only system tools are GNU Make, a POSIX shell, Git, standard Unix file
  utilities, CA certificates, `curl`, and `tar`. A C compiler is not needed.
- Runtime needs only the packed `listmonk` binary, a POSIX shell for the
  lifecycle wrapper, CA certificates, and timezone data. Node.js and source
  assets are not runtime dependencies.
- Configuration precedence is flags, TOML, then `LISTMONK_` environment
  variables. Nested environment keys use a double underscore, for example
  `LISTMONK_db__host`. Environment-only startup requires `--config=""`.
- `/health` is a real unauthenticated endpoint returning HTTP 200. The admin
  `/api/health` endpoint is authenticated and is not used by Zerops.
- `--install` is destructive unless `--idempotent` is also passed. `--upgrade`
  runs idempotent versioned migrations. Normal startup refuses a missing or
  outdated schema rather than modifying it.

## Xraves-specific files

- `frontend/src/xraves/branding.js`: product copy, organization, title, footer,
  favicon, logo hook, and documented placeholder colors.
- `frontend/src/xraves/theme.scss`: Xraves theme tokens and small wordmark/footer
  styles. Current colors intentionally match upstream until final colors exist.
- `frontend/src/xraves/assets/xraves-logo.png`: official transparent Xraves
  wordmark downloaded from the URL supplied by Xraves.
- `frontend/src/xraves/assets/README.md`: asset replacement instructions. The
  favicon remains an explicit placeholder until a suitable square asset is
  supplied.
- `scripts/zerops-start.sh`: validates database configuration and runs only an
  explicitly requested install or upgrade before starting the server.
- `zerops.yaml`: source build, minimal runtime, service references, port, and
  health/readiness checks.
- `.env.example`: safe local variable names and placeholders.
- `docs/ZEROPS_DEPLOYMENT.md`: production deployment and database lifecycle.
- `docs/UPSTREAM_UPDATES.md`: upstream synchronization workflow.

## Upstream files modified

- `README.md`: adds two links to fork-specific documentation.
- `frontend/index.html`: changes the static initial title and no-JavaScript
  message.
- `frontend/src/main.js`: derives route titles and favicon from the centralized
  branding object.
- `frontend/src/App.vue`: renders the configured logo or accessible text
  wordmark, configured favicon, and footer copy.
- `frontend/src/assets/style.scss`: replaces two literal upstream palette values
  with Xraves theme variables. All remaining upstream styles are unchanged.

No Go files, schemas, migrations, API contracts, or upstream Docker support are
changed.

## Changing the final brand

1. Add optimized assets under `frontend/src/xraves/assets/`.
2. Import them in `branding.js` and populate `logoUrl` or `faviconUrl`.
3. Replace the placeholder palette in both `branding.js` and `theme.scss`.
4. Update product/footer copy only in `branding.js`.
5. Run frontend lint/build and `make dist`.

Listmonk's public subscriber pages already use database-managed `app.site_name`,
`app.logo_url`, `app.favicon_url`, and custom CSS settings. Configure those in
Admin > Settings rather than adding another fork-specific template layer.

## Likely merge conflicts

Conflicts should be limited to `frontend/index.html`, `frontend/src/main.js`,
`frontend/src/App.vue`, `frontend/src/assets/style.scss`, and the README. During
resolution, retain upstream logic first, then reapply the small branding import,
bindings, title formatting, and two Sass variable assignments. Do not replace a
new upstream component with an old fork copy.

Follow the complete merge and verification checklist in
`docs/UPSTREAM_UPDATES.md`.
