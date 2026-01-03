# GrowTools - Shared Account Access Platform

## Business Model

**Platform Type**: Shared account access via cookie injection
**Revenue Model**: Monthly subscriptions per tool
**Cookie Model**: Shared cookies (multiple users access same account)
**Access Method**: Browser extension for seamless cookie injection

---

## How It Works

### User Journey
1. **Browse Tools** → User visits public catalog (no login required)
2. **Select Tool** → Choose tool to purchase (e.g., "ChatGPT Plus - $8/month")
3. **Make Payment** → Pay via Stripe (monthly recurring subscription)
4. **Access Dashboard** → View purchased tools in dashboard
5. **Click "Access Tool"** → Browser extension injects cookies → Opens tool in new window
6. **Use Tool** → User is automatically logged into the shared account

### Admin Journey
1. **Add Tool** → Create tool with name, description, price, URL
2. **Paste Cookies** → Manually paste cookies from browser (JSON format)
3. **Tool Goes Live** → Users can now purchase and access
4. **Monitor Expiry** → Get notified when cookies expire
5. **Update Cookies** → Paste fresh cookies when needed

---

## Technical Architecture

### Tech Stack

```typescript
Frontend:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS + shadcn/ui
├── React Hook Form + Zod
└── Zustand (state management)

Backend:
├── Next.js API Routes
├── Prisma ORM
├── PostgreSQL (Supabase)
└── Encryption (crypto-js for cookies)

Payment:
├── Stripe Subscriptions
└── Webhook handling

Authentication:
├── NextAuth.js v5
└── JWT tokens

Browser Extension:
├── Manifest V3
├── Chrome + Firefox compatible
└── Cookie injection API

Hosting:
├── Vercel (Frontend + API)
├── Supabase (Database)
└── Chrome Web Store (Extension)
```

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String?
  name          String?
  role          Role           @default(USER)
  emailVerified DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  subscriptions ToolSubscription[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

// Tools (AI services available for purchase)
model Tool {
  id               String        @id @default(uuid())
  name             String        // "ChatGPT Plus"
  slug             String        @unique
  description      String        @db.Text
  shortDescription String?
  category         ToolCategory
  icon             String?       // Icon URL or emoji
  toolUrl          String        // https://chat.openai.com
  priceMonthly     Int           // in cents (e.g., 800 = $8)

  // Cookie storage (encrypted)
  cookiesEncrypted String?       @db.Text
  cookiesUpdatedAt DateTime?
  cookiesExpiryDate DateTime?    // Admin sets expected expiry

  isActive         Boolean       @default(true)
  sortOrder        Int           @default(0)

  stripePriceId    String?       // Stripe Price ID for subscription

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  subscriptions    ToolSubscription[]

  @@map("tools")
}

enum ToolCategory {
  AI_WRITING
  SEO_TOOLS
  DESIGN
  PRODUCTIVITY
  CODE_DEV
  VIDEO_AUDIO
  OTHER
}

// User subscriptions to individual tools
model ToolSubscription {
  id                   String             @id @default(uuid())
  userId               String
  toolId               String

  status               SubscriptionStatus @default(ACTIVE)

  // Stripe subscription details
  stripeSubscriptionId String?            @unique
  stripeCustomerId     String?

  // Billing cycle
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime

  cancelAtPeriodEnd    Boolean            @default(false)
  canceledAt           DateTime?

  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  tool                 Tool               @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@unique([userId, toolId])
  @@map("tool_subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

// Admin activity log (track cookie updates)
model AdminLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // "UPDATED_COOKIES", "CREATED_TOOL", etc.
  toolId      String?
  details     String?  @db.Text
  createdAt   DateTime @default(now())

  @@map("admin_logs")
}
```

---

## Browser Extension Architecture

### Extension Structure

```
extension/
├── manifest.json           # Extension config
├── background.js           # Service worker
├── content.js             # Content script (injected in pages)
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── utils/
    └── cookie-injector.js # Cookie injection logic
```

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "GrowTools Access",
  "version": "1.0.0",
  "description": "Access your purchased AI tools seamlessly",
  "permissions": [
    "cookies",
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["https://yourdomain.com/*"],
      "js": ["content.js"]
    }
  ]
}
```

### How Cookie Injection Works

```typescript
// User clicks "Access Tool" in dashboard
// 1. Frontend sends message to extension
window.postMessage({
  type: 'GROWTOOLS_ACCESS',
  toolId: 'chatgpt-plus',
  url: 'https://chat.openai.com',
  cookies: [
    {
      name: '__Secure-next-auth.session-token',
      value: 'encrypted_value_here',
      domain: '.openai.com',
      path: '/',
      secure: true,
      httpOnly: true
    }
    // ... more cookies
  ]
}, '*');

// 2. Extension receives message (content.js)
window.addEventListener('message', async (event) => {
  if (event.data.type === 'GROWTOOLS_ACCESS') {
    const { url, cookies } = event.data;

    // 3. Extension injects cookies
    await chrome.cookies.set(cookies);

    // 4. Open tool in new tab
    chrome.tabs.create({ url });
  }
});
```

---

## Project Structure

```
growtools/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (public)/                 # Public pages
│   │   ├── page.tsx             # Landing page
│   │   ├── tools/               # Tools catalog
│   │   └── pricing/             # Pricing info
│   ├── dashboard/               # User dashboard
│   │   ├── page.tsx            # My tools
│   │   ├── subscriptions/      # Manage subscriptions
│   │   └── settings/           # Account settings
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── tools/              # Manage tools
│   │   │   ├── page.tsx        # List tools
│   │   │   ├── new/            # Create tool
│   │   │   └── [id]/edit/      # Edit tool + cookies
│   │   ├── subscriptions/      # View all subscriptions
│   │   └── analytics/          # Revenue analytics
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── tools/              # Tool CRUD
│   │   ├── checkout/           # Stripe checkout
│   │   ├── webhooks/           # Stripe webhooks
│   │   └── cookies/            # Get cookies for tool
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn components
│   ├── tools/
│   │   ├── tool-card.tsx
│   │   ├── tool-grid.tsx
│   │   └── category-filter.tsx
│   ├── dashboard/
│   │   ├── my-tools.tsx
│   │   └── access-button.tsx   # Main access button
│   └── admin/
│       ├── tool-form.tsx
│       └── cookie-editor.tsx   # Cookie paste UI
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── auth.ts
│   ├── encryption.ts           # Cookie encryption
│   └── utils.ts
├── extension/                   # Browser extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # Seed initial tools
└── public/
```

---

## Key Features

### 1. Public Tools Catalog

**Route**: `/tools`

**Features**:
- Grid/list view of all active tools
- Category filtering (AI Writing, SEO, Design, etc.)
- Search functionality
- Price displayed per tool
- "Subscribe" button → redirects to checkout

**UI Layout**:
```
┌─────────────────────────────────────────┐
│  🚀 Premium AI Tools                    │
│  Access 20+ tools with monthly          │
│  subscriptions starting at $5/month     │
└─────────────────────────────────────────┘

[All] [AI Writing] [SEO] [Design] [Code]

┌──────────┐ ┌──────────┐ ┌──────────┐
│ 🤖       │ │ 🎨       │ │ 📊       │
│ ChatGPT  │ │ Claude   │ │ Jasper   │
│ Plus     │ │ Pro      │ │ AI       │
│          │ │          │ │          │
│ $8/month │ │ $10/mo   │ │ $12/mo   │
│          │ │          │ │          │
│[Subscribe]│[Subscribe]│[Subscribe]│
└──────────┘ └──────────┘ └──────────┘
```

### 2. User Dashboard

**Route**: `/dashboard`

**Features**:
- Show only purchased tools
- "Access Tool" button with extension check
- Subscription status (active/expiring)
- Usage stats (optional)
- Manage/cancel subscriptions

**UI Layout**:
```
┌─────────────────────────────────────────┐
│  My Tools (3)                           │
└─────────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🤖 ChatGPT Plus                      │
│ Status: Active                       │
│ Next billing: Jan 15, 2026           │
│ $8.00/month                          │
│                                      │
│ [🚀 Access Tool] [Cancel]            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🎨 Claude Pro                        │
│ Status: Active                       │
│ Next billing: Jan 20, 2026           │
│ $10.00/month                         │
│                                      │
│ [🚀 Access Tool] [Cancel]            │
└──────────────────────────────────────┘
```

**Access Tool Button Logic**:
```typescript
async function handleAccessTool(tool) {
  // 1. Check if extension installed
  const hasExtension = await checkExtension();

  if (!hasExtension) {
    showModal({
      title: 'Extension Required',
      message: 'Please install GrowTools Extension',
      downloadUrl: 'https://chrome.google.com/webstore/...'
    });
    return;
  }

  // 2. Fetch decrypted cookies from API
  const response = await fetch(`/api/cookies/${tool.id}`);
  const { cookies } = await response.json();

  // 3. Send to extension
  window.postMessage({
    type: 'GROWTOOLS_ACCESS',
    toolId: tool.id,
    url: tool.toolUrl,
    cookies: cookies
  }, '*');

  // 4. Extension handles the rest
}
```

### 3. Admin Dashboard

**Route**: `/admin/tools`

**Features**:
- Create/edit/delete tools
- Paste cookies (JSON or manual entry)
- Set cookie expiry date
- View active subscriptions per tool
- Revenue analytics
- Cookie expiry notifications

**Cookie Management UI**:
```
┌─────────────────────────────────────────┐
│  Edit Tool: ChatGPT Plus                │
└─────────────────────────────────────────┘

Name: ChatGPT Plus
URL: https://chat.openai.com
Price: $8.00/month
Category: AI Writing

┌─────────────────────────────────────────┐
│  🍪 Cookies Configuration               │
│                                         │
│  Last Updated: 2 days ago               │
│  Expires: Jan 30, 2026                  │
│                                         │
│  Paste cookies from browser:            │
│  ┌─────────────────────────────────┐   │
│  │ [                               ]   │
│  │ {                               │   │
│  │   "cookies": [                  │   │
│  │     {                           │   │
│  │       "name": "__Secure...",    │   │
│  │       "value": "...",           │   │
│  │       "domain": ".openai.com"   │   │
│  │     }                           │   │
│  │   ]                             │   │
│  │ }                               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Test Cookies] [Save & Encrypt]        │
└─────────────────────────────────────────┘

Active Subscriptions: 47 users
Monthly Revenue: $376.00
```

**How Admin Gets Cookies**:
1. Admin logs into ChatGPT manually
2. Opens browser DevTools → Application → Cookies
3. Exports cookies (using extension or manually)
4. Pastes JSON into admin panel
5. System encrypts and stores cookies

### 4. Stripe Integration

**Subscription Flow**:
1. User clicks "Subscribe" on tool card
2. Create Stripe Checkout Session for recurring payment
3. Redirect to Stripe
4. User completes payment
5. Stripe webhook confirms subscription
6. Create `ToolSubscription` in database
7. User can now access tool

**API Route**: `/api/checkout`
```typescript
export async function POST(req: Request) {
  const { toolId, userId } = await req.json();

  const tool = await prisma.tool.findUnique({ where: { id: toolId } });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: tool.stripePriceId,
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tools?canceled=true`,
    metadata: { userId, toolId }
  });

  return Response.json({ url: session.url });
}
```

**Webhook Handler**: `/api/webhooks/stripe`
```typescript
// Handle subscription created
case 'checkout.session.completed': {
  const { userId, toolId } = session.metadata;

  await prisma.toolSubscription.create({
    data: {
      userId,
      toolId,
      stripeSubscriptionId: session.subscription,
      stripeCustomerId: session.customer,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
  break;
}

// Handle subscription canceled
case 'customer.subscription.deleted': {
  await prisma.toolSubscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'CANCELED', canceledAt: new Date() }
  });
  break;
}
```

---

## Security Implementation

### 1. Cookie Encryption

```typescript
// lib/encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.COOKIE_ENCRYPTION_KEY!;

