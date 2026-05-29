# CIA — Consolidate, Investigate & Administrate

> Epitech University Project — TNSA810 — May 2026

## Overview

A complete infrastructure security project across **4 virtual machines** involving penetration testing, vulnerability exploitation, hardening, full-stack inventory management development, and CI/CD pipeline automation.

## Infrastructure

| VM | IP | Role | OS | Status |
|---|---|---|---|---|
| VM1 | 192.168.56.101 | Web — React + nginx + ProFTPD | CentOS 7 | ✅ Complete |
| VM2 | 192.168.56.102 | Gitea — CI/CD Pipeline | CentOS 7 | ✅ Complete |
| VM3 | 192.168.56.103 | API + MySQL + Nagios XI | CentOS 7 | ✅ Complete |
| VM4 | 192.168.56.104 | Portainer + OctoberCMS + NSCA | CentOS 7 | ✅ Complete |

---

## Repository Structure

```
CIA-Project/
├── README.md
├── report/
│   ├── VM1_Pentest_Report.docx
│   ├── VM2_Gitea_Report.docx
│   ├── VM3_Pentest_Report.docx
│   ├── VM4_Portainer_Report.docx
│   ├── Inventory_Management_Report.docx
│   └── CIA_Project_Presentation.pptx
├── back_student/                    ← Backend source (Node.js API)
│   └── src/
│       ├── entity/                  ← User, Product, Order
│       ├── controller/              ← Auth, User, Product, Order
│       ├── routes/                  ← auth, user, product, order
│       ├── migration/               ← CreateAdminUser, SeedInventoryData
│       └── middlewares/             ← checkJwt, checkRole, checkBody
├── front_student/                   ← Frontend source (React)
│   └── src/
│       ├── components/              ← Admin, Home, Products, Orders, Users
│       └── store/                   ← Redux actions, reducers, models
├── vm1/
│   ├── README.md
│   ├── configs/                     ← nginx, proftpd, sshd
│   ├── dockerfiles/
│   ├── exploits/
│   └── screenshots/
├── vm2/
│   ├── README.md
│   ├── configs/                     ← app.ini
│   ├── hooks/                       ← post-receive hooks
│   └── scripts/                     ← deploy-front.sh, deploy-back.sh
├── vm3/
│   ├── README.md
│   ├── configs/                     ← ormconfig, sshd, nagios
│   ├── dockerfiles/
│   └── exploits/                    ← Nagios XI CVE notes
└── vm4/
    └── README.md
```

---

## VM1 — Web Server (192.168.56.101)

### Services
| Port | Service | Version |
|---|---|---|
| 21/tcp | ProFTPD | 1.3.5rc3 (restricted to localhost) |
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | nginx | 1.16.1 |
| 8080/tcp | React App | nginx (service-web user) |

### Attack Chain
```
nmap → robots.txt → /WorkInProgress/ → shadow.txt
→ crack soupeladmin:BUGZBUNNY → SSH
→ kernel 3.10.0-327 → Dirty COW → uid=0(root)
```

### Vulnerabilities Found & Fixed
| CVE | Vulnerability | Severity | Status |
|---|---|---|---|
| CVE-2016-5836 | Dirty COW kernel | Critical | ✅ Patched |
| CVE-2015-3306 | ProFTPD mod_copy RCE | Critical | ✅ Fixed |
| N/A | shadow.txt exposed via web | Critical | ✅ Fixed |
| N/A | Root SSH weak password | Critical | ✅ Fixed |
| N/A | robots.txt info disclosure | Medium | ✅ Fixed |
| N/A | WorkInProgress publicly accessible | High | ✅ Fixed |
| N/A | React API URL hardcoded localhost | High | ✅ Fixed |
| N/A | API container running as root | High | ✅ Fixed |

---

## VM2 — Gitea CI/CD (192.168.56.102)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 (host) |
| 80/tcp | Gitea | 1.4.0 |
| 222/tcp | OpenSSH | 7.5 (Gitea container) |

### Vulnerabilities Found & Fixed
| CVE | Vulnerability | Severity | Status |
|---|---|---|---|
| CVE-2016-5836 | Dirty COW kernel | Critical | ✅ Patched |
| N/A | Default SSH root:admin | Critical | ✅ Fixed |
| N/A | Weak SECRET_KEY = amsosupersecret | High | ✅ Rotated |
| N/A | Git hooks disabled (blocks CI/CD) | Medium | ✅ Enabled |
| N/A | Admin credentials in docker-compose | High | ✅ Documented |
| N/A | Gitea 1.4.0 outdated (2018) | High | ⚠️ Documented |

### CI/CD Pipeline
```
git push (Kali)
    ↓
Gitea receives push (VM2)
    ↓
post-receive hook fires
    ↓
SSH via deploy key
    ↓
VM1: git fetch + reset --hard → docker-compose up --build → React updated ✅
VM3: git fetch + reset --hard → docker-compose up --build → API updated ✅
```

### Repositories
- `n0tth3adm1n/front-end` — React frontend
- `n0tth3adm1n/back-end` — Node.js API

---

## VM3 — API + Database + Monitoring (192.168.56.103)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | Apache + Nagios XI | 2.2.15 / 5.5.6 |
| 3000/tcp | Node.js API | Express |
| 3306/tcp | MySQL | 5.7.29 (localhost only) |

### Attack Chain
```
nmap → MySQL 3306 open (root:root)
→ dump dev_db → admin bcrypt hash
→ dump nagiosxi.xi_users → API key extracted
→ CVE-2018-15708 + CVE-2018-15710 → RCE path (documented)
```

