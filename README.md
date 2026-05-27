# CIA — Consolidate, Investigate & Administrate

> Epitech University Project — Infrastructure Security Audit, Hardening & Full-Stack Development

## Overview

This project involves taking ownership of a broken and insecure infrastructure consisting of **4 virtual machines**, performing penetration testing on each, documenting vulnerabilities, exploiting them, hardening the systems, implementing a complete inventory management web application, and setting up a CI/CD pipeline.

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
- [x] CI/CD pipeline with Gitea (auto-deploy on push)
- [ ] Artifact management software (Portainer — VM4)

## Repository Structure

```
CIA-Project/
├── README.md                               ← You are here
├── report/                                 ← All reports
│   ├── VM1_Pentest_Report.docx
│   ├── VM2_Gitea_Report.docx
│   ├── VM3_Pentest_Report.docx
│   ├── Inventory_Management_Report.docx
│   └── Final_Report.docx                   (coming last)
├── back_student/                           ← Backend source code
│   └── src/
│       ├── entity/                         ← User, Product, Order
│       ├── controller/                     ← Auth, User, Product, Order
│       ├── routes/                         ← auth, user, product, order
│       ├── migration/                      ← CreateAdminUser, SeedInventoryData
│       └── middlewares/                    ← checkJwt, checkRole, checkBody
├── front_student/                          ← Frontend source code
│   └── src/
│       ├── components/                     ← Admin, Home, Products, Orders, Users
│       └── store/                          ← Redux actions, reducers, models
├── vm1/                                    ← VM1 configs and fixes
│   ├── README.md
│   ├── configs/                            ← nginx, proftpd, sshd
│   ├── dockerfiles/                        ← Fixed Dockerfiles
│   ├── exploits/                           ← Dirty COW notes
│   └── screenshots/
├── vm2/                                    ← VM2 Gitea + CI/CD
│   ├── README.md
│   ├── configs/                            ← app.ini
│   ├── hooks/                              ← post-receive hooks
│   └── scripts/                            ← deploy scripts
├── vm3/                                    ← VM3 configs and fixes
│   ├── README.md
│   ├── configs/                            ← ormconfig, sshd, nagios
│   ├── dockerfiles/                        ← Fixed Dockerfiles
│   └── exploits/                           ← Nagios XI CVE notes
└── vm4/                                    ← VM4 Portainer
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
| 8080/tcp | React App | node serve (service-web user) |

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

---

## VM2 — Gitea CI/CD (192.168.56.102)

### Services
| Port | Service | Version |
|---|---|---|
| 22/tcp | OpenSSH | 7.4 (host) |
| 80/tcp | Gitea | 1.4.0 |
| 222/tcp | OpenSSH | 7.5 (Gitea container) |

### Vulnerabilities Found
| Vulnerability | CVE | Severity | Status |
|---|---|---|---|
| Root SSH default password | N/A | Critical | Fixed |
| Dirty COW kernel | CVE-2016-5836 | Critical | Patched |
| Weak SECRET_KEY | N/A | High | Fixed |
| Admin credentials in source | N/A | High | Fixed |
| Git hooks disabled | N/A | Medium | Fixed |
| Gitea 1.4.0 outdated | N/A | High | Documented |

### CI/CD Pipeline
```
git push → Gitea (VM2)
      ↓
post-receive hook fires
      ↓
SSH with deploy key
      ↓
VM1 → deploy-front.sh    VM3 → deploy-back.sh
→ git pull               → git pull
→ docker-compose build   → docker-compose build
→ React updated ✅       → API updated ✅
```

### Repositories
- `n0tth3adm1n/front-end` — React frontend source
- `n0tth3adm1n/back-end` — Node.js API source

---

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

### Attack Chain
```
nmap → MySQL 3306 open (root:root)
→ dump dev_db → admin bcrypt hash
→ dump nagiosxi.xi_users → API key extracted
→ CVE-2018-15708 + CVE-2018-15710 → RCE path (documented)
```

---

## VM4 — Monitoring (192.168.56.104)

### Services
| Port | Service |
|---|---|
| 22/tcp | OpenSSH |
| 8000/tcp | Nagios NSCA |
| 9000/tcp | Portainer |

> Details in vm4/README.md — In Progress

---

## Inventory Management System

### Backend API (VM3 — Node.js + TypeORM + MySQL)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /auth/login | POST | No | Authenticate and get JWT token |
| /product | GET | No | List all products |
| /product/:id | GET | No | Get single product |
| /product | POST | ADMIN | Create product |
| /product/:id | PATCH | ADMIN | Update product |
| /product/:id | DELETE | ADMIN | Delete product |
| /order | GET | ADMIN | List all orders |
| /order | POST | ADMIN | Create order |
| /order/:id | PATCH | ADMIN | Update order |
| /order/:id | DELETE | ADMIN | Delete order |
| /user | GET | ADMIN | List users |

### Frontend (VM1 — React + Redux)
- Dashboard with real-time statistics from database
- Products page with full CRUD (Add/Edit/Delete)
- Orders page with Create/Delete
- Users page with role management
- JWT authentication

### Dashboard Stats (from real database)
| Metric | Value |
|---|---|
| Product Count | 5 |
| Product Amount | 133 |
| Summary Price | $231 |
| Sales | $31 |
| Order Amount | 19 |

---

## How to Run

```bash
# VM1 — Web (auto-started via restart:always)
ssh sysadmin@192.168.56.101
sudo docker ps  # verify all containers running

# VM2 — Gitea (auto-started)
ssh -i ~/.ssh/vm2_admin_key root@192.168.56.102 -p 22
docker ps  # verify gitea running

# VM3 — API + DB (auto-started via restart:always)
ssh sysadmin@192.168.56.103
sudo docker ps  # verify all containers running

# Access web app
http://192.168.56.101:8080/login
# Login: admin:admin

# Access Gitea
http://192.168.56.102
# Login: localadmin / MySecureWebPassword2026!

# Access Nagios XI
http://192.168.56.103/nagiosxi/
# Login: nagiosadmin / admin123

# Access Portainer
http://192.168.56.104:9000
```

## CI/CD Usage

```bash
# Clone repos from Gitea
git clone http://192.168.56.102/n0tth3adm1n/front-end.git
git clone http://192.168.56.102/n0tth3adm1n/back-end.git

# Make changes and push — auto deploys!
git add .
git commit -m "feat: my changes"
git push origin master
# → Frontend/Backend automatically rebuilt and deployed
```

## Reports

| Report | Description |
|---|---|
| [VM1 Report](report/VM1_Pentest_Report.docx) | VM1 pentest + hardening |
| [VM2 Report](report/VM2_Gitea_Report.docx) | VM2 Gitea + CI/CD pipeline |
| [VM3 Report](report/VM3_Pentest_Report.docx) | VM3 pentest + hardening |
| [Inventory Report](report/Inventory_Management_Report.docx) | Inventory system implementation |
| Final Report | Complete overview (coming last) |

## Authors

> Epitech — TNSA810 — May 2026
