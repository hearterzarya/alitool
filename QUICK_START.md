# Quick Start Guide

Get your subscription platform up and running in 30 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Stripe account (free)
- Supabase account (free) or PostgreSQL database

## Step-by-Step Setup

### 1. Initialize Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest growtools --typescript --tailwind --app --src-dir

cd growtools
```

When prompted:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Customize import alias: No

### 2. Install Dependencies

```bash
# Core dependencies
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install stripe @stripe/stripe-js
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install date-fns

# UI components (shadcn/ui)
npx shadcn-ui@latest init
```

When prompted for shadcn:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Install essential shadcn components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
```

### 3. Setup Database (Supabase)

#### Option A: Supabase (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings > Database
4. The connection string looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

#### Option B: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb growtools

# Connection string:
postgresql://localhost:5432/growtools
```

### 4. Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env
```

### 5. Configure Environment Variables

Create `.env.local` file in root:

```env
# Database
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# NextAuth.js
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from stripe.com/dashboard)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Add later after webhook setup

# Email (optional for now)
RESEND_API_KEY=""
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 6. Setup Prisma Schema

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String?
  name          String?
  role          Role           @default(USER)
  emailVerified DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  subscriptions Subscription[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model Tool {
  id               String        @id @default(uuid())
  name             String
  slug             String        @unique
  description      String
  category         String
  isActive         Boolean       @default(true)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  pricingPlans     PricingPlan[]

  @@map("tools")
}

model PricingPlan {
  id             String         @id @default(uuid())
  toolId         String
  name           String
  priceMonthly   Int
  priceAnnual    Int?
  features       String[]
  isPopular      Boolean        @default(false)
  stripePriceId  String?
  createdAt      DateTime       @default(now())

  tool           Tool           @relation(fields: [toolId], references: [id], onDelete: Cascade)
  subscriptions  Subscription[]

  @@map("pricing_plans")
}

model Subscription {
  id                    String   @id @default(uuid())
  userId                String
  planId                String
  status                String   @default("active")
  stripeSubscriptionId  String?  @unique
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  createdAt             DateTime @default(now())

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan                  PricingPlan @relation(fields: [planId], references: [id])

  @@map("subscriptions")
}
```

### 7. Push Schema to Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio to view database
npx prisma studio
```

### 8. Setup Stripe

1. Go to [stripe.com](https://stripe.com) and create account
2. Go to Developers > API Keys
3. Copy "Publishable key" and "Secret key"
4. Add to `.env.local`

Create test products in Stripe:
```bash
# Or manually in Stripe Dashboard:
# Products > Add Product
# - Name: "Pro Plan"
# - Recurring: Monthly
# - Price: $29
# Copy the Price ID (starts with price_)
```

### 9. Create Basic Project Structure

```bash
mkdir -p src/app/api/auth
mkdir -p src/app/api/checkout
mkdir -p src/app/api/webhooks/stripe
mkdir -p src/app/dashboard
mkdir -p src/app/pricing
mkdir -p src/components/pricing
mkdir -p src/lib
```

### 10. Create Prisma Client

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 11. Create Stripe Client

Create `src/lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
```

### 12. Create Landing Page

Replace `src/app/page.tsx`:

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Supercharge Your Growth with Powerful Tools
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access premium tools and services with flexible subscription plans.
            Start growing your business today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tools">Browse Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose GrowTools?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-muted-foreground">
                99.9% uptime guarantee with lightning-fast performance
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Pricing</h3>
              <p className="text-muted-foreground">
                Pay monthly or annually. Cancel anytime, no questions asked
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-2">All-in-One</h3>
              <p className="text-muted-foreground">
                Everything you need in one place. No more tool switching
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 13. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Next Steps

### Phase 1: Authentication (Day 1-2)
1. Setup NextAuth.js
2. Create login/register pages
3. Implement password hashing
4. Add protected routes

### Phase 2: Pricing & Tools (Day 3-4)
1. Create pricing page
2. Build tool catalog
3. Seed database with sample data
4. Add filtering and search

### Phase 3: Stripe Integration (Day 5-7)
1. Create checkout API route
2. Setup webhook handler
3. Test payment flow
4. Handle subscription states

### Phase 4: Dashboard (Day 8-10)
1. Build user dashboard
2. Display active subscriptions
3. Add billing history
4. Implement cancel flow

### Phase 5: Admin Panel (Day 11-14)
1. Create admin routes
2. Build tool management
3. Add user management
4. Implement analytics

## Essential Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npx prisma studio             # Visual database editor
npx prisma generate           # Generate Prisma Client
npx prisma db push            # Push schema changes
npx prisma db seed            # Seed database

# Code Quality
npm run lint                  # Run ESLint
npm run format                # Format with Prettier
```

## Common Issues

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Make sure Supabase project is running
# Verify firewall isn't blocking connection
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Stripe Webhook Failing
```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Guides](https://www.prisma.io/docs/getting-started)
- [Stripe Testing](https://stripe.com/docs/testing)
- [shadcn/ui Components](https://ui.shadcn.com)

## Getting Help

- Check the [TECH_STACK_GUIDE.md](./TECH_STACK_GUIDE.md) for detailed examples
- Review [SUBSCRIPTION_PLATFORM_PLAN.md](./SUBSCRIPTION_PLATFORM_PLAN.md) for architecture
- Search [GitHub Issues](https://github.com/yourusername/growtools/issues)

---

Ready to build? Start with Step 1 above! 🚀
