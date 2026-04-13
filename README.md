# PixelMarket Nexus

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**PixelMarket Nexus** is an elite digital marketplace designed for software assets, UI/UX kits, 3D foundations, and specialized developer infrastructure. It features a robust multi-vendor architecture and a high-performance, tech-first user experience.

## 🚀 Infrastructure & Stack

The platform is powered by a robust, cloud-native architecture:

- **Frontend**: Next.js (App Router) for hybrid rendering and optimized performance.
- **Styling**: Premium UI design with custom Glassmorphism and dark-mode optimization.
- **Backend/DB**: Supabase (PostgreSQL) deployed in the **us-east-1** region for low-latency global availability.
- **State Management**: Zustand for light-weight, reactive operational state.
- **Auth**: Secure, tiered access control via Supabase Auth services.

## 📁 Repository Architectural Overview

- `src/app/`: Core application routes and API endpoints.
- `src/components/`: Modular UI system with premium 'Nexus' branding.
- `src/lib/`: Domain repositories and database abstractions (Repository Pattern).
- `src/locales/`: Internationalization layer (EN/ES support).
- `src/types/`: Unified TypeScript domain models.
- `database/`: Schema migrations (`migrations/`) and absolute schema (`all.sql`).

### Schema Normalization (English-First)
The platform has undergone a full schema migration to standardize on English identifiers:
- `usuarios` → `users`
- `pedidos` → `orders`
- `detalle_pedido` → `order_items`
- `direcciones` → `addresses`
- `productos` → `products`
- `categorias` → `categories`

## 🛠️ Operational Setup

### Prerequisites
- Node.js 18+
- Supabase Project Credentials

### Deployment Sequence
1. **Source Sync**: `git clone` the repository.
2. **Dependency Initialization**: `npm install`
3. **Environment Configuration**: Configure `.env` with your Nexus-tier Supabase credentials (URL, Service Role, Project Ref).
4. **Database Initialization**: Apply the schema from `database/all.sql` and relevant migrations from `database/migrations/`.
5. **Boot Sequence**: `npm run dev` for local operations.

## 🛰️ API (Nexus Endpoint Map)

Endpoints live in `src/app/api/**/route.ts`.

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- **Products Catalog**
  - `GET /api/products` (Filtered by Category/Vendor)
  - `POST /api/products` (Admin/Vendor Access)
  - `GET/PUT/DELETE /api/products/[id]`
- **Ordering System**
  - `POST /api/orders` (Secure Checkout)
  - `GET /api/orders` (Management View)
- **Marketing**
  - `POST /api/coupons/validate`
  - `GET /api/promotions`

## 🔒 Roles & Access Control

The Nexus environment enforces a tiered permission system:
- `admin`: Full system oversight.
- `vendor`: Catalog and fulfillment management.
- `customer`: Asset acquisition and profile management.
- `moderator`: Content integrity and disputes.

## 🚀 Roadmap

### Phase 1: Core Consolidation (COMPLETED)
- [x] Infrastructure migration to `us-east-1`.
- [x] Schema normalization to English identifiers.
- [x] Unified product repository pattern.

### Phase 2: Professional Expansion
- [ ] Real-time marketplace metrics with Supabase Realtime.
- [ ] Multi-currency support refinement.
- [ ] Integration with global payment gateways (Stripe/Wompi).

## 🤝 Contributing
- Maintain "English-first" naming for all code artifacts.
- Execute build verification (`npm run build`) before synchronization.
