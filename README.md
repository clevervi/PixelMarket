# Online Store - Latido Ancestral

## Description

*Latido Ancestral* is an online store specializing in the sale of handmade Colombian handicrafts. Our goal is to promote ancestral culture and tradition through products such as vueltiao hats, hammock chairs, bags, bracelets, clothing and more, made with traditional techniques and natural materials.

The site offers a simple and intuitive experience for users to browse collections, learn about the essence of each product and make purchases.

## Technologies

- **Next.js 16** - React framework for production
- **TypeScript** - Static typing for JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - JavaScript library for interfaces
- **ESLint** - Linter to maintain clean code

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          (Main layout)
│   ├── page.tsx            (Homepage)
│   ├── globals.css         (Global styles)
│   ├── essence/            (Our Essence)
│   ├── collections/        (Collections)
│   │   └── [id]/          (Dynamic category)
│   ├── inspiration/        (Inspiration)
│   ├── contact/            (Contact)
│   └── products/
│       └── [id]/          (Product detail)
├── components/
│   ├── Header.tsx          (Navigation)
│   ├── Footer.tsx          (Footer)
│   └── ProductCard.tsx     (Product card)
├── data/
│   └── products.ts         (Product data)
└── types/
    └── index.ts            (TypeScript types)
```

## Main Features

- Clear and accessible navigation with header menu  
- Responsive design adapted for computers, tablets and mobile devices  
- Organized sections to display products with images, description, price and purchase links  
- Use of smooth animations to enhance visual experience  
- SEO-optimized metadata.

## Installation and Usage

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kate1560/Tienda_Virtual.git
cd Tienda_Virtual
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Open browser at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server
- `npm run lint` - Runs the linter to check code

## Environment Variables

Create a `.env.local` file in the project root with at least:

```bash
# PostgreSQL connection (Supabase database)
DB_HOST=your-db-host                 # e.g. db.xxxxxx.supabase.co
DB_PORT=5432
DB_USER=your-db-user                 # e.g. postgres
DB_PASSWORD=your-db-password
DB_NAME=your-db-name                 # in Supabase usually: postgres
DB_POOL_MAX=10                       # optional

# Internal auth token (HMAC cookie used by the Next.js backend)
AUTH_SECRET=change_me_in_production  # secret for signing auth cookies

# Supabase project keys (Auth + SQL API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only, NEVER expose publicly

NODE_ENV=development
```

`DB_*` variables are used by `src/lib/db.ts` to create the PostgreSQL connection pool **pointing to your Supabase database** (this project no longer needs a local PostgreSQL instance).
`AUTH_SECRET` is used by `src/lib/auth.ts` to sign the `auth_token` cookie.
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by the browser client for Supabase Auth.
`SUPABASE_SERVICE_ROLE_KEY` is used **only on the server** (e.g. `/api/auth/register`, `/api/auth/login`) and must remain secret.

## Database Setup with Supabase (PostgreSQL only)

This project is designed to run **only** on a managed PostgreSQL provided by **Supabase**. You do **not** need any local PostgreSQL server.

### 1. Create a Supabase project

1. Go to the Supabase dashboard and create a new project.
2. Choose a strong database password.
3. Wait for the project to finish provisioning.

### 2. Get database connection details and API keys

In your project, go to **Settings → Database → Connection info** and copy:

- Host
- Port (default: 5432)
- Database name (usually `postgres`)
- User (usually `postgres`)
- Password

Then go to **Project Settings → API** and copy:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

Use these values to fill the environment variables shown above.

### 3. Configure `.env.local` to point to Supabase

Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME` using the values from **Settings → Database**. This makes all calls that use `pg` (through `src/lib/db.ts`) talk directly to your Supabase PostgreSQL.

Make sure you do **not** leave the default `localhost` values in production.

### 4. Apply the schema (`database/all.sql`)

1. In Supabase, open **SQL Editor**.
2. Copy the contents of `database/all.sql` from this repository.
3. Make sure the target schema is `public`.
4. Run the script.

The script will:

- Create all enums, tables, indexes, functions and triggers needed by the app.
- Insert seed data for roles, configuration, categories, one demo vendor, some products and a welcome coupon (`BIENVENIDA10`).
- Insert three example users in the `usuarios` table (admin, vendor owner and customer) with fixed UUIDs and emails `admin@latidoancestral.com`, `vendor@latidoancestral.com` and `cliente@latidoancestral.com`.

You can safely edit or remove the seed data section at the bottom of `all.sql` if you prefer a clean database.

### 5. Create real users (Supabase Auth + `usuarios`)

User accounts are managed with **Supabase Auth** and mirrored in the `usuarios` table using the same UUID. The recommended flow is:

1. Start the app locally with `npm run dev`.
2. Open `http://localhost:3000/register`.
3. Register a new user (customer). This will:
   - Create a Supabase Auth user via `supabase.auth.admin.createUser`.
   - Insert a row in `public.usuarios` with the same `id`.
   - Issue the internal `auth_token` cookie for backend guards.
4. Log in via `http://localhost:3000/login`, which verifies credentials against Supabase Auth and then reads the profile from `usuarios`.

To promote an existing user to **admin** or **vendor**, edit the row in `usuarios` using the Supabase Table Editor or SQL, for example:

```sql
-- Promote a user to admin
UPDATE usuarios SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Promote a user to vendor (and optionally link to an existing vendor row)
UPDATE usuarios SET role = 'vendor', vendor_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE email = 'your-vendor-email@example.com';
```

