# ⚡ Quick Go-Live Guide (5 Minutes)

## Right Now - Do These 3 Things:

### 1️⃣ Get Your Live URL (1 minute)
- Go to: https://dashboard.render.com
- Click on "Library" blueprint
- Click on web service: `murenas-students-library`
- **Copy the URL** (e.g., `https://murenas-students-library.onrender.com`)
- ✅ **This is your live site URL!**

### 2️⃣ Create Admin Account (2 minutes)
- In Render Dashboard → Web Service → **Shell** tab
- Run this command (replace with your details):
  ```bash
  npm run create:admin admin@nust.ac.zw YourSecurePassword123 "Admin Name"
  ```
- ✅ Save these credentials!

### 3️⃣ Test & Share (2 minutes)
- Visit your URL in browser
- Test registration: `/register`
- Test login: `/login`
- ✅ If it works, **you're live!**

## 📢 Share with Students

**Copy this message:**

```
🎉 Murena's Students Library is now live!

Access: [YOUR-URL-HERE]

Features:
✅ Exam materials & past papers
✅ Academic calendar
✅ SRC contacts
✅ Sports captains
✅ Registration notices

Register now to get started!
```

## 🔍 Quick Health Check

Visit these pages to verify:
- ✅ `/` - Home page
- ✅ `/register` - Registration form
- ✅ `/materials` - Materials page
- ✅ `/academics/calendar` - Calendar
- ✅ `/academics/src` - SRC section
- ✅ `/sports/contacts` - Sports captains

## 🆘 If Something's Broken

1. **Check Render Logs**: Service → Logs tab
2. **Check Service Status**: Should be "Live" (green)
3. **Verify Database**: Should be "Available"

## ✅ You're Done!

Once you've:
- ✅ Got your URL
- ✅ Created admin account
- ✅ Tested the site

**You're live and ready for students!** 🎉

---

**Need more details?** See `GO_LIVE_CHECKLIST.md` for complete guide.

