# AI Visitor Pass Management System

> A production-oriented full-stack visitor management platform for digital registration, approval, verification, and administrative monitoring.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

## Overview

The **AI Visitor Pass Management System** digitizes the visitor lifecycle for organizations that need a structured and auditable process for registration, host approval, pass verification, and administrative monitoring.

The application is built as a typed full-stack system with a React frontend, Node.js/Express REST API, Prisma ORM, and PostgreSQL persistence.

## Core Workflow

```text
Visitor Registration
        ↓
Authentication / Validation
        ↓
Host or Admin Review
        ↓
Approve / Reject
        ↓
Visitor Pass + QR Verification
        ↓
Activity Tracking / Analytics
```

## Key Features

- Secure user authentication
- Protected routes
- Role-based administrative access
- Visitor registration and management
- Approval / rejection workflow
- Visitor status tracking
- QR-based pass verification
- Administrative dashboard
- Visitor statistics and analytics
- Recent visitor activity
- Search, filtering and reports
- Profile management
- Application settings
- REST API architecture
- PostgreSQL persistence with Prisma
- Responsive React interface
- Type-safe TypeScript implementation

## Architecture

```text
React + TypeScript Frontend
            │
            │ REST / JSON
            ▼
Node.js + Express API
            │
      ┌─────┴─────┐
      │           │
 Authentication  Visitor Services
      │           │
      └─────┬─────┘
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
| API | REST |
| Development | Git, GitHub, ESLint, Vite |

## Security Considerations

- Authentication is enforced for protected application areas.
- Role-based access is used for administrative operations.
- Secrets and database credentials should be provided through environment variables.
- JWT configuration should use a strong, deployment-specific secret.
- Production deployments should use HTTPS and secure cookie/header configuration where applicable.
- Database credentials must never be committed to source control.

## Project Structure

```text
.
├── frontend/        # React application
├── backend/         # Node.js / Express API
├── prisma/          # Prisma schema and migrations
├── package.json
└── README.md
```

> Directory names can vary slightly with the current implementation; the repository source is the source of truth.

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

Configure the backend environment according to the repository's environment example/configuration, including the PostgreSQL `DATABASE_URL` and JWT secret.

Then generate Prisma Client and apply the database migrations used by the project:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the frontend and backend using the development scripts defined in `package.json`.

## Production Checklist

Before deployment:

- Configure production environment variables.
- Use a managed PostgreSQL database or hardened PostgreSQL deployment.
- Enable HTTPS.
- Rotate JWT and database credentials appropriately.
- Restrict CORS to trusted origins.
- Add rate limiting and structured logging at the API boundary.
- Run database migrations deliberately during deployment.
- Review authorization for every administrative endpoint.
- Do not expose secrets in frontend bundles.

## Project Value

This project demonstrates practical full-stack engineering across **frontend development, REST API design, authentication, authorization, relational data modeling, ORM usage, QR verification, and administrative analytics**.

## Author

**Pankaj (Tony) Kumar**  
AI Engineer • Full Stack Developer • Generative AI & RAG Specialist

[GitHub](https://github.com/hack2ai) • [LinkedIn](https://www.linkedin.com/in/pankaj-kumar-ab591a216)

## License

See the repository license file for the applicable project license.
