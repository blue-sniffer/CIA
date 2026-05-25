# CIA — Consolidate, Investigate & Administrate

> Epitech University Project — Infrastructure Security Audit & Hardening

## Overview

This project involves taking ownership of a broken and insecure infrastructure consisting of **4 virtual machines**, performing penetration testing on each, documenting vulnerabilities, exploiting them, hardening the systems, and implementing a complete inventory management web application.

## Infrastructure Map

| VM | IP | Role | Status |
|---|---|---|---|
| VM1 | 192.168.56.101 | Web (React + nginx + FTP) | ✅ Complete |
| VM2 | 192.168.56.102 | Gitea (CI/CD) | ✅ Complete |
| VM3 | 192.168.56.103 | API + Database + Monitoring | ✅ Complete |
| VM4 | 192.168.56.104 | Portainer + Nagios NSCA | 🔄 In Progress |

## Project Requirements

- [x] Web application functional with complete inventory system
- [x] Products management (CRUD)
- [x] Orders management (CRUD)
- [x] API on separate host from web app
- [x] All services containerised
- [x] All containers run as user `service-web`
- [x] admin:admin works for acceptance testing
- [x] API logging system (Morgan)
- [ ] Scripted CI/CD with Gitea
- [ ] Artifact management software (Portainer)

## Repository Structure

```
CIA-Project/
├── README.md                          ← You are here
├── report/                            ← All reports
│   ├── VM1_Pentest_Report.docx
│   ├── VM3_Pentest_Report.docx
│   ├── Inventory_Management_Report.docx
│   └── Final_Report.docx              (coming last)
├── back_student/                      ← Backend source code
│   └── src/
│       ├── entity/                    ← User, Product, Order
│       ├── controller/                ← Auth, User, Product, Order
│       ├── routes/                    ← auth, user, product, order
│       ├── migration/                 ← CreateAdminUser, SeedInventoryData
│       └── middlewares/               ← checkJwt, checkRole, checkBody
├── front_student/                     ← Frontend source code
│   └── src/
│       ├── components/                ← Admin, Home, Products, Orders, Users
│       └── store/                     ← Redux actions, reducers, models
├── vm1/                               ← VM1 configs and fixes
│   ├── README.md
│   ├── configs/
│   ├── dockerfiles/
│   ├── exploits/
│   └── screenshots/
├── vm2/                               ← VM2 Gitea
│   └── README.md
├── vm3/                               ← VM3 configs and fixes
│   ├── README.md
│   ├── configs/
│   ├── dockerfiles/
│   └── exploits/
└── vm4/                               ← VM4 Portainer
    └── README.md
```

## VM1 — Web Server (192.168.56.101)

### Services
| Port | Service | Version |
|---|---|---|
| 21/tcp | ProFTPD | 1.3.5rc3 |
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | nginx | 1.16.1 |
| 8080/tcp | React App | node serve |

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
nmap → robots.txt → /WorkInProgress/ → shadow.txt
→ crack soupeladmin:BUGZBUNNY → SSH access
→ kernel 3.10.0-327 → Dirty COW → uid=0(root)
```

### Fixes Applied
- React app rebuilt with correct API IP (192.168.56.103:3000)
- WorkInProgress blocked (403)
- robots.txt cleaned
- SSH hardened (key-based only, no root login)
- ProFTPD port 21 restricted to localhost
- mod_copy commands blocked
- Kernel updated to 3.10.0-1160.119.1
- Containers running as service-web user

## VM2 — Gitea (192.168.56.102)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | Gitea | Latest |
| 222/tcp | Gitea SSH | 7.5 |

> Details in vm2/README.md

## VM3 — API + Database + Monitoring (192.168.56.103)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 |
| 80/tcp | Apache + Nagios XI | 2.2.15 / 5.5.6 |
| 3000/tcp | Node.js API | Express |
| 3306/tcp | MySQL | 5.7.29 (localhost only) |

### Vulnerabilities Found
| Vulnerability | CVE | Severity | Status |
|---|---|---|---|
| MySQL 3306 exposed externally | N/A | Critical | Fixed |
| Nagios XI RCE | CVE-2018-15708/15710 | Critical | Documented |
| Dirty COW kernel | CVE-2016-5836 | Critical | Patched |
| Nagios credentials in xi-sys.cfg | N/A | High | Fixed |
| MySQL root:root default password | N/A | High | Fixed |
| PHP 5.3.3 EOL | N/A | High | Documented |
| Apache 2.2.15 EOL | N/A | High | Documented |

### Attack Chain
```
nmap → MySQL 3306 open (root:root)
→ dump dev_db → admin bcrypt hash
→ dump nagiosxi.xi_users → API key extracted
→ CVE-2018-15708 + CVE-2018-15710 → RCE path (documented)
```

### Fixes Applied
- MySQL restricted to 127.0.0.1:3306
- MySQL root password changed
- API runs as service-web user
- Kernel updated (Dirty COW patched)
- SSH hardened (key-based only)
- Nagios credentials reset
- Nagios SSH check removed
- NTP fixed

## VM4 — Monitoring (192.168.56.104)

### Services
| Port | Service |
|---|---|
| 22/tcp | OpenSSH |
| 8000/tcp | Nagios NSCA |
| 9000/tcp | Portainer |

> Details in vm4/README.md

## Inventory Management System

The web application implements a complete inventory system:

### Backend API (VM3 — Node.js + TypeORM + MySQL)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /product | GET | No | List all products |
| /product/:id | GET | No | Get single product |
| /product | POST | ADMIN | Create product |
| /product/:id | PATCH | ADMIN | Update product |
| /product/:id | DELETE | ADMIN | Delete product |
| /order | GET | ADMIN | List all orders |
| /order/:id | GET | ADMIN | Get single order |
| /order | POST | ADMIN | Create order |
| /order/:id | PATCH | ADMIN | Update order |
| /order/:id | DELETE | ADMIN | Delete order |

### Frontend (VM1 — React + Redux)
- Dashboard with real-time statistics from database
- Products page with Add/Edit/Delete
- Orders page with Create/Delete
- Users page with role management
- JWT authentication

### Dashboard Stats
| Metric | Value |
|---|---|
| Product Count | 5 |
| Product Amount | 133 |
| Summary Price | $231 |
| Sales | $31 |
| Order Amount | 19 |

## How to Run

```bash
# VM1 — Web
ssh sysadmin@192.168.56.101
cd /home/admin/m1 && docker-compose up -d
cd /home/service-web/front && docker-compose up -d

# VM3 — API + DB
ssh sysadmin@192.168.56.103
cd /home/service-web/back && docker-compose up -d

# Access web app
http://192.168.56.101:8080/login
# Login: admin:admin
```

## Reports

| Report | Description |
|---|---|
| [VM1 Report](report/VM1_Pentest_Report.docx) | VM1 pentest + hardening |
| [VM3 Report](report/VM3_Pentest_Report.docx) | VM3 pentest + hardening |
| [Inventory Report](report/Inventory_Management_Report.docx) | Inventory system implementation |
| Final Report | Complete overview (coming last) |

## Authors

> Epitech — TNSA810 — May 2026
