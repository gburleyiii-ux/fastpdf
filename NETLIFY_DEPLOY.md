# FastPDF - Netlify Deployment Guide

**Platform:** Netlify (preferred for all projects)

---

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Netlify account (free)
- Environment variables from `.env.local`

---

### Step 1: Push to GitHub

```bash
cd fastpdf
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/fastpdf.git
git push -u origin main
```

---

### Step 2: Connect to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site**
3. Choose **Import an existing project**
4. Select **Deploy with GitHub**
5. Authorize Netlify (if first time)
6. Choose your `fastpdf` repository

---

### Step 3: Configure Build

Netlify auto-detects Next.js from `netlify.toml`:
- ✅ Build command: `npm run build`
- ✅ Publish directory: `.next`
- ✅ Framework: Next.js

**Just verify these are correct and continue.**

---

### Step 4: Add Environment Variables

Click **Add environment variables** before deploying.

**Required variables:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (different!)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_...

# App URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

**Note:** Skip `STRIPE_WEBHOOK_SECRET` for now. Add it after webhook setup.

---

### Step 5: Deploy

1. Click **Deploy [site name]**
2. Wait 2-3 minutes for build
3. Site goes live at `https://[random-name].netlify.app`

---

### Step 6: Custom Domain (Optional)

1. In Netlify: **Domain settings** → **Add custom domain**
2. Enter your domain (e.g., `fastpdf.app`)
3. Follow DNS instructions
4. Netlify provides free SSL automatically

Or just use the `.netlify.app` subdomain (totally fine!).

---

### Step 7: Update App URL

1. Copy your Netlify URL: `https://your-site.netlify.app`
2. In Netlify: **Site settings** → **Environment variables**
3. Edit `NEXT_PUBLIC_APP_URL`
4. Change from `http://localhost:3000` to your Netlify URL
5. Click **Save**
6. **Deploys** → **Trigger deploy** → **Deploy site**

---

### Step 8: Configure Stripe Webhook

1. Go to Stripe dashboard: **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `https://your-site.netlify.app/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Back in Netlify: **Site settings** → **Environment variables**
8. Add new variable:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (paste the signing secret)
9. **Deploys** → **Trigger deploy**

---

### Step 9: Test Production

1. Visit your live site
2. Create a new account (use real email)
3. Confirm email
4. Try merging PDFs (2 free merges)
5. Go to pricing
6. Upgrade with test card: `4242 4242 4242 4242`
7. Verify Pro status in dashboard
8. Try unlimited merging

---

## ✅ Post-Deploy Checklist

- [ ] Site deployed successfully
- [ ] Custom domain configured (if using)
- [ ] App URL environment variable updated
- [ ] Stripe webhook configured and working
- [ ] Test signup flow
- [ ] Test free tier limits
- [ ] Test upgrade to Pro
- [ ] Test unlimited Pro usage
- [ ] Verify dashboard shows correct status

---

## 🔄 Auto-Deploy Setup

**Already configured!**

Netlify automatically deploys when you push to `main` branch:

```bash
# Make changes
git add .
git commit -m "Update pricing"
git push

# Netlify rebuilds automatically (2-3 min)
```

---

## 🐛 Troubleshooting

### Build fails
- Check **Deploys** → **Deploy log** in Netlify
- Common issue: Missing environment variables
- Solution: Add all required env vars and retry

### Site loads but auth doesn't work
- Check Supabase URL and keys are correct
- Verify `NEXT_PUBLIC_APP_URL` matches your live URL
- Check browser console for errors

### Stripe checkout fails
- Verify Stripe keys are in test mode initially
- Check price IDs are correct
- Look in Stripe dashboard for error logs

### Webhook not receiving events
- Verify webhook URL is correct (include `/api/webhooks/stripe`)
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Look at webhook delivery logs in Stripe

---

## 💰 Going Live with Real Payments

When ready to accept real money:

1. **Stripe:**
   - Complete Stripe onboarding (business info, bank)
   - Switch to **Live mode** (toggle in Stripe dashboard)
   - Create products again in live mode (same prices)
   - Update price IDs in Netlify env vars
   - Recreate webhook in live mode
   - Update `STRIPE_WEBHOOK_SECRET`
   - Redeploy

2. **Test with real card:**
   - Use your own card (charge yourself $5)
   - Verify everything works
   - Refund yourself in Stripe dashboard

3. **Launch:**
   - Post on Product Hunt
   - Share on Reddit (r/SaaS, r/entrepreneurs)
   - Tweet about it
   - Add to tool directories

---

## 📊 Monitoring

**Netlify Dashboard:**
- **Deploys:** Build status, logs
- **Analytics:** Page views, bandwidth
- **Functions:** API route logs (webhooks)

**Supabase Dashboard:**
- **Auth:** User signups
- **Database:** Usage logs
- **Storage:** If using file uploads

**Stripe Dashboard:**
- **Payments:** Revenue, subscriptions
- **Customers:** User list
- **Webhooks:** Delivery success rate

---

## 🎯 Performance Tips

**Netlify is fast by default, but:**
- ✅ Already using CDN (automatic)
- ✅ Already using image optimization (Next.js)
- ✅ Already using caching (Netlify headers)

**To go faster:**
- Enable Netlify Analytics ($9/mo, optional)
- Use Netlify Edge Functions (when we scale)
- Optimize images with next/image

---

## 💸 Costs

**Free tier limits:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Free SSL

**Pro tier ($19/mo):**
- 400 GB bandwidth
- 25,000 build minutes
- Analytics included
- Form submissions
- Background functions

**You'll stay on free tier until 10K+ users.**

---

## 🚀 Success!

Your FastPDF is now live and ready to make money!

**Next steps:**
1. Test everything thoroughly
2. Switch Stripe to live mode
3. Start marketing
4. Watch the revenue roll in

**Questions?**
- Netlify docs: https://docs.netlify.com
- Netlify support: support@netlify.com
- Or ask me!

---

**Happy deploying!** 🎉
