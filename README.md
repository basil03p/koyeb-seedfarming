# Torrent Seeder for Koyeb

A stylish, dark-themed torrent seeder web application optimized for Koyeb's free tier. Perfect for private tracker users who need a reliable seeding solution.

## Features

- 🌙 **Dark Stylish UI** - Modern, responsive design with dark theme
- 🔐 **Secure Authentication** - Login/register system with session management
- 📁 **Torrent Management** - Upload .torrent files or add magnet links
- 📊 **Real-time Statistics** - Live monitoring of torrents, speeds, and ratios
- 📈 **Traffic Monitoring** - Track monthly bandwidth usage for Koyeb limits
- 🚀 **Koyeb Optimized** - Designed to work efficiently within free tier limits
- ⚡ **WebSocket Updates** - Real-time updates without page refresh
- 📱 **Mobile Friendly** - Responsive design works on all devices

## Koyeb Free Tier Limits

- **Monthly Bandwidth**: 100 GB
- **Memory**: 512 MB
- **Sleep**: App sleeps after inactivity
- **Regions**: Multiple available

## Quick Deploy to Koyeb

### Method 1: Direct Deploy (Recommended)

1. Fork this repository
2. Connect your GitHub account to Koyeb
3. Create a new service and select this repository
4. Set the following environment variables:
   - `NODE_ENV`: `production`
   - `ADMIN_USERNAME`: `your-admin-username`
   - `ADMIN_PASSWORD`: `your-secure-password`
5. Deploy!

**📖 For detailed step-by-step instructions, see: [KOYEB_DEPLOYMENT_GUIDE.md](KOYEB_DEPLOYMENT_GUIDE.md)**

### Method 2: Manual Deployment

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd torrent-seeder-koyeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your settings:
   ```
   NODE_ENV=development
   PORT=3000
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   ```

   Or use the setup script:
   ```bash
   # Linux/Mac
   ./setup-env.sh
   
   # Windows
   setup-env.bat
   ```

5. Test locally:
   ```bash
   npm start
   ```

6. Deploy to Koyeb using their CLI or web interface

## Default Login

⚠️ **Environment Variables Required**

The login credentials are now set via environment variables:

- **Username**: Set via `ADMIN_USERNAME` (default: `admin`)
- **Password**: Set via `ADMIN_PASSWORD` (default: `admin123`)

**🔒 Security**: Always change the default credentials in production by setting custom environment variables.

## Usage

### Adding Torrents

1. **Upload Torrent File**: Click "Add Torrent" and select a .torrent file
2. **Add Magnet Link**: Click "Add Magnet" and paste the magnet URI

### Monitoring

- **Dashboard**: Overview of active torrents and statistics
- **Torrents**: Detailed view of all torrents with real-time stats
- **Statistics**: Traffic usage and Koyeb limit monitoring

### Traffic Management

The app monitors your bandwidth usage to help stay within Koyeb's 100 GB monthly limit:

- Real-time bandwidth tracking
- Monthly usage reset
- Visual progress indicators
- Warnings when approaching limits

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Rate limiting
- Helmet.js security headers
- Input validation and sanitization
- CSRF protection

## Technical Stack

- **Backend**: Node.js, Express.js
- **Torrent Engine**: WebTorrent
- **Real-time**: WebSockets
- **Authentication**: Sessions with bcrypt
- **Security**: Helmet, rate limiting
- **Frontend**: Vanilla JavaScript, CSS3
- **Icons**: Font Awesome

## File Structure

```
torrent-seeder-koyeb/
├── server.js              # Main server application
├── package.json           # Dependencies and scripts
├── koyeb.yaml            # Koyeb deployment configuration
├── .env.example          # Environment variables template
├── public/               # Static frontend files
│   ├── dashboard.html    # Main dashboard interface
│   ├── login.html        # Login/register page
│   ├── styles.css        # Dark theme styling
│   └── dashboard.js      # Frontend JavaScript
└── uploads/              # Temporary torrent file storage
```

## Configuration

### Environment Variables

- `NODE_ENV`: Set to `production` for deployment
- `PORT`: Server port (default: 8000 for Koyeb)
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password

### Koyeb Configuration

The `koyeb.yaml` file is pre-configured for optimal deployment:

- Nano instance (free tier)
- Auto-scaling: 1-1 instances
- Health checks enabled
- Europe (Frankfurt) region

## Performance Optimization

- Compression middleware
- Efficient WebTorrent configuration
- Memory usage monitoring
- Automatic cleanup of temporary files
- Rate limiting to prevent abuse

## Monitoring & Logging

- Real-time torrent statistics
- Bandwidth usage tracking
- Error logging
- Performance metrics

## Troubleshooting

### Common Issues

1. **App Sleeping**: Koyeb free tier apps sleep after inactivity. This is normal.
2. **Bandwidth Limits**: Monitor usage in the Statistics tab.
3. **Torrent Not Starting**: Check if the torrent file/magnet link is valid.
4. **Connection Issues**: Ensure WebSocket connections are allowed.

### Logs

Check Koyeb deployment logs for error messages and debugging information.

## Privacy & Legal

- This application is intended for legal content only
- Users are responsible for compliance with local laws
- No torrent data is stored permanently on the server
- Use only with content you have the right to distribute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Koyeb documentation
3. Open an issue on GitHub

---

**Note**: This application is designed for educational and legal purposes only. Ensure compliance with your local laws and the terms of service of any private trackers you use.
