# Technology Stack & Implementation Guide

## Recommended Tech Stack for Subscription Platform

---

## Option 1: Next.js Full-Stack (Recommended)

### Why Next.js?
- Single codebase for frontend and backend
- Built-in API routes
- Server-side rendering for better SEO
- Image optimization
- Easy deployment on Vercel
- TypeScript support out of the box

### Stack Details

```
Frontend:
├── Next.js 14+ (App Router)
├── React 18+
├── TypeScript
├── Tailwind CSS
├── shadcn/ui components
└── React Hook Form + Zod

Backend (API Routes):
├── Next.js API Routes
├── Prisma ORM
└── PostgreSQL

Authentication:
├── NextAuth.js v5 (Auth.js)
└── JWT tokens

Payment:
├── Stripe
└── @stripe/stripe-js

Database:
├── PostgreSQL (Supabase or Railway)
└── Prisma ORM

Deployment:
├── Vercel (Frontend + API)
└── Supabase/Railway (Database)
```

### Project Structure
```
growtools/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   └── tools/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── subscriptions/
│   │   ├── billing/
│   │   └── settings/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── tools/
│   │   ├── users/
│   │   └── analytics/
│   ├── api/
│   │   ├── auth/
│   │   ├── subscriptions/
│   │   ├── webhooks/
│   │   └── payments/
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn components
│   ├── auth/
│   ├── pricing/
│   ├── dashboard/
│   └── admin/
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
└── types/
```

---

## Option 2: React + Express (Separate Frontend/Backend)

### When to Choose This?
- Need complete separation of concerns
- Want to scale frontend and backend independently
- Existing Express backend
- Team expertise in separate architectures

### Stack Details

```
Frontend:
├── React 18+ with TypeScript
├── Vite (build tool)
├── Tailwind CSS
├── shadcn/ui
├── React Router v6
├── TanStack Query (React Query)
├── Zustand (state management)
└── React Hook Form + Zod

Backend:
├── Node.js + Express.js
├── TypeScript
├── Prisma ORM
├── PostgreSQL
├── express-validator
└── helmet (security)

Authentication:
├── JWT (jsonwebtoken)
├── bcryptjs (password hashing)
└── express-session

Payment:
├── Stripe
└── stripe npm package

Deployment:
├── Frontend: Vercel/Netlify
└── Backend: Railway/Render/Fly.io
```

### Project Structure
```
growtools/
├── client/                       # Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
└── server/                       # Backend
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── services/
    │   ├── models/
    │   └── utils/
    └── package.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

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
  image         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  accounts      Account[]
  subscriptions Subscription[]
  payments      Payment[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Tool {
  id               String        @id @default(uuid())
  name             String
  slug             String        @unique
  description      String
  shortDescription String?
  category         String
  features         Json?
  image            String?
  isActive         Boolean       @default(true)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  pricingPlans     PricingPlan[]

  @@map("tools")
}

model PricingPlan {
  id             String         @id @default(uuid())
  toolId         String
  name           String         // Basic, Pro, Enterprise
  priceMonthly   Int            // in cents
  priceAnnual    Int?           // in cents
  billingPeriod  BillingPeriod  @default(MONTHLY)
  features       Json           // Array of features
  isPopular      Boolean        @default(false)
  isActive       Boolean        @default(true)
  stripePriceId  String?        // Stripe Price ID
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  tool           Tool           @relation(fields: [toolId], references: [id], onDelete: Cascade)
  subscriptions  Subscription[]

  @@map("pricing_plans")
}

enum BillingPeriod {
  MONTHLY
  ANNUAL
}

model Subscription {
  id                    String             @id @default(uuid())
  userId                String
  planId                String
  status                SubscriptionStatus @default(ACTIVE)
  stripeSubscriptionId  String?            @unique
  stripeCustomerId      String?
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean            @default(false)
  canceledAt            DateTime?
  trialStart            DateTime?
  trialEnd              DateTime?
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan                  PricingPlan        @relation(fields: [planId], references: [id])
  payments              Payment[]

  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  TRIALING
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
  INCOMPLETE_EXPIRED
}

model Payment {
  id                String        @id @default(uuid())
  userId            String
  subscriptionId    String?
  stripePaymentId   String        @unique
  amount            Int           // in cents
  currency          String        @default("usd")
  status            PaymentStatus
  createdAt         DateTime      @default(now())

  user              User          @relation(fields: [userId], references: [id])
  subscription      Subscription? @relation(fields: [subscriptionId], references: [id])

  @@map("payments")
}

enum PaymentStatus {
  SUCCEEDED
  PENDING
  FAILED
  REFUNDED
}
```

