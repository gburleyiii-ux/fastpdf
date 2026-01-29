# FastPDF - Quick Start (10 Minutes)

**Goal:** Get FastPDF running locally with test payments

---

## 1️⃣ Create Supabase Project (3 min)

1. Go to https://supabase.com → Sign up/in
2. Click **New Project**
3. Name: `fastpdf`
4. Strong password
5. Region: Choose closest to you
6. Click **Create project** (wait 2 min)

---

## 2️⃣ Setup Database (1 min)

1. In Supabase dashboard → **SQL Editor**
2. Open `DATABASE_SCHEMA.sql` from this folder
3. Copy entire contents
4. Paste in SQL Editor
5. Click **Run**

✅ You should see "Success. No rows returned"

---

## 3️⃣ Get Supabase Keys (1 min)

1. In Supabase → **Settings > API**
2. Copy 3 things:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "Reveal" first)

---

## 4️⃣ Create Stripe Account (2 min)

1. Go to https://stripe.com → Sign up/in
2. Skip onboarding for now
3. Make sure **Test Mode** is ON (toggle top-right)

---

## 5️⃣ Create Stripe Products (2 min)

### Product 1: Pro Monthly
1. Stripe → **Products** → **Add product**
2. Name: `FastPDF Pro`
3. Description: `Unlimited PDF tools`
4. Pricing model: `Standard pricing`
5. Price: `$5.00 USD`
6. Billing period: `Monthly`
7. Click **Save product**
8. **Copy the Price ID** (starts with `price_...`)

### Product 2: Pro Yearly
1. Click **Add another price** on same product
2. Price: `$48.00 USD`
3. Billing period: `Yearly`
4. Click **Save**
5. **Copy this Price ID too**

---

## 6️⃣ Get Stripe Keys (30 sec)

1. Stripe → **Developers > API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

---

## 7️⃣ Setup Environment Variables (1 min)

```bash
cd fastpdf
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase (from step 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (different key!)

# Stripe (from steps 5 & 6)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_... (from step 5)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_... (from step 5)

# Webhook (skip for now, add after deploy)
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8️⃣ Start Dev Server (30 sec)

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## ✅ Test It Works

1. **Sign Up**
   - Click "Sign In / Sign Up"
   - Create account with your email
   - Check email for confirmation link
   - Click link → redirects to dashboard

2. **Test Free Tier**
   - Go to `/merge`
   - Upload 2 PDFs
   - Click "Merge PDFs"
   - Download result
   - Try again → works
   - Try 3rd time → should hit limit

3. **Test Upgrade**
   - Go to `/pricing`
   - Click "Get Pro Monthly"
   - Use test card: `4242 4242 4242 4242`
   - Expiry: any future date (e.g., 12/25)
   - CVC: any 3 digits (e.g., 123)
   - ZIP: any (e.g., 12345)
   - Complete checkout
   - Redirects to dashboard
   - Should show "Pro Plan"

4. **Test Unlimited**
   - Go to `/merge`
   - Merge PDFs again
   - No limit! Works unlimited times

---

## 🐛 Troubleshooting

**"Can't sign up"**
- Check Supabase URL/keys are correct
- Check browser console for errors

**"Checkout doesn't work"**
- Verify Stripe keys are correct
- Make sure price IDs are right
- Check Stripe dashboard for errors

**"Still shows free after payment"**
- Webhook isn't working locally (normal)
- Manually update in Supabase:
  1. Supabase → **Table Editor** → **profiles**
  2. Find your user
  3. Edit `subscription_status` to `pro`
  4. Refresh page

---

## 🚀 Ready to Deploy?

See `SETUP.md` for full deployment instructions (Netlify).

---

## 💰 Next Steps

1. ✅ Working locally
2. Deploy to production
3. Configure webhook
4. Launch!
5. Start making money

**Total setup time:** ~10 minutes  
**Total cost:** $0 (all free tiers)  
**Revenue potential:** $5k+/month
