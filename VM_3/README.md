# VM3 — API + Database + Monitoring

**IP:** 192.168.56.103  
**OS:** CentOS 7 (kernel 3.10.0-327 → patched to 3.10.0-1160.119.1)  
**Status:** ✅ Fully hardened

## Services

| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | Apache + Nagios XI | 2.2.15 / 5.5.6 |
| 3306/tcp | MySQL | 5.7.29 |
| 3000/tcp | Node.js API | Express |

## Docker Containers

| Container | Image | Port | User |
|---|---|---|---|
| dev_api | sample-express-app | 3000 | service-web ✅ |
| dev_db | mysql:5.7 | 127.0.0.1:3306 | mysql ✅ |
| nostalgic_ganguly | nagiosxi:5.5.6-fixed | 80 | nagios ✅ |

## Vulnerabilities Found & Fixed

| Vulnerability | CVE | Severity | Status |
|---|---|---|---|
| MySQL 3306 exposed externally (root:root) | N/A | Critical | Fixed |
| Nagios XI RCE | CVE-2018-15708/15710 | Critical | Documented |
| Dirty COW kernel | CVE-2016-5836 | Critical | Patched |
| Nagios credentials in xi-sys.cfg | N/A | High | Fixed |
| Nagios XI API key extractable | N/A | High | Fixed |
| PHP 5.3.3 EOL | N/A | High | Documented |
| Apache 2.2.15 EOL | N/A | High | Documented |

## Attack Chain
nmap → MySQL 3306 open (root:root)
→ dump dev_db → admin bcrypt hash
→ dump mysql.user → root hash
→ dump nagiosxi.xi_users → API key
→ CVE-2018-15708 + CVE-2018-15710 → RCE path (documented)

## Fixes Applied
- MySQL restricted to 127.0.0.1:3306
- MySQL root password changed
- API runs as service-web user
- Kernel updated (Dirty COW patched)
- SSH hardened (key-based only)
- Nagios credentials reset
- Nagios SSH check removed
- Nagios NTP fixed
- Container committed as nagiosxi:5.5.6-fixed
