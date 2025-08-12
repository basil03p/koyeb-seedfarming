# 🚀 Complete Koyeb Deployment Tutorial

This guide will walk you through deploying your Torrent Seeder application on Koyeb's free tier with custom login credentials.

## 📋 Prerequisites

- GitHub account
- Koyeb account (sign up at [koyeb.com](https://www.koyeb.com))
- This application code

## 🔧 Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `torrent-seeder-koyeb`
3. Set it to **Public** (required for free tier)
4. Don't initialize with README (we have one)

### 1.2 Push Your Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Torrent Seeder for Koyeb"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/torrent-seeder-koyeb.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy on Koyeb

### 2.1 Sign Up for Koyeb

1. Go to [koyeb.com](https://www.koyeb.com)
2. Click "Sign Up" 
3. Use GitHub to sign up (recommended)
4. Complete the verification process

### 2.2 Connect GitHub

1. In Koyeb dashboard, click "Create App"
2. Select "Deploy from GitHub"
3. Click "Connect GitHub account" if not already connected
4. Authorize Koyeb to access your repositories

### 2.3 Configure Deployment

1. **Select Repository**: Choose `torrent-seeder-koyeb`
2. **Branch**: `main`
3. **Build Configuration**:
   - **Build command**: Leave empty (npm install runs automatically)
   - **Run command**: `npm start`
   - **Port**: `8000`

### 2.4 Set Environment Variables

Click on **Environment Variables** and add:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NODE_ENV` | `production` | Runtime environment |
| `ADMIN_USERNAME` | `your-admin-username` | Custom admin username |
| `ADMIN_PASSWORD` | `your-secure-password` | Custom admin password |

⚠️ **Important**: 
- Choose a secure `ADMIN_PASSWORD`
- Remember your credentials!

### 2.5 Configure Instance

1. **Instance Type**: `Nano` (Free tier)
2. **Regions**: Select closest to your location:
   - `fra` (Frankfurt, Europe)
   - `was` (Washington, US)
   - `sin` (Singapore, Asia)
3. **Scaling**: Min: 1, Max: 1

### 2.6 Deploy

1. Review all settings
2. Click **"Deploy"**
3. Wait for deployment (usually 2-5 minutes)

## ✅ Step 3: Verify Deployment

### 3.1 Check Status

1. Monitor the build logs in Koyeb dashboard
2. Wait for status to show "Running"
3. Note your app URL: `https://your-app-name-your-org.koyeb.app`

### 3.2 Test Application

1. Open your app URL
2. You should see the login page
3. Login with your custom credentials:
   - Username: `your-admin-username`
   - Password: `your-secure-password`

## 🔒 Step 4: Security Best Practices

### 4.1 Change Default Credentials

If you used default values, update them:

1. Go to Koyeb dashboard → Your App → Settings → Environment Variables
2. Update `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Redeploy the application

### 4.2 Secure Your Credentials

Always use secure passwords for production:

1. Use strong, unique passwords
2. Never use default credentials in production
3. Consider using password managers

## 📊 Step 5: Monitor Usage (Free Tier Limits)

### 5.1 Koyeb Free Tier Includes:

- **Bandwidth**: 100 GB/month
- **Build time**: 100 minutes/month
- **Instance hours**: 512 hours/month
- **Sleep**: Apps sleep after 5 minutes of inactivity

### 5.2 Monitor in App

- Check the "Statistics" tab in your app
- Monitor monthly bandwidth usage
- The app tracks and displays Koyeb limits

### 5.3 Monitor in Koyeb Dashboard

- Go to your app in Koyeb dashboard
- Check "Metrics" for resource usage
- Monitor "Billing" section for usage limits

## 🔄 Step 6: Updates and Maintenance

### 6.1 Automatic Deployments

Any push to your `main` branch will trigger automatic redeployment.

### 6.2 Manual Deployment

1. Go to Koyeb dashboard → Your App
2. Click "Redeploy"
3. Select branch/commit if needed

### 6.3 View Logs

1. In Koyeb dashboard → Your App
2. Click "Runtime logs" to see application logs
3. Monitor for errors or issues

## 🐛 Troubleshooting

### Common Issues:

#### App Won't Start
- Check environment variables are set correctly
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Check runtime logs for errors

#### Can't Login
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- Check browser console for errors
- Ensure app is fully loaded

#### App Sleeps
- This is normal on free tier
- App will wake up when accessed
- First request after sleep may be slow

#### Bandwidth Exceeded
- Monitor usage in Statistics tab
- App will stop if 100GB limit exceeded
- Resets monthly

## 📱 Step 7: Using Your Torrent Seeder

### 7.1 Access Your App

- URL: `https://your-app-name-your-org.koyeb.app`
- Login with your custom credentials

### 7.2 Adding Torrents

1. **Upload .torrent files**: Click "Add Torrent"
2. **Add magnet links**: Click "Add Magnet"
3. Monitor progress in real-time

### 7.3 Monitor Performance

- **Dashboard**: Quick overview
- **Torrents**: Detailed torrent management
- **Statistics**: Bandwidth and usage tracking

## 🔧 Advanced Configuration

### Custom Domain (Pro feature)

If you upgrade to Koyeb Pro:

1. Go to your app settings
2. Add custom domain
3. Configure DNS records

### Environment-Specific Settings

For different environments, you can:

1. Create separate branches (dev, staging, prod)
2. Deploy multiple apps with different configs
3. Use different environment variables per environment

## 📞 Support

- **Koyeb Documentation**: [docs.koyeb.com](https://www.koyeb.com/docs)
- **Koyeb Community**: [community.koyeb.com](https://community.koyeb.com)
- **GitHub Issues**: Create issues in your repository

## 🎉 Congratulations!

Your torrent seeder is now running on Koyeb! You have:

✅ Secure custom login credentials  
✅ Professional deployment on Koyeb  
✅ Real-time torrent monitoring  
✅ Bandwidth usage tracking  
✅ Mobile-friendly dark UI  
✅ Automatic scaling and health checks  

Your application is now ready for seeding torrents on private trackers with a professional, reliable hosting solution!