### Vulnerabilities Found & Fixed
| CVE | Vulnerability | Severity | Status |
|---|---|---|---|
| CVE-2016-5836 | Dirty COW kernel | Critical | ✅ Patched |
| CVE-2018-15708/15710 | Nagios XI RCE | Critical | ⚠️ Documented |
| N/A | MySQL 3306 exposed (root:root) | Critical | ✅ Fixed |
| N/A | Nagios credentials in xi-sys.cfg | High | ✅ Fixed |
| N/A | MySQL root default password | High | ✅ Fixed |
| N/A | API container running as root | High | ✅ Fixed |
| N/A | PHP 5.3.3 EOL (inside Nagios) | High | ⚠️ Documented |

---

## VM4 — Portainer + OctoberCMS (192.168.56.104)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | OctoberCMS | 1.0.412 |
| 8000/tcp | Nagios NSCA | - |
| 9000/tcp | Portainer | 1.23.0 |

### Vulnerabilities Found & Fixed
| CVE | Vulnerability | Severity | Status |
|---|---|---|---|
| CVE-2016-5836 | Dirty COW kernel | Critical | ✅ Patched |
| N/A | Default SSH root:admin | Critical | ✅ Fixed |
| N/A | Portainer uninitialized (no admin) | High | ✅ Fixed |
| N/A | OctoberCMS creds in bootstrap.py | High | ✅ Fixed |
| N/A | OctoberCMS crash loop | Medium | ✅ Fixed |
| N/A | Portainer 1.23.0 outdated | Medium | ⚠️ Documented |

### Portainer Endpoints
| Endpoint | IP | Containers |
|---|---|---|
| VM1-WEB | 192.168.56.101:9001 | 5 containers |
| VM3-API | 192.168.56.103:9001 | 4 containers |
| VM4-Portainer | 192.168.56.104:9001 | 6 containers |

---

## Inventory Management System

### Architecture
```
React Frontend (VM1:8080)
    ↓ HTTP API calls
Node.js + Express + TypeORM (VM3:3000)
    ↓ SQL queries
MySQL 5.7 (VM3:3306 — localhost only)
```

### API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/login | No | Get JWT token |
| GET | /product | No | List all products |
| POST | /product | ADMIN | Create product |
| PATCH | /product/:id | ADMIN | Update product |
| DELETE | /product/:id | ADMIN | Delete product |
| GET | /order | ADMIN | List all orders |
| POST | /order | ADMIN | Create order |
| PATCH | /order/:id | ADMIN | Update order |
| DELETE | /order/:id | ADMIN | Delete order |
| GET | /user | ADMIN | List users |

### Dashboard Stats (live from database)
| Metric | Value |
|---|---|
| Product Count | 5 |
| Product Amount | 133 |
| Summary Price | $231 |
| Sales | $31 |
| Order Amount | 19 |

---

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React · TypeScript · Redux · Axios · nginx |
| Backend | Node.js · Express · TypeORM · JWT |
| Database | MySQL 5.7 |
| Containers | Docker · docker-compose · Portainer |
| CI/CD | Gitea · Git Hooks · SSH Deploy Keys |
| Monitoring | Nagios XI 5.5.6 · Nagios Core 4.4.2 · NSCA |
| CMS | OctoberCMS 1.0.412 |
| Pentest Tools | nmap · john · curl · Dirty COW · Metasploit |

---

## How to Access

```bash
# Web Application
http://192.168.56.101:8080/login
# Login: admin:admin

# Gitea
http://192.168.56.102
# Login: localadmin / MySecureWebPassword2026!

# Nagios XI
http://192.168.56.103/nagiosxi/
# Login: nagiosadmin / admin123

# Portainer
http://192.168.56.104:9000
# Login: admin / (set during setup)

# OctoberCMS
http://192.168.56.104/backend
# Login: Gr0wb0l055 / rMHHBAl1hI
```

## CI/CD Usage

```bash
# Clone from Gitea
git clone http://192.168.56.102/n0tth3adm1n/front-end.git
git clone http://192.168.56.102/n0tth3adm1n/back-end.git

# Push changes — auto deploys to VM1/VM3
git add .
git commit -m "feat: my changes"
git push origin master
# Frontend rebuilt on VM1 automatically
# Backend rebuilt on VM3 automatically
```

## Project Requirements

- [x] Penetration testing on all 4 VMs
- [x] All vulnerabilities documented with CVEs
- [x] All critical vulnerabilities fixed
- [x] Web application functional
- [x] Products management (CRUD)
- [x] Orders management (CRUD)
- [x] API on separate host from frontend
- [x] All services containerised
- [x] Containers run as non-root (service-web)
- [x] admin:admin works for acceptance testing
- [x] API logging (Morgan)
- [x] CI/CD pipeline with Gitea
- [x] Artifact management (Portainer)
- [x] Complete pentest reports per VM

## Reports

| Report | Description |
|---|---|
| [VM1 Report](report/VM1_Pentest_Report.docx) | VM1 pentest + hardening |
| [VM2 Report](report/VM2_Gitea_Report.docx) | Gitea + CI/CD pipeline |
| [VM3 Report](report/VM3_Pentest_Report.docx) | API + DB + Nagios pentest |
| [VM4 Report](report/VM4_Portainer_Report.docx) | Portainer + OctoberCMS |
| [Inventory Report](report/Inventory_Management_Report.docx) | Full-stack implementation |
| [Presentation](report/CIA_Project_Presentation.pptx) | Project presentation |

---

> Epitech — TNSA810 — May 2026
