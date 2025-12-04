# Fix Vercel 404 Error - Step by Step

## 🔍 Diagnosis

You're seeing 404 because Vercel needs proper configuration for your React app.

## ✅ Solution (Follow These Steps)

### Step 1: Update Your Repository

The `vercel.json` file has been updated. Commit and push to GitHub:

```bash
git add frontend/vercel.json
git commit -m "Fix Vercel 404 error with correct configuration"
git push origin main
```

### Step 2: Check Vercel Project Settings

Go to your Vercel dashboard at https://vercel.com/dashboard

1. **Click on your project** (`saaf-hawa`)
2. **Go to Settings**
3. **Check these settings:**

#### Build & Development Settings
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build (or leave auto-detected)
Output Directory: build (or leave auto-detected)
Install Command: npm install (or leave auto-detected)
```

⚠️ **CRITICAL:** Make sure **Root Directory** is set to `frontend`

### Step 3: Set Environment Variables

In Vercel Settings → Environment Variables:

**Add this variable:**
```
Name: REACT_APP_BACKEND_URL
Value: https://your-backend-url.railway.app
```

If you don't have a backend deployed yet, temporarily use:
```
Value: https://clean-air-delhi.preview.emergentagent.com/api
```

### Step 4: Redeploy

Two options:

**Option A: From Vercel Dashboard**
1. Go to Deployments tab
2. Click the three dots (•••) on the latest deployment
3. Click "Redeploy"

**Option B: Push to GitHub**
```bash
# Make any small change to trigger redeployment
git commit --allow-empty -m "Trigger Vercel rebuild"
git push origin main
```

### Step 5: Wait and Check

1. Wait 2-3 minutes for build to complete
2. Visit https://saaf-hawa.vercel.app
3. Should now work! ✅

---

## 🐛 Still Getting 404?

### Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check the "Building" section for errors
4. Look for:
   - ✅ Build completed successfully
   - ✅ No errors in output
   - ✅ Files were generated in `build/` directory

### Common Issues & Solutions

#### Issue 1: "No Output Directory"
**Fix:** Ensure Root Directory is set to `frontend`

#### Issue 2: "Build Failed"
**Fix:** Check build logs for errors. Common causes:
- Missing dependencies
- TypeScript errors
- Linting errors

Run locally first:
```bash
cd /app/frontend
npm run build
```

If it fails locally, fix errors before deploying.

#### Issue 3: "ENOENT: no such file"
**Fix:** Root directory is wrong. Should be `frontend`, not root of repo.

#### Issue 4: Environment Variable Not Found
**Fix:** In Vercel, environment variables must start with `REACT_APP_`

---

## 🔄 Alternative: Manual Deployment with Vercel CLI

If dashboard deployment isn't working, try CLI:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy from Frontend Directory
```bash
cd /app/frontend
vercel --prod

# Follow prompts:
# - Link to existing project: Yes
# - Select your project: saaf-hawa
```

This will deploy directly from the frontend folder.

---

## 🎯 Verify Correct Setup

After deployment, check these URLs:

1. **Homepage:** https://saaf-hawa.vercel.app
   - Should show: Petition homepage

2. **Admin Login:** https://saaf-hawa.vercel.app/admin833
   - Should show: Admin login page

3. **Direct Route:** https://saaf-hawa.vercel.app/success
   - Should show: Success page (may be empty if no data)
   - Should NOT show: 404 error

If all three work → ✅ Success!

---

## 📋 Current File Structure Should Be

```
your-repo/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects
│   ├── src/
│   ├── package.json
│   ├── vercel.json          ← This file fixes 404
│   └── .env (with REACT_APP_BACKEND_URL)
├── backend/
│   └── ... (deploy separately)
└── ... other files
```

---

## 🆘 Emergency Fix: Force Correct Configuration

If nothing works, try this:

### 1. Delete and Recreate Vercel Project

1. Go to Vercel Dashboard
2. Project Settings → Advanced → Delete Project
3. Create new project:
   - Import from GitHub
   - **IMPORTANT:** Set Root Directory to `frontend`
   - Add environment variable `REACT_APP_BACKEND_URL`
   - Deploy

### 2. Verify vercel.json is Committed

```bash
cd /app
git status

# Make sure vercel.json is tracked
git add frontend/vercel.json
git add frontend/public/_redirects
git commit -m "Add Vercel configuration files"
git push origin main
```

---

## ✅ Success Checklist

- [ ] `vercel.json` exists in `/frontend` directory
- [ ] Root Directory in Vercel is set to `frontend`
- [ ] Build command is `npm run build`
- [ ] Output directory is `build`
- [ ] Environment variable `REACT_APP_BACKEND_URL` is set
- [ ] Latest code is pushed to GitHub
- [ ] Vercel deployment completed successfully
- [ ] No errors in build logs
- [ ] Homepage loads at https://saaf-hawa.vercel.app
- [ ] Admin page loads at https://saaf-hawa.vercel.app/admin833
- [ ] No 404 errors on any route

---

## 📸 Screenshot of Correct Vercel Settings

Your Vercel project settings should look like this:

**General Settings:**
```
Project Name: saaf-hawa
Framework: Create React App
Root Directory: frontend
```

**Build & Development Settings:**
```
Build Command: $ npm run build
Output Directory: build
Install Command: $ npm install
```

**Environment Variables:**
```
REACT_APP_BACKEND_URL = https://your-backend.railway.app (or other)
```

---

## 💡 Pro Tips

1. **Always deploy from `frontend` folder**, not root
2. **Push `vercel.json` to GitHub** before redeploying
3. **Check build logs** for actual errors
4. **Test locally first** with `npm run build`
5. **Use Vercel CLI** for more control

---

## 🎉 After It Works

Once you see your petition website loading:

1. **Add Backend URL:** Update `REACT_APP_BACKEND_URL` to your Railway/Render backend
2. **Test Form:** Try submitting a petition
3. **Test Admin:** Login at `/admin833`
4. **Share:** Your petition is live! 🌬️✨

---

**Need more help?** Check build logs in Vercel dashboard or run `npm run build` locally to see errors.
