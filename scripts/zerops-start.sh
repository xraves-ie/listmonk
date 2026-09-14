#!/bin/sh
set -eu
set -o pipefail

: "${LISTMONK_db__host:?Required environment variable LISTMONK_db__host is not set.}"
: "${LISTMONK_db__port:?Required environment variable LISTMONK_db__port is not set.}"
: "${LISTMONK_db__user:?Required environment variable LISTMONK_db__user is not set.}"
: "${LISTMONK_db__password:?Required environment variable LISTMONK_db__password is not set.}"
: "${LISTMONK_db__database:?Required environment variable LISTMONK_db__database is not set.}"

case "${XRAVES_DB_MODE:-none}" in
  none)
    ;;
  install)
    echo "Running idempotent first-time database installation."
    ./listmonk --config="" --install --idempotent --yes
    ;;
  upgrade)
    echo "Running idempotent database migrations."
    ./listmonk --config="" --upgrade --yes
    ;;
  *)
    echo "XRAVES_DB_MODE must be one of: none, install, upgrade." >&2
    exit 1
    ;;
esac

exec ./listmonk --config=""
