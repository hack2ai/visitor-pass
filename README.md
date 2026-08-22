# AI Visitor Pass Management System

> A production-oriented visitor management platform for digital registration, host approval, QR-based pass verification, and administrative monitoring.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

## Overview

The **AI Visitor Pass Management System** digitizes the visitor lifecycle for organizations that need a structured, auditable process for registration, approval, pass issuance, QR verification, and administrative monitoring.

The published application uses a typed full-stack architecture with a React frontend, Node.js/Express REST API, Prisma ORM, and PostgreSQL persistence.

## Core Workflow

```text
Visitor Registration
        ↓
Authentication & Validation
        ↓
Host / Admin Review
        ↓
Approve / Reject
        ↓
Visitor Pass + QR Verification
        ↓
Activity Tracking & Analytics
```

## Key Features

### Visitor Management

- Visitor registration
- Visitor profile management
- Approval and rejection workflow
- Visitor status tracking
- Search and filtering
- Administrative visitor records

### Pass & Verification

- Digital visitor pass generation
- QR-based pass verification
- Verification workflow for authorized users
- Pass lifecycle/status handling

### Administration

- Protected administrative routes
- Role-based authorization
- Dashboard metrics
- Visitor statistics
- Recent activity
- Reports and operational views
- Application settings

### Engineering

- REST API architecture
- PostgreSQL persistence
- Prisma ORM
- TypeScript across the application layers
- Responsive React interface

## Architecture

```text
                    React + TypeScript
                           │
                      REST / JSON
                           │
                           ▼
                  Node.js + Express API
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Authentication   Visitors    Verification
              │            │            │
              └────────────┼────────────┘
                           ▼
                       Prisma ORM
                           │
                           ▼
                      PostgreSQL
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Axios |
| Backend | Node.js, Express.js, TypeScript |
| Authentication | JWT-based authentication |
| Database | PostgreSQL |
| ORM | Prisma |
| API | REST / JSON |
| QR | QR-based pass verification |
| Development | Git, GitHub, ESLint, Vite |

## Project Structure

```text
visitor-pass/
├── frontend/        # React application
├── backend/         # Node.js / Express API
├── prisma/          # Prisma schema and migrations
├── package.json
└── README.md
```

The repository source is the definitive reference for the current directory structure.

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL
- npm

### Installation

```bash
git clone https://github.com/hack2ai/visitor-pass.git
cd visitor-pass
npm install
```

Configure the backend environment using the repository's environment configuration. At minimum, provide the PostgreSQL `DATABASE_URL` and an application-specific JWT secret where required.

Generate Prisma Client and apply the development migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the frontend and backend with the development scripts defined in `package.json`.

## Security

Visitor-management software handles personal and operational data, so authorization boundaries are important.

Current design considerations include:

- Authentication for protected application areas
- Role-based administrative access
- JWT-based authorization
- Environment-based secrets
- PostgreSQL persistence through Prisma

For production deployment, additionally enforce:

- HTTPS everywhere
- Strict CORS allowlists
- API rate limiting
- Secure secret management and rotation
- Centralized audit logging
- Strong authorization checks on every sensitive endpoint
- Input validation and consistent error handling
- Database least-privilege access
- Backup and recovery procedures
- Dependency vulnerability scanning

**Never commit database credentials, JWT secrets, API keys, or other sensitive configuration to GitHub.**

## Production Deployment Checklist

- [ ] Configure production environment variables
- [ ] Use hardened/managed PostgreSQL
- [ ] Enable HTTPS
- [ ] Configure trusted CORS origins
- [ ] Enable API rate limiting
- [ ] Configure structured application logging
- [ ] Review all admin authorization boundaries
- [ ] Run Prisma migrations as part of a controlled deployment
- [ ] Verify QR/pass validation rules
- [ ] Configure monitoring and backups
- [ ] Perform a security review before handling real organizational visitor data

## Demo / Showcase

For a recruiter-facing demonstration, the strongest screens to showcase are:

1. Landing/login screen
2. Visitor registration
3. Admin dashboard
4. Visitor approval workflow
5. Generated visitor pass
6. QR verification screen
7. Visitor activity/analytics

## Project Value

This project demonstrates practical **full-stack engineering, REST API design, authentication, authorization, relational data modeling, Prisma ORM, QR-based verification, workflow design, and administrative analytics**.

It is particularly relevant to real-world environments such as offices, campuses, events, residential communities, and controlled-access facilities.

## Author

**Pankaj (Tony) Kumar**  
AI Engineer • Full Stack Developer • Generative AI & RAG Specialist

[GitHub](https://github.com/hack2ai) • [LinkedIn](https://www.linkedin.com/in/pankaj-kumar-ab591a216)

## License

See the repository license file for the applicable project license.