---

## Environment Variables

```env
# .env.local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/growtools"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Key Implementation Files

### 1. Stripe Checkout API Route

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    // Get plan details
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId },
      include: { tool: true },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email,
      line_items: [
        {
          price: plan.stripePriceId!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### 2. Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create subscription in database
      await prisma.subscription.create({
        data: {
          userId: session.metadata!.userId,
          planId: session.metadata!.planId,
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;

      await prisma.payment.create({
        data: {
          userId: invoice.metadata!.userId,
          subscriptionId: invoice.subscription as string,
          stripePaymentId: invoice.payment_intent as string,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'SUCCEEDED',
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date(),
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## Installation Commands

### Option 1: Next.js Project

```bash
# Create Next.js project
npx create-next-app@latest growtools --typescript --tailwind --app

cd growtools

# Install dependencies
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install stripe @stripe/stripe-js
npm install react-hook-form zod @hookform/resolvers
npm install @radix-ui/react-* # shadcn dependencies
npm install lucide-react
npm install date-fns
npm install resend

# Dev dependencies
npm install -D @types/node @types/react
npm install -D eslint prettier

# Initialize Prisma
npx prisma init

# Install shadcn/ui
npx shadcn-ui@latest init
```

### Option 2: React + Express

```bash
# Create client (Vite + React)
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install axios
npm install tailwindcss postcss autoprefixer
npm install react-hook-form zod @hookform/resolvers

# Create server (Express)
mkdir server
cd server
npm init -y
npm install express
npm install typescript @types/express @types/node
npm install prisma @prisma/client
npm install stripe
npm install jsonwebtoken bcryptjs
npm install cors dotenv
npm install express-validator helmet
npm install -D ts-node nodemon
```

---

## Development Workflow

### 1. Database Setup
```bash
# Update prisma/schema.prisma with your schema
# Then run:
npx prisma generate
npx prisma db push

# Or with migrations:
npx prisma migrate dev --name init
```

### 2. Seed Database
```bash
# Create prisma/seed.ts
npx prisma db seed
```

### 3. Run Development Server
```bash
# Next.js
npm run dev

# React + Express
# Terminal 1 (Client)
cd client && npm run dev

# Terminal 2 (Server)
cd server && npm run dev
```

---

## Deployment Guide

### Next.js on Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Database on Supabase

1. Create project on Supabase
2. Copy connection string
3. Update DATABASE_URL
4. Run migrations: `npx prisma db push`

### Stripe Setup

1. Create Stripe account
2. Create products and prices
3. Setup webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Copy webhook secret

---

## Testing

```bash
# Unit tests
npm install -D vitest @testing-library/react

# E2E tests
npm install -D playwright

# Run tests
npm run test
npm run test:e2e
```

---

## Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **PostHog**: Product analytics
- **Stripe Dashboard**: Payment analytics

---

## Next Steps

1. Choose your tech stack (Option 1 or 2)
2. Initialize project with commands above
3. Setup database schema
4. Implement authentication
5. Build core features
6. Integrate Stripe
7. Test thoroughly
8. Deploy

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [NextAuth.js](https://next-auth.js.org)
