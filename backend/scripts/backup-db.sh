#!/usr/bin/env bash
# Daily dump of the production database, kept on the VPS for the last 7 days. It is the undo for a
# bad migration or a bug that damages data: it restores findraco alone, without rolling back the
# other apps on the VPS. Losing the VPS itself is covered by the provider's weekly backup, which
# also picks these files up.
#
# Install (as root on the VPS):
#   install -m 700 backend/scripts/backup-db.sh /opt/findraco-backup.sh
#   echo '0 4 * * * root /opt/findraco-backup.sh >> /var/log/findraco-backup.log 2>&1' > /etc/cron.d/findraco-backup
#
# Restore one dump (stop the API first):
#   sudo -u postgres pg_restore --clean --if-exists -d finsight < /root/backups/findraco-<date>.dump
# (through stdin: the postgres user cannot read /root). Tested 2026-10-31 into a scratch database:
# every table matched production row for row.
set -euo pipefail

DATABASE=finsight
BACKUP_DIR=/root/backups
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"
target="$BACKUP_DIR/findraco-$(date -u +%Y%m%dT%H%MZ).dump"

# Peer authentication as the local superuser: no password stored anywhere.
sudo -u postgres pg_dump -Fc "$DATABASE" > "$target.partial"
pg_restore -l "$target.partial" > /dev/null
mv "$target.partial" "$target"

find "$BACKUP_DIR" -name 'findraco-*.dump' -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) backup ok: $target ($(du -h "$target" | cut -f1))"
