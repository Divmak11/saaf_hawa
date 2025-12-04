# Vercel Deployment Guide - Saaf Hawa Petition

## 🚨 Important: Two-Part Deployment

Your application consists of:
1. **Frontend (React)** → Deploy on Vercel ✅
2. **Backend (FastAPI/Python)** → Deploy on Railway/Render ⚠️

**Why?** Vercel is optimized for frontend/serverless Node.js, not Python FastAPI. Your backend needs a separate deployment.

---

## 📋 Deployment Options

### Option 1: Vercel Frontend + Railway Backend (Recommended)

#### Step 1: Deploy Backend on Railway

1. **Go to [Railway.app](https://railway.app)**
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Backend Deployment**
   - Select your repository
   - Root directory: `/backend`
   - Railway will auto-detect Python

3. **Set Environment Variables** in Railway:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=test_database
   CORS_ORIGINS=https://your-vercel-domain.vercel.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=SecureAdmin2025!
   ```

4. **Get your Railway Backend URL**
   - Example: `https://your-app.railway.app`
   - Copy this URL for frontend configuration

#### Step 2: Deploy Frontend on Vercel

1. **Go to [Vercel.com](https://vercel.com)**
   - Sign up with GitHub
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Frontend Build**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Set Environment Variables** in Vercel:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   ```
   ⚠️ Replace with your actual Railway backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-app.vercel.app`

---

### Option 2: Vercel Frontend + Render Backend

#### Step 1: Deploy Backend on Render

1. **Go to [Render.com](https://render.com)**
   - Sign up with GitHub
   - Click "New +" → "Web Service"

2. **Configure Backend**
   - Connect your GitHub repository
   - Name: `saaf-hawa-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables** in Render:
   ```
   MONGO_URL=<your-mongodb-uri>
   DB_NAME=test_database
   CORS_ORIGINS=https://your-vercel-domain.vercel.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=SecureAdmin2025!
   ```

4. **Get your Render Backend URL**
   - Example: `https://saaf-hawa-backend.onrender.com`

#### Step 2: Deploy Frontend on Vercel

Same as Option 1, Step 2 above.

---

## 🗄️ Database Setup

### Option A: MongoDB Atlas (Recommended for Production)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
   - Create free account
   - Create new cluster (Free tier available)

2. **Setup Database**
   - Database name: `test_database`
   - Collection: `signatures`

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/test_database`

4. **Whitelist IPs**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Or add specific Railway/Render IPs

5. **Update Backend Environment Variables**
   - Set `MONGO_URL` to your Atlas connection string

### Option B: Railway PostgreSQL (Alternative)

If you prefer PostgreSQL, you'll need to modify the backend to use PostgreSQL instead of MongoDB.

---

## 🔧 Configuration Files Created

### `/app/frontend/vercel.json`
- Configures Vercel deployment
- Sets up rewrites for React Router
- Optimizes static asset caching

### `/app/frontend/public/_redirects`
- Fallback for client-side routing
- Ensures all routes serve index.html

---

## 🚀 Quick Deploy Steps

### For Vercel Frontend:

```bash
# From your local machine
cd /app/frontend

# Install Vercel CLI (optional)
npm install -g vercel

# Deploy to Vercel
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set environment variable: REACT_APP_BACKEND_URL
# - Deploy!
```

### For Railway Backend:

```bash
# From Railway dashboard:
# 1. Connect GitHub repo
# 2. Set root directory to "backend"
# 3. Add environment variables
# 4. Deploy automatically
```

---

## ⚙️ Environment Variables Summary

### Frontend (Vercel)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
```

### Backend (Railway/Render)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/test_database
DB_NAME=test_database
CORS_ORIGINS=https://your-frontend.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SecureAdmin2025!
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: 404 on Vercel
**Problem:** React Router routes show 404
**Solution:** 
- Ensure `vercel.json` is in `/frontend` directory
- Verify rewrites configuration is correct
- Redeploy after adding vercel.json

### Issue 2: CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
- Update `CORS_ORIGINS` in backend to include your Vercel URL
- Format: `https://your-app.vercel.app` (no trailing slash)
- Restart backend service after updating

### Issue 3: Environment Variables Not Working
**Problem:** Backend URL undefined
**Solution:**
- Vercel: Add `REACT_APP_BACKEND_URL` in project settings
- Must start with `REACT_APP_` for Create React App
- Redeploy after adding variables

### Issue 4: Backend Not Starting on Railway
**Problem:** Build fails or server won't start
**Solution:**
- Check `requirements.txt` is in `/backend` directory
- Verify Python version compatibility
- Check Railway build logs for errors

### Issue 5: Database Connection Failed
**Problem:** Backend can't connect to MongoDB
**Solution:**
- Verify `MONGO_URL` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database name matches `DB_NAME`
- Test connection string locally first

### Issue 6: Admin Panel 401 Errors
**Problem:** Can't login to admin panel
**Solution:**
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in backend
- Clear browser cookies/localStorage
- Check backend logs for authentication errors

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend code pushed to GitHub
- [ ] Frontend code pushed to GitHub
- [ ] Admin credentials changed from defaults
- [ ] Test app locally with production-like setup

### Backend Deployment (Railway/Render)
- [ ] Service created and connected to GitHub
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Health check endpoint responding
- [ ] Backend URL copied for frontend

### Frontend Deployment (Vercel)
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] `REACT_APP_BACKEND_URL` set to backend URL
- [ ] Deployment successful
- [ ] Custom domain configured (optional)

### Post-Deployment
- [ ] Test petition submission from live site
- [ ] Test admin login at `/admin833`
- [ ] Verify CSV export works
- [ ] Test rate limiting (try 4 quick submissions)
- [ ] Check mobile responsiveness
- [ ] Update CORS_ORIGINS in backend with final Vercel URL

---

## 🌐 Custom Domain Setup

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `saafhawa.org`)
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take 24-48 hours)
5. Update backend `CORS_ORIGINS` with new domain

