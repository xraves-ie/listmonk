# Updating the Xraves fork from upstream

The checkout uses `master`, matching the official Listmonk repository. A merge
workflow is recommended because it preserves the history of published Xraves
release commits and tags without force-pushing rewritten commits.

## One-time remote setup

```sh
git remote add upstream https://github.com/knadh/listmonk.git
git remote -v
```

If `upstream` already exists, verify its URL rather than adding it again.

## Update workflow

1. Create and verify a PostgreSQL backup for any deployed environment.
2. Fetch both remotes and inspect the incoming release notes and migrations.
3. Create a short-lived update branch from the current Xraves `master`.
4. Merge upstream and resolve only genuine conflicts.

```sh
git fetch --tags upstream
git fetch origin
git switch master
git pull --ff-only origin master
git switch -c update/upstream-vX.Y.Z
git merge --no-ff upstream/master
```

Keep the newest upstream implementation when resolving a conflict, then reapply
the small Xraves hook. The expected conflict surface is documented in
`docs/XRAVES_CUSTOMIZATIONS.md`. Never copy the entire old Xraves version of an
upstream component over a new upstream version.

## Verification checklist

- Confirm `.go-version`, `go.mod`, both `package.json` files, and Zerops build
  versions still agree. Update the Go archive URL and checksum in `zerops.yaml`
  if upstream changes Go.
- Install both frontend dependency trees with frozen committed lockfiles.
- Run `yarn lint` and `yarn build` in `frontend/`.
- Run `yarn build` in `frontend/email-builder/`.
- Run `go test ./...`.
- Run `make dist` and verify the final `listmonk` executable exists and reports
  its version.
- Start against a disposable PostgreSQL database, run an idempotent install,
  verify `/health`, and exercise login and core admin navigation.
- Confirm the Xraves wordmark, title, favicon, footer, and theme remain intact.
- Review every new file under `internal/migrations/` and determine whether the
  production deployment requires `XRAVES_DB_MODE=upgrade`.
- Validate `zerops.yaml` against the current Zerops specification and supported
  base list.
- Scan the diff and tracked files for credentials, tokens, generated build
  output, or accidental dependency caches.

Open a pull request from the update branch, deploy it to staging, and merge it
to `master` only after the checklist passes. Tag the production commit with an
Xraves release tag, for example:

```sh
git switch master
git merge --no-ff update/upstream-vX.Y.Z
git tag -a xraves-vX.Y.Z-1 -m "Xraves release based on Listmonk vX.Y.Z"
git push origin master --follow-tags
```

If a database migration has run, do not roll the binary back independently.
Restore the pre-upgrade database backup together with the prior binary, or
prepare a tested forward fix.
