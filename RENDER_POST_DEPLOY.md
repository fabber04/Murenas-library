# Post-Deployment Checklist

Your application is now running on Render! 🎉

## ✅ Immediate Steps

### 1. Get Your Application URL
- Go to Render Dashboard: https://dashboard.render.com
- Click on your web service: `murenas-students-library`
- Copy the URL (e.g., `https://murenas-students-library.onrender.com`)

### 2. Create Admin User
1. In Render Dashboard → Your Web Service → **Shell**
2. Run:
   ```bash
   npm run create:admin admin@example.com yourpassword "Admin Name"
   ```
3. Replace with your actual email and password

### 3. Verify Database Migrations
Check the logs to ensure migrations ran successfully:
- Service → **Logs** tab
- Look for: "Prisma migrations applied successfully"

If migrations didn't run, use Shell:
```bash
npm run prisma:migrate:deploy
```

### 4. Test Your Application

**Test these features:**
- [ ] Home page loads
- [ ] Registration works (`/register`)
- [ ] Login works (`/login`)
- [ ] Admin dashboard accessible (`/admin`)
- [ ] Materials page shows uploaded files (`/materials`)
- [ ] Calendar page displays calendar (`/academics/calendar`)
- [ ] File upload works (`/materials/submit`)

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to database"
**Fix:**
- Verify `DATABASE_URL` is set in environment variables
- Use "Internal Database URL" (not external)
- Check `DATABASE_SSL=true` is set

### Issue: "Sessions not working"
**Fix:**
- Verify `SESSION_SECRET` is set
- Check PostgreSQL session table exists
- Review logs for session store errors

### Issue: "File uploads not saving"
**Fix:**
- Verify disk is mounted: Check Disks section
- Verify `UPLOADS_DIR` matches disk mount path
- Check disk has space available

### Issue: "404 errors on routes"
**Fix:**
- Verify build completed successfully
- Check `rootDir: server` is set correctly
- Review build logs for errors

## 📊 Monitor Your Application

### View Logs
- **Real-time logs**: Service → Logs tab
- **Build logs**: Service → Events → Build logs
- **Deployment logs**: Service → Events → Deploy logs

### Check Health
- Service → Metrics tab
- Health check endpoint: `https://your-app.onrender.com/`

## 🔄 Update Your Application

### Automatic Updates
- Render auto-deploys on every push to `main` branch
- Configured in `render.yaml` with `autoDeploy: true`

### Manual Deploy
1. Go to Service → Manual Deploy
2. Select branch/commit
3. Click "Deploy"

## 📝 Environment Variables

Verify these are set in Render Dashboard:

- ✅ `DATABASE_URL` - Auto-set from database
- ✅ `DATABASE_SSL` - `true`
- ✅ `SESSION_SECRET` - Auto-generated
- ✅ `NODE_ENV` - `production`
- ✅ `UPLOADS_DIR` - `/opt/render/project/src/server/uploads`

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Service → Settings → Custom Domains
   - Add your domain
   - Update DNS records

2. **Backup Database**:
   - Regular backups recommended
   - Use Render's backup feature or manual exports

3. **Monitor Usage**:
   - Free tier: 750 hours/month
   - Monitor in Dashboard → Usage

4. **Scale Up** (if needed):
   - Upgrade plan for more resources
   - Add more disk space if needed

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: support@render.com
- **Check Logs**: Service → Logs tab

## 🎉 Congratulations!

Your Murena's Students Library is now live on Render!

Visit your URL and start using your application.

