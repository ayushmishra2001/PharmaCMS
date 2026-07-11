# PharmaCMS - Enterprise Pharmaceutical Content Management System

PharmaCMS is a modern, secure, and fully dynamic Content Management System (CMS) designed specifically for pharmaceutical manufacturers, therapeutic formulators, and distribution networks. Built on Next.js 15, React 19, and TypeScript, it features a dual-database model integrating **Supabase Cloud PostgreSQL** in production and falling back to a mock client for offline development.

---

## Key Features

*   **Therapeutic Catalogue Management**: Create, read, update, and delete products, categories, and active chemical monographs dynamically.
*   **Dynamic CMS Settings**: Real-time editorial controls to customize page branding, contact details, registration metrics, and global navigation menu labels.
*   **Compliance & Audit Logger**: Administrative audit trail capturing editorial events, GMP compliance logs, and security checks.
*   **CRM & Career Portals**: Manage public inquires, newsletter registrations, job postings, and incoming candidate resumes.
*   **Dual-Database Architecture**: Conditionally connects to Supabase database/auth tables if environment variables are provided, falling back to a mock database/auth provider for sandbox testing.
*   **Enterprise-Grade Security**: PBKDF2 password hashing (100,000 iterations) and secure runtime bootstrap password generation for the initial system administrator.

---

## Technology Stack

*   **Framework**: Next.js 15 (App Router & React Server Components)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: TailwindCSS
*   **Database & Auth**: Supabase JS Client & Supabase SSR

---

## Getting Started

### Prerequisites
*   Node.js 18.0.0 or higher
*   npm or yarn

### Installation
1.  Clone the repository and navigate to the project root:
    ```bash
    git clone <repository-url>
    cd PharmaCMS
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```

### Environment Configuration
Create a `.env` file in the root directory and add the following parameters:

```ini
# Server Port Configuration
PORT=3000

# Rate Limiting Controls
RATE_LIMIT_MAX_REQ=15
RATE_LIMIT_WINDOW_MS=300000

# Supabase Credentials (Leave blank to run in offline mock database mode)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
```

### Database Migration
If you are deploying with Supabase, run the SQL script located in the `supabase` migration directory (e.g., `supabase/migration.sql` or from the repository) inside the Supabase **SQL Editor** to create the tables, user roles schema, and initial database seeds.

### Running the Development Server
Start the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Production Build & Deployment

### Build Command
Compile and build the optimized production package:
```bash
npm run build
```

### Vercel Deployment
To deploy the application on Vercel:
1.  Import the repository into the **Vercel Dashboard**.
2.  Configure your environment variables (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) in the project settings.
3.  Deploy. Vercel will build the frontend pages and bundle the serverless API routes automatically.
