# CIA — Consolidate, Investigate & Administrate

> Epitech University Project — Infrastructure Security Audit & Hardening

## Overview

This project involves taking ownership of a broken and insecure infrastructure consisting of **4 virtual machines**, performing penetration testing on each, documenting vulnerabilities, exploiting them, and then hardening the systems.

## Infrastructure Map

| VM | IP | Role | Status |
|---|---|---|---|
| VM1 | 192.168.56.101 | Web (React + nginx + FTP) | ✅ Fixed |
| VM2 | 192.168.56.102 | Gitea (CI/CD) | 🔄 In Progress |
| VM3 | 192.168.56.103 | API + Database (Node.js + MySQL) | 🔄 In Progress |
| VM4 | 192.168.56.104 | Monitoring (Portainer + Nagios) | ⏳ Pending |

## Project Requirements

- [x] Web application functional with complete inventory system
- [x] API on separate host from web app
- [x] All services containerised
- [x] All containers run as user `service-web`
- [ ] Complete API logging system
- [ ] Scripted CI/CD with Gitea
- [ ] Artifact management software

## Repository Structure

```
CIA-Project/
├── README.md               ← You are here
├── report/                 ← All pentest reports
│   ├── VM1_Pentest_Report.docx
│   └── Final_Report.docx   (coming last)
├── vm1/                    ← Web VM
│   ├── README.md
│   ├── configs/            ← Fixed config files
│   ├── dockerfiles/        ← Fixed Dockerfiles
│   ├── docker-compose.yml
│   ├── exploits/           ← Exploit notes
│   └── screenshots/        ← Proof of exploitation & fixes
├── vm2/                    ← Gitea VM
├── vm3/                    ← API + DB VM
│   └── src/                ← Modified source code
│       ├── back/           ← Node.js API
│       └── front/          ← React frontend
└── vm4/                    ← Monitoring VM
```

## VM1 — Web Server

### Services Found
- `21/tcp` — ProFTPD 1.3.5rc3
- `22/tcp` — OpenSSH 7.4
- `80/tcp` — nginx 1.16.1 (flatfile PHP app)
- `8080/tcp` — React frontend

### Vulnerabilities Found & Exploited

| Vulnerability | CVE | Severity | Status |
|---|---|---|---|
| ProFTPD mod_copy RCE | CVE-2015-3306 | Critical | Fixed |
| Dirty COW kernel privesc | CVE-2016-5836 | Critical | Patched |
| Root SSH with weak password | N/A | Critical | Fixed |
| shadow.txt exposed via web | N/A | Critical | Fixed |
| robots.txt info disclosure | N/A | Medium | Fixed |
| WorkInProgress public access | N/A | High | Fixed |

### Attack Chain
```
nmap scan → robots.txt → /WorkInProgress/ → shadow.txt
→ crack soupeladmin:BUGZBUNNY → SSH access
→ kernel 3.10.0-327 → Dirty COW → uid=0(root)
```

### Fixes Applied
- React app rebuilt with correct API IP
- WorkInProgress blocked (403)
- robots.txt cleaned
- SSH hardened (key-based only, no root login)
- ProFTPD port 21 restricted to localhost
- mod_copy commands blocked
- Kernel updated to 3.10.0-1160.119.1
- Containers running as service-web user

## VM2 — Gitea

> Details coming soon

## VM3 — API + Database

> Details coming soon

## VM4 — Monitoring

> Details coming soon

## Reports

| Report | Description |
|---|---|
| [VM1 Report](report/VM1_Pentest_Report.docx) | Full pentest + hardening report for VM1 |
| Final Report | Complete overview of all VMs (coming last) |

## How to Run

```bash
# VM1 — Web
ssh sysadmin@192.168.56.101  # key-based auth
cd /home/admin/m1 && docker-compose up -d
cd /home/service-web/front && docker-compose up -d

# VM3 — API + DB
ssh root@192.168.56.103
cd /home/service-web/back && docker-compose up -d
```

## Authors

> Epitech students — TNSA810
