# Baptism & Membership Preparation Management System (BMS)

## Overview
BMS is a digital platform designed to help church leaders track baptism candidates, manage Bible study lessons, monitor spiritual preparation, and maintain structured membership records across multiple congregations.

## Project Structure
- `src/api`: Backend logic and API (Node.js/TypeScript/Express/Prisma).
- `src/web`: Frontend user interface (Next.js/React).
- `src/shared`: Shared types and utilities.
- `docs`: Documentation and design assets.
- `scripts`: Deployment, seeding, and verification scripts.
- `tests`: Automated tests.

## Quality Gate & Verification
To ensure the system is ready for delivery, a final E2E verification suite is provided. This suite automates the "Candidate Journey" and verifies security scoping and audit logging.

### Prerequisites
- Node.js installed.
- Database seeded: `npx prisma db seed`.

### Running Verification
Execute the following command from the project root:
```bash
npm run verify
```

The script will:
1.  **Phase 1: Candidate Journey**: Automate registration, instructor assignment, lesson completion, spiritual interview, and baptism/membership transition.
2.  **Phase 2: Hierarchical Scoping**: Verify that access controls correctly enforce church and district boundaries.
3.  **Phase 3: Audit Log Consistency**: Ensure that all critical actions generate appropriate audit logs.

A detailed report will be output to the console.

## Architecture
For a deep dive into the system architecture and database design, see [docs/architecture/README.md](docs/architecture/README.md).