### For Railway (Backend) - Optional
1. Go to Project Settings → Domains
2. Add custom domain (e.g., `api.saafhawa.org`)
3. Add CNAME record pointing to Railway
4. Update frontend `REACT_APP_BACKEND_URL`

---

## 💰 Cost Estimates

### Free Tier (Suitable for Testing)
- **Vercel:** Free (Hobby plan)
  - 100 GB bandwidth/month
  - Unlimited websites
  
- **Railway:** $5 credit free trial
  - Then ~$5-20/month depending on usage
  
- **MongoDB Atlas:** Free (M0 cluster)
  - 512 MB storage
  - Shared CPU
  - Good for 1000s of signatures

### Production (Recommended)
- **Vercel Pro:** $20/month
  - Priority builds
  - Analytics
  - More bandwidth
  
- **Railway:** ~$10-30/month
  - Based on actual usage
  - Always-on backend
  
- **MongoDB Atlas:** $0-57/month
  - Free tier works for most petitions
  - Upgrade if needed

**Total Estimated:** $0-100/month depending on traffic

---

## 🔐 Security Reminders

1. **Change Admin Password**
   - Update in backend `.env` before deploying
   - Use strong password (16+ characters)

2. **Secure Environment Variables**
   - Never commit `.env` files to GitHub
   - Set variables in hosting platform UI
   - Use different passwords for production

3. **MongoDB Security**
   - Use strong database password
   - Restrict IP access when possible
   - Enable MongoDB Atlas encryption

4. **HTTPS Only**
   - Both Vercel and Railway provide free SSL
   - Ensure backend URL uses `https://`
   - Never use `http://` in production

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

## ✅ Success Indicators

Your deployment is successful when:
1. ✅ Frontend loads at Vercel URL without 404 errors
2. ✅ All routes work (`/`, `/success`, `/admin833`)
3. ✅ Petition form submits successfully
4. ✅ Success page shows with petition details
5. ✅ Admin login works
6. ✅ Admin dashboard shows signatures
7. ✅ CSV export downloads correctly
8. ✅ Rate limiting prevents spam (test 4 quick submissions)
9. ✅ Mobile version looks good
10. ✅ No console errors in browser

---

## 🎉 Next Steps After Deployment

1. **Test Everything Thoroughly**
   - Submit test signatures
   - Try admin functions
   - Test on mobile devices

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Check Railway metrics
   - Monitor MongoDB usage

3. **Share Your Petition**
   - Social media
   - Email campaigns
   - Community groups

4. **Regular Maintenance**
   - Export CSV backups weekly
   - Monitor for spam
   - Check signature growth
   - Review backend logs

Good luck with your Clean Air petition! 🌬️✨