export function encryptCookies(cookies: any[]): string {
  const jsonString = JSON.stringify(cookies);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

export function decryptCookies(encrypted: string): any[] {
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}
```

### 2. Access Control

```typescript
// Middleware to check if user has active subscription
export async function hasToolAccess(userId: string, toolId: string) {
  const subscription = await prisma.toolSubscription.findFirst({
    where: {
      userId,
      toolId,
      status: 'ACTIVE',
      currentPeriodEnd: { gte: new Date() }
    }
  });

  return !!subscription;
}
```

### 3. Cookie API Endpoint

```typescript
// app/api/cookies/[toolId]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { toolId: string } }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has active subscription
  const hasAccess = await hasToolAccess(session.user.id, params.toolId);

  if (!hasAccess) {
    return Response.json({ error: 'No active subscription' }, { status: 403 });
  }

  // Get tool with encrypted cookies
  const tool = await prisma.tool.findUnique({
    where: { id: params.toolId },
    select: { cookiesEncrypted: true, toolUrl: true }
  });

  if (!tool?.cookiesEncrypted) {
    return Response.json({ error: 'Cookies not configured' }, { status: 404 });
  }

  // Decrypt cookies
  const cookies = decryptCookies(tool.cookiesEncrypted);

  return Response.json({ cookies, url: tool.toolUrl });
}
```

---

## Sample Tool Catalog

```typescript
// Initial tools to seed
const tools = [
  {
    name: 'ChatGPT Plus',
    slug: 'chatgpt-plus',
    category: 'AI_WRITING',
    toolUrl: 'https://chat.openai.com',
    priceMonthly: 800, // $8
    description: 'Access to GPT-4 with faster response times',
    icon: '🤖'
  },
  {
    name: 'Claude Pro',
    slug: 'claude-pro',
    category: 'AI_WRITING',
    toolUrl: 'https://claude.ai',
    priceMonthly: 1000, // $10
    description: 'Extended context and priority access',
    icon: '🎨'
  },
  {
    name: 'Gemini Advanced',
    slug: 'gemini-advanced',
    category: 'AI_WRITING',
    toolUrl: 'https://gemini.google.com',
    priceMonthly: 900,
    description: 'Google\'s most capable AI model',
    icon: '💎'
  },
  {
    name: 'Jasper AI',
    slug: 'jasper-ai',
    category: 'AI_WRITING',
    toolUrl: 'https://app.jasper.ai',
    priceMonthly: 1200,
    description: 'AI content creation and SEO writing',
    icon: '📝'
  },
  {
    name: 'Midjourney',
    slug: 'midjourney',
    category: 'DESIGN',
    toolUrl: 'https://www.midjourney.com',
    priceMonthly: 1500,
    description: 'AI image generation',
    icon: '🎨'
  },
  {
    name: 'Canva Pro',
    slug: 'canva-pro',
    category: 'DESIGN',
    toolUrl: 'https://www.canva.com',
    priceMonthly: 700,
    description: 'Professional design platform',
    icon: '🖼️'
  },
  {
    name: 'Grammarly Premium',
    slug: 'grammarly-premium',
    category: 'PRODUCTIVITY',
    toolUrl: 'https://app.grammarly.com',
    priceMonthly: 600,
    description: 'Advanced grammar and style checking',
    icon: '✍️'
  },
  {
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'CODE_DEV',
    toolUrl: 'https://github.com/features/copilot',
    priceMonthly: 500,
    description: 'AI pair programmer',
    icon: '💻'
  }
];
```

---

## Development Phases

### Phase 1: Foundation (Week 1)
- [x] Database schema design
- [ ] Initialize Next.js project
- [ ] Setup Prisma + Supabase
- [ ] Install shadcn/ui components
- [ ] Setup authentication (NextAuth.js)
- [ ] Seed initial tools

### Phase 2: Public Pages (Week 2)
- [ ] Landing page
- [ ] Tools catalog with filtering
- [ ] Tool detail pages
- [ ] Auth pages (login/register)

### Phase 3: Payment Integration (Week 3)
- [ ] Setup Stripe
- [ ] Create products in Stripe
- [ ] Checkout flow
- [ ] Webhook handling
- [ ] Test subscriptions

### Phase 4: User Dashboard (Week 4)
- [ ] Dashboard layout
- [ ] My tools view
- [ ] Access button UI
- [ ] Subscription management
- [ ] Cancel flow

### Phase 5: Browser Extension (Week 5)
- [ ] Extension manifest
- [ ] Cookie injection logic
- [ ] Message passing
- [ ] Test with real tools
- [ ] Publish to Chrome Web Store

### Phase 6: Admin Panel (Week 6)
- [ ] Admin dashboard
- [ ] Tool CRUD
- [ ] Cookie management UI
- [ ] Analytics dashboard
- [ ] Admin logs

### Phase 7: Testing & Polish (Week 7)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deploy to production

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cookie Encryption
COOKIE_ENCRYPTION_KEY="your-32-char-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EXTENSION_ID="chrome-extension-id-here"
```

