# Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository with your code (GitHub, GitLab, or Bitbucket)
3. YouTube Data API v3 key
4. Your YouTube Channel ID

---

## Step 1: Prepare Your Repository

### Push to Git
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Verify `.gitignore`
Make sure `.env` and `node_modules/` are in your `.gitignore`:
```
.env
node_modules/
dist/
server/
```

**IMPORTANT:** Never commit `.env` file! Your API keys must stay secret.

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your repository
4. Vercel will auto-detect Vite framework
5. Click **"Deploy"** (don't worry about environment variables yet)

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

---

## Step 3: Set Environment Variables

### In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

| Name | Value | Example |
|------|-------|---------|
| `YT_API_KEY` | Your YouTube Data API key | `AIzaSyD...` |
| `CHANNEL_ID` | Your YouTube Channel ID | `UCxxxxxxx` |

3. Make sure they're available for **Production**, **Preview**, and **Development**
4. Click **"Save"**

### Redeploy
After adding environment variables, go to **Deployments** tab and click **"Redeploy"** on the latest deployment.

---

## Step 4: Verify Deployment

### Test Your API Endpoints
Visit these URLs (replace `your-site.vercel.app` with your actual domain):

1. **Videos API:**
   ```
   https://your-site.vercel.app/api/video
   ```
   Should return JSON with your videos

2. **Channel API:**
   ```
   https://your-site.vercel.app/api/channel
   ```
   Should return your channel info

3. **Main Site:**
   ```
   https://your-site.vercel.app
   ```
   Should show your video gallery

---

## Security Checklist ✅

- [ ] `.env` file is **NOT** in your Git repository
- [ ] Environment variables are set in **Vercel Dashboard**
- [ ] API keys are never visible in frontend code
- [ ] All API calls go through `/api/` serverless functions

---

## Troubleshooting

### Issue: "Missing YT_API_KEY"
**Solution:** Add environment variables in Vercel Dashboard and redeploy

### Issue: "Channel not found"
**Solution:** Verify your `CHANNEL_ID` is correct

### Issue: Videos not loading
**Solution:** Check browser console for errors. Verify API endpoints work.

### Issue: Shorts not detected
**Solution:** Shorts detection is asynchronous. It may take a moment to load.

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

---

## Local Development

To test locally with Vercel environment:
```bash
vercel env pull
vercel dev
```

This downloads your production environment variables and runs a local Vercel server.

---

## Updating Your Site

Simply push to your Git repository:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel will automatically redeploy!

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **YouTube API Docs:** https://developers.google.com/youtube/v3

Good luck with your deployment! 🚀
