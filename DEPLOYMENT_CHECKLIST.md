# 🚀 Koyeb Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] Repository is **public** (required for free tier)
- [ ] Environment variables prepared:
  - [ ] `ADMIN_USERNAME` (your custom admin username)
  - [ ] `ADMIN_PASSWORD` (your secure password)
- [ ] `koyeb.yaml` file is present in repository root
- [ ] Application tested locally

## 🔧 Environment Variables for Koyeb

Copy these to your Koyeb app settings:

```
NODE_ENV=production
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
```

## 📱 Quick Generation Commands

### Generate Admin Credentials
```bash
# Or use the setup script
./setup-env.sh       # Linux/Mac
setup-env.bat        # Windows
```

## 🎯 Deployment Steps Summary

1. **GitHub**: Push code to public repository
2. **Koyeb**: Create account and connect GitHub
3. **Deploy**: Select repository and configure
4. **Environment**: Set the 3 required variables above
5. **Instance**: Use Nano (free tier)
6. **Launch**: Deploy and test!

## 🔍 Post-Deployment Verification

- [ ] App status shows "Running" in Koyeb dashboard
- [ ] Can access app URL: `https://your-app-name.koyeb.app`
- [ ] Login page loads correctly
- [ ] Can login with custom credentials
- [ ] Dashboard displays properly
- [ ] Can upload torrent/add magnet link
- [ ] Real-time updates work (WebSocket connection)
- [ ] Statistics page shows Koyeb limits

## 📊 Monitoring

- **Koyeb Dashboard**: Monitor app status, logs, and metrics
- **App Statistics**: Track bandwidth usage (100GB monthly limit)
- **Build Time**: Monitor minutes used (100 minutes monthly limit)

## 🛠️ Troubleshooting

### App Won't Start
- Check environment variables are set
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are configured
- Check runtime logs in Koyeb dashboard

### Can't Access App
- Ensure app status is "Running"
- Check if app is sleeping (normal for free tier)
- Verify URL format: `https://app-name-org.koyeb.app`

### Login Issues
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Check browser console for JavaScript errors
- Clear browser cache and cookies

## 📞 Support Resources

- **Koyeb Docs**: https://www.koyeb.com/docs
- **Koyeb Community**: https://community.koyeb.com
- **This Project**: See `KOYEB_DEPLOYMENT_GUIDE.md` for detailed guide

---

✨ **Ready to deploy? Follow the detailed guide in `KOYEB_DEPLOYMENT_GUIDE.md`**
