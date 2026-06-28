# SSH Host Audit - 2026-06-04

Purpose: resolve ambiguity between the verified production SSH host and the stale legacy host.

## Active Host

- Alias: `ariadashboardssh`
- Windows alias: `ariadashboardssh-win`
- Address: `5.159.49.125`
- User: `root`
- Config: `C:/Projects/morodomino/ssh_config`
- Key: `C:/Projects/morodomino/keys2/private-key-file.pem`
- Known hosts: `C:/Projects/morodomino/keys2/known_hosts`

Verification command:

```bash
ssh -F C:/Projects/morodomino/ssh_config ariadashboardssh-win "echo PRIMARY_OK && hostname && uptime"
```

Observed result on 2026-06-04:

- `PRIMARY_OK`
- Hostname: `srv6469746549`
- Authentication: public key

## Quarantined Host

- Previous aliases: `morodomino2`, `morodomino2-win`
- Previous address: `62.106.95.208`
- Status: blocked
- Reason: strict SSH host-key mismatch.

Failed verification command:

```bash
ssh -F C:/Projects/morodomino/ssh_config morodomino2-win "echo LEGACY_OK && hostname && uptime"
```

Observed failure on 2026-06-04:

- Remote host identification changed.
- ED25519 fingerprint sent by remote:
  - `SHA256:RipmcT1vp6O5QLu8bjUTmsCTLp+UnsoewA3nTDQKB3k`
- Offending old key:
  - `C:/Projects/morodomino/keys/known_hosts:3`

## Resolution

- Changed `morodomino2` and `morodomino2-win` from active SSH aliases to explicit fail-closed blocked aliases.
- Blocked aliases point at `127.0.0.1:1` with `BatchMode yes`, password auth disabled, and a short timeout.
- Removed `morodomino2` from active `.codex-local/network-routing.json` profiles.
- Recorded `morodomino2` under `quarantinedProfiles`.
- Left old `keys/known_hosts` entries untouched as evidence.

## Reinstatement Rule

Do not restore `morodomino2` or update its known-hosts entry unless the new fingerprint is verified through an independent trusted channel.
