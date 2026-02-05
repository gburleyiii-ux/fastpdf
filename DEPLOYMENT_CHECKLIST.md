# FastPDF Deployment Checklist

**Target Launch Date:** February 7, 2026
**Status:** Ready for Deployment

---

## Pre-Deployment Setup

### 1. Netlify Environment Variables

Add these to your Netlify site dashboard (Site settings → Environment variables):

#### Required Supabase Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbG...` |

#### Required Stripe Variables (TEST MODE - for initial deploy)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test) | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key (test) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (from CLI or dashboard) | `whsec_...` |

#### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Your production URL | Netlify deploy URL |

---

### 2. Stripe Configuration

#### A. Create Products & Prices (if not done)
```bash
# Run these in your Stripe Dashboard or use Stripe CLI
# 1. Create a "Pro Plan" product
# 2. Create a recurring price for that product
# 3. Note the Price ID (starts with price_...)
```

#### B. Update Price IDs in Code
Update these files with your actual Stripe Price IDs:

**File:** `app/api/create-checkout/route.ts`
```typescript
// Line ~20 - Replace with your actual test price ID
const PRICE_ID = 'price_your_test_price_id_here'
```

#### C. Configure Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-site.netlify.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

### 3. Supabase Configuration

#### A. Database Tables (should already exist)
Ensure these tables exist with RLS policies:
- `profiles` (id, email, subscription_status, subscription_id, stripe_customer_id)
- `usage_logs` (for tracking)

#### B. Row Level Security
Verify RLS is enabled on all tables with proper policies.

---

### 4. Deploy to Netlify

#### Option A: Git-based Deploy (Recommended)
1. Push code to GitHub
2. Connect repo in Netlify dashboard
3. Build settings will auto-detect from `netlify.toml`

#### Option B: Manual Deploy
```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Deploy
netlify deploy --prod --build
```

---

## Post-Deployment Verification

### 1. Basic Functionality Tests
- [ ] Homepage loads
- [ ] Authentication works (sign up / sign in)
- [ ] PDF tools work (merge, split, compress, convert)
- [ ] Dashboard loads for authenticated users

### 2. Stripe Integration Tests (Test Mode)
- [ ] Pricing page displays correctly
- [ ] Checkout flow works (use Stripe test card: `4242 4242 4242 4242`)
- [ ] Webhook events are received (check Stripe Dashboard → Webhooks → logs)
- [ ] Subscription status updates in Supabase after payment
- [ ] Customer portal opens correctly

### 3. Security Checks
- [ ] Verify no console errors in browser
- [ ] Check that service role key is NOT exposed in client bundle
- [ ] Confirm webhooks verify signatures

---

## Go Live - Switch to Stripe Live Mode

**⚠️ ONLY DO THIS AFTER FULL TESTING IN TEST MODE**

### Step 1: Update Environment Variables in Netlify
Replace test keys with live keys:

| Variable | Change From | Change To |
|----------|-------------|-----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Test webhook secret | Live webhook secret |

### Step 2: Create Live Price IDs
1. In Stripe Dashboard, create new Products/Prices in LIVE mode
2. Update `PRICE_ID` in `app/api/create-checkout/route.ts` with live price ID
3. Commit and push the change

### Step 3: Update Webhook Endpoint
1. In Stripe Dashboard, add new webhook endpoint for live mode
2. URL: `https://your-site.netlify.app/api/webhooks/stripe`
3. Copy the live webhook secret to Netlify env vars

### Step 4: Redeploy
```bash
git add .
git commit -m "Switch to Stripe live mode"
git push
```

### Step 5: Live Verification
- [ ] Real payment succeeds
- [ ] Subscription activates in Supabase
- [ ] Customer receives Stripe receipt email

---

## Rollback Plan

If issues occur:
1. Revert to previous commit: `git revert HEAD`
2. Or switch Stripe env vars back to test mode in Netlify
3. Redeploy

---

## Notes

- **Secret Scanning:** Enabled in `netlify.toml` - Netlify will scan for secrets in commits
- **TypeScript:** Build will fail on type errors (strict mode enabled)
- **Service Role Key:** Server-side only, throws error if missing
- **Console Logs:** Error logs retained for debugging (no sensitive data exposed)

---

## Support Contacts

- **Stripe:** Dashboard → Support
- **Supabase:** Dashboard → Help
- **Netlify:** Dashboard → Support
