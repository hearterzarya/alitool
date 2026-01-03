# GrowTools - Subscription Platform

A modern subscription-based tool purchasing platform built with Next.js, TypeScript, and Stripe.

## Documentation

This repository contains comprehensive planning and implementation guides for building a subscription platform:

### 📋 Planning Documents

1. **[SUBSCRIPTION_PLATFORM_PLAN.md](./SUBSCRIPTION_PLATFORM_PLAN.md)** - Complete implementation plan
   - Platform overview and features
   - Database schema
   - Development phases and timeline
   - Security considerations
   - Cost estimates
   - Success metrics

2. **[TECH_STACK_GUIDE.md](./TECH_STACK_GUIDE.md)** - Technical implementation guide
   - Recommended tech stacks
   - Project structure
   - Code examples
   - Installation commands
   - Deployment guide

3. **[QUICK_START.md](./QUICK_START.md)** - Get started quickly
   - Step-by-step setup
   - Essential commands
   - Development workflow

## Features

- 🔐 **Authentication**: Secure user registration and login
- 💳 **Payment Processing**: Stripe integration for subscriptions
- 📊 **User Dashboard**: Manage subscriptions and billing
- 🛠️ **Tool Catalog**: Browse and purchase tools
- 👨‍💼 **Admin Panel**: Manage tools, users, and analytics
- 📱 **Responsive Design**: Works on all devices
- 🌙 **Dark Mode**: Built-in theme support
- 📧 **Email Notifications**: Automated transactional emails

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Deployment**: Vercel + Supabase

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/growtools.git
cd growtools

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
growtools/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (marketing)/       # Landing & pricing pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── auth/             # Auth components
│   ├── pricing/          # Pricing components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe client
│   └── auth.ts           # Auth config
├── prisma/               # Database schema
│   └── schema.prisma
└── public/               # Static assets
```

## Development Phases

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Authentication system

### Phase 2: Core Features 🚧
- [ ] Tool catalog
- [ ] Pricing page
- [ ] Stripe integration

### Phase 3: Dashboard 📋
- [ ] User dashboard
- [ ] Subscription management
- [ ] Billing history

### Phase 4: Admin Panel 📋
- [ ] Admin dashboard
- [ ] Tool management
- [ ] Analytics

### Phase 5: Production 📋
- [ ] Testing
- [ ] Optimization
- [ ] Deployment

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
npx prisma migrate   # Run migrations

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```

## API Routes

### Public Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tools` - Get all tools
- `GET /api/pricing` - Get pricing plans

### Protected Routes
- `POST /api/checkout` - Create checkout session
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/billing` - Get billing history

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin Routes
- `POST /api/admin/tools` - Create tool
- `PUT /api/admin/tools/:id` - Update tool
- `DELETE /api/admin/tools/:id` - Delete tool
- `GET /api/admin/analytics` - Get analytics

## Database Schema

Key tables:
- **users** - User accounts
- **tools** - Available tools
- **pricing_plans** - Pricing tiers
- **subscriptions** - Active subscriptions
- **payments** - Payment history

See [TECH_STACK_GUIDE.md](./TECH_STACK_GUIDE.md) for complete schema.

## Payment Flow

1. User selects pricing plan
2. Redirects to Stripe Checkout
3. User completes payment
4. Stripe webhook confirms payment
5. Subscription created in database
6. Confirmation email sent
7. User redirected to dashboard

## Security

- Password hashing with bcrypt
- JWT token authentication
- HTTPS only in production
- CSRF protection
- Input validation with Zod
- SQL injection prevention with Prisma
- Stripe webhook signature verification

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Database
1. Create Supabase project
2. Copy connection string
3. Run migrations
4. Update DATABASE_URL

### Stripe
1. Create Stripe account
2. Add products and prices
3. Setup webhook endpoint
4. Copy API keys

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- Documentation: See guides in this repo
- Issues: [GitHub Issues](https://github.com/yourusername/growtools/issues)
- Email: support@yourdomain.com

## Roadmap

- [ ] Multi-currency support
- [ ] Team/organization accounts
- [ ] API access for customers
- [ ] Affiliate program
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Webhooks for customers
- [ ] White-label solution

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Stripe](https://stripe.com)
- [Prisma](https://www.prisma.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ for developers**