If you prefer to use the seeded demo users from `all.sql`, you must also create matching Supabase Auth users (same emails) in **Authentication → Users** and then ensure their `id` values match the `usuarios.id` values (or adjust the `usuarios` IDs to match Supabase). For most setups it is simpler to create new users via `/register` and ignore/remove the seeded ones.

### 6. (Optional) Row Level Security (RLS) in Supabase

The bottom of `database/all.sql` already contains example RLS policies for `usuarios`, `wishlist`, `pedidos`, `cupones_usuarios` and `direcciones`. They are designed to work when the app uses Supabase JWTs (for example from `supabase-js`).

The current backend uses a direct database connection (via `pg`) with a service-level role, so those queries are not blocked by RLS. If you enable these policies, make sure that:

- Client-side calls that use `supabase-js` respect the policies.
- Server-side calls that must bypass RLS use the service role connection (as they do now).

## Project Overview and Architecture

This project is a complete **multi-vendor e‑commerce platform** for *Latido Ancestral / Ancestral Heartbeat*, built only with **Next.js 16 (App Router)** and **Supabase PostgreSQL**.

Key goals:

- Sell Colombian handmade products (sombreros vueltiaos, mochilas Wayuu, textiles, etc.).
- Support multiple vendors (marketplace) with their own store dashboards.
- Provide a professional shopping experience: catalog, cart, checkout, coupons, wishlist, orders, tracking.
- Keep all backend logic inside **Next.js API routes** (no separate Express server).

### Main Modules

- **Public Storefront**
  - Home with highlighted collections and products.
  - Category and collection pages.
  - Product detail pages with gallery, description, price, stock, vendor info and reviews.
  - Style / inspiration content pages.
  - Language support (ES/EN) and visual theme consistent with the brand.

- **Shopping Experience**
  - Persistent cart (client side + API).
  - Checkout page: addresses, shipping method, payment method (extensible).
  - Coupons and discounts.
  - Wishlist for registered users.

- **User Account / Dashboard**
  - Profile and address management.
  - Wishlist and order history.
  - For vendors: list of products, orders and basic analytics.
  - For admins: global orders / users / vendors overview.

- **Admin & Multi‑Vendor**
  - Vendors (`vendors` table) with commission, contact info and branding.
  - Vendor applications and approval flow.
  - Vendor payouts and basic reporting tables.

### Tech Stack

- **Frontend / Backend**: Next.js 16 (App Router), React 19, TypeScript.
- **Styles**: Tailwind CSS.
- **Database**: Supabase PostgreSQL using the schema in `database/all.sql`.
- **Backend access to DB**: `pg` pool (`src/lib/db.ts`).
- **Authentication**:
  - Supabase Auth (email + password).
  - Internal `auth_token` cookie signed with `AUTH_SECRET` for server‑side guards.
- **State / Hooks**: React hooks and simple stores for cart, language, user session.

### Roles and Example Users

User roles are defined in the enum `user_role`:

- `admin` – global administrator of the platform.
- `vendor` – owner or manager of a specific store/vendor.
- `customer` – regular customer.
- `moderator` – content / reviews moderation.
- `provider` – reserved for future integrations.

Typical example users you can configure in Supabase (see `README_SUPABASE.md` for the exact SQL):

- **Global Admin** → `katemartinez1507@gmail.com` (`role = 'admin'`).
- **Example Store Owner** → `admin@latido.com` (`role = 'vendor'`, linked to a row in `vendors`).
- **Store Manager** → `manager@latido.com` (vendor/manager of the same store).
- **Demo Customer** → `user@latido.com` (`role = 'customer'`).

These users live in **Supabase Auth** and are mirrored in the `usuarios` table with the same `id` (UUID).

### Directory Structure (high level)

- `src/app/` – Next.js App Router pages, layouts and API routes.
  - `page.tsx` – public homepage.
  - `cart/`, `checkout/`, `wishlist/` – shopping flows.
  - `login/`, `register/`, `forgot-password/`, `reset-password/` – auth flows.
  - `dashboard/` – user, vendor and admin dashboards.
  - `api/` – backend endpoints (auth, products, cart, orders, wishlist, etc.).
- `src/components/` – shared UI components (headers, footers, product cards, etc.).
- `src/lib/` – infrastructure code:
  - `db.ts` – PostgreSQL pool and helpers.
  - `auth.ts` – auth token cookie helpers.
  - `supabaseClient.ts` – Supabase browser & service clients.
  - `repositories/` – data access for users, products, orders, wishlist, etc.
- `database/all.sql` – full PostgreSQL schema and seed data, ready for Supabase.

### Development Workflow

1. Configure `.env.local` (see section **Environment Variables**).
2. Create a Supabase project and run `database/all.sql` (see **README_SUPABASE.md**).
3. Install dependencies (`npm install`).
4. Start development server: `npm run dev`.
5. Visit `http://localhost:3000` to explore the storefront and dashboards.

### Next Steps / Ideas

Some ideas that can be added on top of the current implementation:

- Real payment gateway integration (e.g. Stripe, PayPal, Wompi).
- Advanced vendor analytics and reports.
- More granular permissions per role.
- Full RLS adoption using Supabase Auth on both client and server.

## Authors

*Kateryn Martinez, Adrian Villegas, Samuel Reyes, and collaborators*




quiero que en el siguiente paso revisemos ".env.local", y hacer un test
