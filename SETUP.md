# FastPDF Setup Guide

This guide will walk you through setting up FastPDF with Supabase and Stripe integration.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd fastpdf
npm install
```

---

## 📦 Supabase Setup

### Step 1: Create Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize (2-3 minutes)

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `DATABASE_SCHEMA.sql`
3. Paste and run the SQL

This creates:
- `profiles` table (user data + subscription status)
- `usage_logs` table (track daily usage)
- Helper functions for usage counting
- Row Level Security policies

### Step 3: Get API Keys

1. In Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 💳 Stripe Setup

### Step 1: Create Account

1. Go to [https://stripe.com](https://stripe.com)
2. Create account (or sign in)
3. Activate **Test Mode** (toggle in sidebar)

### Step 2: Create Products

1. Go to **Products** in Stripe dashboard
2. Click **Add product**

**Product 1: FastPDF Pro Monthly**
- Name: `FastPDF Pro`
- Description: `Unlimited PDF tools`
- Pricing: `$5/month` → Recurring
- Copy the **Price ID** (starts with `price_...`)

**Product 2: FastPDF Pro Yearly**
- Name: `FastPDF Pro`
- Description: `Unlimited PDF tools (annual)`
- Pricing: `$48/year` → Recurring
- Copy the **Price ID** (starts with `price_...`)

### Step 3: Get API Keys

1. Go to **Developers > API keys**
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY` (keep secret!)

### Step 4: Setup Webhooks (After Deploy)

1. In Stripe, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 🔑 Environment Variables

### Step 1: Create .env.local

```bash
cp .env.local.example .env.local
```

### Step 2: Fill in values

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different key!)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_... (keep secret!)
STRIPE_WEBHOOK_SECRET=whsec_... (get after creating webhook)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000 (change in production)
```

---

## 🧪 Test Locally

```bash
npm run dev
```

Open http://localhost:3000

### Test Flow:
1. Click "Sign In / Sign Up"
2. Create account (check email for confirmation)
3. Go to `/merge` and try merging PDFs
4. Hit free limit (2 merges)
5. Go to `/pricing` and click "Get Pro"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Check dashboard - should show Pro status
8. Merge unlimited PDFs

---

## 🚀 Deploy to Production

### Netlify (Recommended)

**Why Netlify:** Fast, reliable, clean UI. Handles Next.js perfectly.

1. Push code to GitHub
2. Go to [https://netlify.com](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect to GitHub and select `fastpdf` repo
5. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Framework:** Next.js (auto-detected)
6. Click **Add environment variables** before deploying
7. Add ALL variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY`
   - `NEXT_PUBLIC_APP_URL` (set to your Netlify URL, e.g., `https://fastpdf.netlify.app`)
   - `STRIPE_WEBHOOK_SECRET` (skip for now, add after webhook setup)
8. Click **Deploy**
9. Wait 2-3 minutes for build
10. Done! Your site is live at `https://[your-site].netlify.app`

**Pro Tip:** Netlify will auto-deploy on every push to main branch. Super convenient!

### Alternative: Vercel

If you prefer Vercel:
1. Push code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables (all from .env.local)
5. Deploy

---

## 🔗 Post-Deploy Steps

### 1. Update Stripe Webhook

1. In Stripe dashboard, create webhook endpoint
2. Use your production URL: `https://yoursite.netlify.app/api/webhooks/stripe`
3. Copy webhook secret
4. Add to Netlify environment variables:
   - Go to **Site settings** → **Environment variables**
   - Add `STRIPE_WEBHOOK_SECRET` with the webhook secret value
5. Redeploy site (Deploys → Trigger deploy)

### 2. Update Environment Variables

In Netlify:
- Verify `NEXT_PUBLIC_APP_URL` is set to your Netlify URL
- Double-check all other env vars are correct

### 3. Test Production

1. Go to your live site
2. Create account
3. Test free tier
4. Test upgrade (use Stripe test mode still)
5. Switch Stripe to live mode when ready

---

## 🧪 Stripe Test Cards

**Success:**
- `4242 4242 4242 4242` (Visa)
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

**Failure:**
- `4000 0000 0000 0002` (Declined)

**3D Secure:**
- `4000 0027 6000 3184` (Requires authentication)

More test cards: https://stripe.com/docs/testing

---

## ✅ Checklist

Before going live:

- [ ] Supabase database created & schema applied
- [ ] Stripe products created (Pro Monthly + Yearly)
- [ ] All environment variables set
- [ ] Tested locally (signup, merge, upgrade)
- [ ] Deployed to Vercel/Netlify
- [ ] Stripe webhook configured
- [ ] Tested production (signup, merge, upgrade)
- [ ] Switch Stripe to live mode
- [ ] Update test card info in docs/UI

---

## 🐛 Troubleshooting

### "Can't connect to Supabase"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify Supabase project is active
- Check browser console for errors

### "Stripe checkout not working"
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check price IDs are correct
- Look in Stripe dashboard for errors

### "Webhook not receiving events"
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe
- Look in Stripe dashboard > Webhooks for delivery logs

### "Usage tracking not working"
- Check database schema was applied
- Verify RLS policies are enabled
- Check browser console for SQL errors

---

## 📊 Monitoring

### Supabase Dashboard
- Monitor database size
- Check auth users count
- View usage logs

### Stripe Dashboard
- Track MRR (monthly recurring revenue)
- Monitor failed payments
- View customer count

### Netlify Dashboard
- Check deployment status
- Monitor bandwidth usage
- View function logs
- Check build logs

---

## 💰 Going Live

When ready to accept real payments:

1. **Stripe:**
   - Complete Stripe onboarding (business info, bank details)
   - Switch to **Live Mode** (toggle in sidebar)
   - Create products in live mode (same as test mode)
   - Update price IDs in environment variables
   - Recreate webhook in live mode

2. **Supabase:**
   - No changes needed (already in production)
   - Monitor database size (upgrade if needed)

3. **Marketing:**
   - Add domain to Google Search Console
   - Submit sitemap
   - Start SEO content
   - Launch on Product Hunt

---

## 🎯 Next Steps

After launch:
1. Monitor for 24h (errors, signups, payments)
2. Add more PDF tools (split, compress, convert)
3. Implement Team accounts ($15/mo tier)
4. Add API access for developers
5. Start content marketing (SEO blog posts)

---

**Need help?** Check:
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs

**Ready to make money?** 🚀💰