---

## Legal & Compliance Warnings

⚠️ **Important Legal Considerations**:

1. **Terms of Service Violations**: Most platforms (ChatGPT, Claude, etc.) explicitly prohibit account sharing in their ToS
2. **Account Bans**: Shared accounts may get banned if platforms detect unusual activity
3. **User Agreement**: Users must acknowledge they're using shared accounts
4. **Liability**: Add disclaimers in your ToS to limit liability
5. **DMCA**: Be prepared for potential takedown requests

**Recommended Disclaimers**:
- "Tools are provided as-is"
- "Accounts may be subject to platform ToS"
- "No refunds if account gets banned"
- "User assumes all risks"

---

## Revenue Projections

### Pricing Strategy
- ChatGPT Plus: $8/month (vs OpenAI's $20)
- Claude Pro: $10/month (vs Anthropic's $20)
- Other tools: $5-15/month

### Revenue Potential
With 500 users:
- 200 users × ChatGPT ($8) = $1,600/mo
- 150 users × Claude ($10) = $1,500/mo
- 100 users × Other tools ($7 avg) = $700/mo
- **Total MRR: $3,800/month**

### Costs
- Tool subscriptions (buy accounts): ~$200-300/mo
- Hosting: $50/mo
- Stripe fees (3%): ~$115/mo
- **Net profit: ~$3,300/month**

---

## Next Steps

Ready to build! Here's what I'll do:

1. ✅ Initialize Next.js project
2. ✅ Setup database with Prisma
3. ✅ Create seed data with 8+ tools
4. ✅ Build tools catalog page
5. ✅ Build admin cookie management
6. ✅ Create browser extension
7. ✅ Integrate Stripe

**Let's start building!** 🚀
