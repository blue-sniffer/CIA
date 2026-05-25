# VM1 — Web Server

**IP:** 192.168.56.101  
**OS:** CentOS 7 (kernel 3.10.0-327 → patched to 3.10.0-1160.119.1)  
**Status:** ✅ Fully hardened

## Services

| Port | Service | Version |
|---|---|---|
| 21/tcp | ProFTPD | 1.3.5rc3 |
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | nginx | 1.16.1 |
| 8080/tcp | React App | node serve |

## Docker Containers

| Container | Image | Port | User |
|---|---|---|---|
| front_front_1 | front_front | 8080→8080 | service-web ✅ |
| m1_nginx_1 | m1_nginx | 80→80 | nginx ✅ |
| m1_flatfile_1 | m1_flatfile | internal | nginx ✅ |
| m1_proftpd_1 | m1_proftpd | 127.0.0.1:21 | nobody ✅ |

## Vulnerabilities & Fixes

### 1. CVE-2015-3306 — ProFTPD mod_copy RCE
**Severity:** Critical  
**Description:** mod_copy allowed unauthenticated file copy via SITE CPFR/CPTO  
**Fix:**
- Disabled CPFR/CPTO via `<Limit>` blocks in proftpd.conf
- Removed mod_copy from compiled modules
- Restricted port 21 to localhost only

### 2. CVE-2016-5836 — Dirty COW
**Severity:** Critical  
**Kernel:** 3.10.0-327 (vulnerable)  
**Description:** Race condition allowing local privilege escalation to root  
**Exploit chain:** soupeladmin (low priv) → dirty_static → uid=0(root)  
**Fix:** `yum update kernel -y` → 3.10.0-1160.119.1

### 3. Root SSH with weak password
**Severity:** Critical  
**Credentials:** root:admin  
**Fix:** PermitRootLogin no, PasswordAuthentication no, key-based auth only

### 4. shadow.txt exposed via web
**Severity:** Critical  
**URL:** http://192.168.56.101/WorkInProgress/shadow.txt  
**Fix:** Removed shared volume, fixed Dockerfile, blocked /WorkInProgress/

### 5. robots.txt info disclosure
**Severity:** Medium  
**Fix:** Removed Disallow: /WorkInProgress/ entry

### 6. WorkInProgress public access
**Severity:** High  
**Fix:** nginx location block → deny all, return 403

## Screenshots

Add your screenshots here:
- `screenshots/nmap_scan.png`
- `screenshots/workInProgress_found.png`
- `screenshots/shadow_downloaded.png`
- `screenshots/ssh_soupeladmin.png`
- `screenshots/dirtycow_uid0.png`
- `screenshots/fixes_verified.png`

## Files in this folder

```
vm1/
├── README.md               ← This file
├── configs/
│   ├── nginx.conf.template ← Fixed (WorkInProgress blocked)
│   ├── proftpd.conf        ← Fixed (mod_copy disabled)
│   └── sshd_config         ← Fixed (no root, no password auth)
├── dockerfiles/
│   ├── Dockerfile.front    ← Fixed (service-web user)
│   ├── Dockerfile.proftpd  ← Fixed (no mod_copy, no shadow)
│   └── Dockerfile.flatfile
├── docker-compose.yml      ← Fixed (FTP localhost only)
├── exploits/
│   └── dirtycow_notes.md   ← Exploit methodology
└── screenshots/
```
