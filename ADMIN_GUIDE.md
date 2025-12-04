# Saaf Hawa Petition - Admin Guide

## 🔐 Admin Access

Your petition website is now secured and ready for launch with a comprehensive admin panel.

### Admin Login Credentials

**URL:** `https://clean-air-delhi.preview.emergentagent.com/admin833`

**Username:** `admin`  
**Password:** `SecureAdmin2025!`

⚠️ **IMPORTANT:** Please change these credentials before going live by updating the `.env` file in `/app/backend/.env`:

```bash
ADMIN_USERNAME="your_new_username"
ADMIN_PASSWORD="your_new_secure_password"
```

---

## 🛡️ Security Features Implemented

### 1. Rate Limiting
- **Petition Submissions:** Limited to 3 submissions per 5 minutes per IP address
- **API Requests:** Limited to 60 requests per minute per IP address
- Prevents spam and abuse

### 2. Input Validation & Sanitization
- **Name Validation:** 
  - Minimum 2 characters
  - Maximum 100 characters
  - Only letters, spaces, dots, hyphens, apostrophes allowed
  
- **Phone Validation:**
  - Must be 10-15 digits
  - International format supported (+91 for India)
  - Special characters (spaces, hyphens) automatically cleaned
  
- **XSS Protection:** All inputs are HTML-escaped to prevent script injection

### 3. Admin Authentication
- **Token-based authentication:** Secure Bearer token system
- **Token expiry:** 24 hours (auto-logout after expiration)
- **Protected endpoints:** All admin endpoints require authentication

### 4. CORS Configuration
- Properly configured Cross-Origin Resource Sharing
- Prevents unauthorized API access from other domains

---

## 📊 Admin Dashboard Features

### Statistics Overview
View real-time petition metrics:
- **Total Signatures:** All-time signature count
- **Today:** Signatures collected today
- **This Week:** Weekly signature count
- **This Month:** Monthly signature count

### Signature Management

#### 1. View All Signatures
- Paginated list (20 signatures per page)
- Shows: Signature number, Name, Phone, Date/Time
- Sorted by most recent first

#### 2. Search & Filter
- **Search by name or phone number**
- Real-time search across all signatures
- Case-insensitive search

#### 3. Delete Signatures
- Remove spam or test entries
- Confirmation dialog before deletion
- Instant updates after deletion

#### 4. Export Data
- **Export to CSV:** Download all signatures in Excel-compatible format
- Includes: Signature number, Name, Phone, Email (if provided), Timestamp
- Automatic filename with date: `petition_signatures_YYYYMMDD_HHMMSS.csv`

#### 5. Pagination
- Navigate through pages of signatures
- Shows current page and total pages
- Previous/Next buttons for easy navigation

---

## 🚀 How to Use the Admin Panel

### Step 1: Login
1. Go to `https://clean-air-delhi.preview.emergentagent.com/admin833`
2. Enter username: `admin`
3. Enter password: `SecureAdmin2025!`
4. Click "Login"

### Step 2: View Dashboard
- See real-time statistics at the top
- Scroll down to view all signatures

### Step 3: Search Signatures
1. Use the search box to find specific signatures
2. Type name or phone number
3. Press Enter or click outside the box

### Step 4: Export Data
1. Click the green "Export CSV" button
2. File will download automatically
3. Open in Excel, Google Sheets, or any spreadsheet software

### Step 5: Delete Spam Entries
1. Find the signature you want to delete
2. Click the red trash icon in the "Actions" column
3. Confirm deletion in the popup
4. Signature will be removed immediately

### Step 6: Refresh Data
- Click the "Refresh" button to get latest data
- Automatically updates statistics and signature list

### Step 7: Logout
- Click "Logout" button in the top right
- Your session will end and you'll be redirected to login

---

## 🔒 Security Best Practices

### Before Launch
1. **Change Default Credentials**
   - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `/app/backend/.env`
   - Use a strong password (12+ characters, mix of letters, numbers, symbols)

2. **Keep Admin URL Secret**
   - The admin panel is at `/admin833` (custom path for security)
   - Don't share this URL publicly
   - Only share with trusted administrators

3. **Regular Backups**
   - Export CSV regularly to backup signature data
   - Keep backups in a secure location

### During Operation
1. **Monitor for Spam**
   - Check dashboard regularly
   - Delete suspicious entries
   - Watch for rate limit violations (will be logged)

2. **Session Management**
   - Always logout when done
   - Don't leave admin panel open on shared computers
   - Session expires automatically after 24 hours

3. **Data Privacy**
   - Protect exported CSV files
   - Don't share personal data (names, phone numbers) publicly
   - Comply with data protection regulations

---

## 📱 API Endpoints Reference

All admin endpoints require authentication with Bearer token.

### Authentication
```bash
POST /api/admin/login
Body: {"username": "admin", "password": "SecureAdmin2025!"}
Response: {"token": "...", "expires_in": 86400}
```

### Get Signatures
```bash
GET /api/admin/signatures?page=1&limit=20&search=kumar
Headers: Authorization: Bearer <token>
```

### Get Statistics
```bash
GET /api/admin/stats
Headers: Authorization: Bearer <token>
```

### Delete Signature
```bash
DELETE /api/admin/signature/{signature_id}
Headers: Authorization: Bearer <token>
```

### Export CSV
```bash
GET /api/admin/export-csv
Headers: Authorization: Bearer <token>
```

### Logout
```bash
POST /api/admin/logout
Headers: Authorization: Bearer <token>
```

---

## 🆘 Troubleshooting

### "Invalid or expired token" Error
- Your session has expired (24 hours)
- Solution: Logout and login again

### "Too many requests" Error
- Rate limit reached
- Solution: Wait 5 minutes before trying again

### Can't see signatures in dashboard
- Backend might need restart
- Solution: Run `sudo supervisorctl restart backend`

### Login not working
- Check credentials in `/app/backend/.env`
- Ensure backend is running: `sudo supervisorctl status backend`

### Export CSV not downloading
- Check browser popup blocker
- Try using a different browser
- Ensure you're logged in

---

## 📞 Support

For technical issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `tail -f /var/log/supervisor/backend.err.log`
3. Check frontend console for errors (F12 in browser)

---

## ✅ Pre-Launch Checklist

Before making your petition public:

- [ ] Change default admin username and password
- [ ] Test admin login with new credentials
- [ ] Test petition submission from frontend
- [ ] Verify rate limiting is working (try submitting 4 times quickly)
- [ ] Test CSV export functionality
- [ ] Test delete functionality (with test entry)
- [ ] Verify all statistics are calculating correctly
- [ ] Keep admin URL (`/admin833`) confidential
- [ ] Set up regular backup schedule
- [ ] Test on mobile devices
- [ ] Share petition URL (NOT admin URL) with supporters

---

## 🎉 Your Petition is Ready!

**Public Petition URL:** `https://clean-air-delhi.preview.emergentagent.com`  
**Admin Panel URL:** `https://clean-air-delhi.preview.emergentagent.com/admin833`

Your petition website is now:
✅ Secure against spam and attacks  
✅ Protected with admin authentication  
✅ Ready to collect signatures  
✅ Easy to manage and export data  
✅ Mobile responsive  
✅ Production ready  

**Good luck with your campaign for clean air in Delhi!** 🌬️✨
