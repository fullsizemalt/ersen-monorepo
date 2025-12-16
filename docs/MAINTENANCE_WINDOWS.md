# Maintenance Window Best Practices

**Version**: 1.0  
**Last Updated**: December 2025

---

## Pre-Launch (Current Phase)

During alpha/beta development, maintenance can be performed on-the-fly:

- ✅ Hot deploys during development hours
- ✅ Database schema changes with minimal notice
- ✅ Infrastructure changes (LUKS, network, etc.) as needed
- ⚠️ Still notify via Discord/Slack if downtime > 5 minutes

---

## Post-Launch Protocol

Once paying customers exist, follow this protocol:

### 1. Scheduling

| Maintenance Type | Notice | Window | Channel |
|------------------|--------|--------|---------|
| **Routine** (deploys, patches) | 24 hours | 2-4 AM PST Tue/Thu | Status page |
| **Urgent** (security fixes) | 4 hours | ASAP | Email + Status + Discord |
| **Emergency** (critical outage) | 0 hours | Immediate | All channels |

### 2. Communication Template

```markdown
## Scheduled Maintenance

**When**: [Date] [Time]-[Time] PST
**Duration**: ~[X] minutes
**Impact**: [What users will experience]
**Reason**: [Brief explanation]

We'll update this page when complete.
```

### 3. Checklist Before Maintenance

- [ ] Backup completed and verified
- [ ] Rollback plan documented
- [ ] Status page updated to "Scheduled Maintenance"
- [ ] On-call engineer confirmed available
- [ ] Estimated completion time communicated

### 4. During Maintenance

- [ ] Status page shows "Under Maintenance"
- [ ] Monitor logs for issues
- [ ] Test core functionality after changes
- [ ] Update ETA if running long

### 5. After Maintenance

- [ ] Status page updated to "Operational"
- [ ] Smoke test all critical paths (login, widgets, payments)
- [ ] Post-maintenance summary in #team-ops

---

## Infrastructure-Specific Procedures

### Database (PostgreSQL)

```bash
# Pre-maintenance backup
docker exec ersen-db-1 pg_dump -U ersen ersen > backup_$(date +%Y%m%d).sql

# Verify backup
ls -la backup_*.sql
```

### LUKS Encrypted Volume

After any VPS reboot, manually unlock:

```bash
sudo cryptsetup luksOpen --key-file=/root/.ersen_luks_key /var/lib/ersen_encrypted.img ersen_encrypted
sudo mount /dev/mapper/ersen_encrypted /mnt/encrypted_postgres
cd /srv/containers/ersen && docker compose -f docker-compose.prod.yml -f docker-compose.encrypted.yml up -d
```

### SSL Certificates

Traefik auto-renews via Let's Encrypt. If issues:

```bash
docker compose -f docker-compose.prod.yml restart traefik
# Check: https://ersen.xyz (no cert warnings)
```

---

## Incident Response Levels

| Level | Definition | Response Time | Escalation |
|-------|------------|---------------|------------|
| P1 | Service down, data loss risk | 15 min | Immediate page |
| P2 | Major feature broken | 1 hour | Slack alert |
| P3 | Minor bug, workaround exists | 24 hours | Normal sprint |
| P4 | Cosmetic/enhancement | Next sprint | Backlog |
