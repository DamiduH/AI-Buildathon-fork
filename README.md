# AI Buildathon Website

A unified, secure React and Next.js web application serving as the registration portal and administration dashboard for the **AI Buildathon**. 

This repository consolidates the entire application into a single, cohesive codebase utilizing a standard Next.js `src/` directory layout.

---

## Key Benefits of the Consolidated Architecture

- **Unified Codebase:** Simplified dependency management using a single root `package.json` for React, Next.js, and style processors.
- **No CORS Overheads:** By hosting the user landing page, the API routes, and the admin control panel on the same origin, cross-origin resource sharing constraints are eliminated.
- **Consolidated Environment Files:** Single `.env.local` file houses both public client configuration properties and backend security secrets.
- **Optimized Performance:** Next.js pre-renders the informational landing page statically (SSG) for ultra-fast load times, while rendering the admin control panel dynamically (SSR) for real-time data access.

---

## Directory Structure

```
AI-Buildathon/
├── db/                       # Database scripts
│   └── schema.sql            # Postgres schema migration setup
├── public/                   # Static site assets
│   ├── assets/               # Logos, hero banner, favicon
│   └── favicon.png           # Default site favicon
├── src/                      # Application source code
│   ├── components/           # UI components (Header, Hero, Toolkit, Timeline, RegisterModal)
│   ├── context/              # Modal visibility provider context
│   ├── data/                 # Static data sets (departments, timelines)
│   ├── hooks/                # Dynamic animations & scroll controllers (Lenis, Particles, Canvas)
│   ├── lib/                  # Helper utilities (Supabase, Firebase, CSV export, validation)
│   ├── pages/                # Client pages, admin routes, and backend API routes
│   │   ├── _app.js           # App initialization and styling wraps
│   │   ├── _document.js      # Head tags and global script scripts
│   │   ├── admin/            # Dashboard page (/admin) and Login page (/admin/login)
│   │   ├── api/              # API endpoints (/api/registrations, /api/health, /api/admin/*)
│   │   └── index.jsx         # Public landing page (React root component)
│   └── styles/               # Styling configuration
│       ├── globals.css       # Tailwind directives & CSS base styles
│       └── styles.css        # Core custom-themed visual styles (verbatim)
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusions
├── next.config.js            # Next.js configurations & security CSP headers
├── package.json              # Unified project scripts & dependencies
├── postcss.config.js         # CSS pre-processing config
└── tailwind.config.js        # Tailwind configurations
```

---

## Local Development Setup

Follow these steps to set up and run the application locally:

### 1. Database Configuration
1. Create a project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `db/schema.sql` and run the migration script to create the `registrations` table and configure Row Level Security (RLS).

### 2. Environment Configurations
1. Copy the `.env.example` template to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the required environment variables:
   - **Supabase credentials:** Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (use the secret `service_role` key from Supabase settings to bypass RLS securely on server-side writes).
   - **CAPTCHA settings:** Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. (For local development, you can use Cloudflare's "always passes" test keys).
   - **Admin access allowlist:** Set `ADMIN_EMAILS` to a comma-separated list of Google account emails allowed to access the dashboard.
   - **Firebase API config:** Obtain Client SDK credentials from the Firebase console and assign them to `NEXT_PUBLIC_FIREBASE_*` variables.
   - **Firebase Admin SDK keys:** Download service account private keys from the Firebase console and map them to `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY`.

### 3. Dependencies Installation
Install dependencies in the root directory:
```bash
npm install
```

### 4. Running the Development Server
Start the Next.js local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the landing page.

---

## Data Flow & Anti-Abuse Defenses

To maximize database security, the client browser never queries or writes to Supabase directly. All transactions go through Next.js server-side endpoints which enforce a sequence of security validations:

```
[Browser UI Form] 
       │
       ▼
 1. IP Rate Limiter ────► Rejects excessive requests from a single IP (5 submissions / 10 mins).
       │
       ▼
 2. Honeypot Filter ───► Captures automated bot scripts filling in hidden inputs.
       │
       ▼
 3. CAPTCHA Check ──────► Verifies Cloudflare Turnstile tokens server-side.
       │
       ▼
 4. Length Capping ─────► Validates formats and caps inputs to prevent DoS attacks.
       │
       ▼
 5. Duplicate Check ────► Rejects emails already registered in Supabase Auth (409 Conflict).
       │
       ▼
[Database Transaction] (Executed using secure service_role keys)
```

---

## Administration Control Panel (`/admin`)

An administration dashboard is built-in at `/admin` (decoulped from public navigation maps). 

### Features
- **Real-Time Registrations List:** Supports searching, sorting, and drill-down views of registered teams and members.
- **CSV Data Export:** Exports the table data into standard CSV files. All cell contents are automatically sanitized against spreadsheet formula injections.
- **Secure Google Sign-In:** Utilizes Firebase Authentication with Google Popup widgets.
- **Server allowlist Verification:** Every server-side request re-verifies the user's email against the `ADMIN_EMAILS` array.
- **Strict Content Security Policy (CSP):** The `/admin` paths are isolated under a strict CSP directive config (defined in `next.config.js`) that blocks untrusted resources and mitigates XSS/CSRF attempts.
