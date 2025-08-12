const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const WebTorrent = require('webtorrent');
const multer = require('multer');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'koyeb-torrent-seeder-default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/x-bittorrent' || file.originalname.endsWith('.torrent')) {
      cb(null, true);
    } else {
      cb(new Error('Only .torrent files are allowed'), false);
    }
  }
});

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// In-memory storage (replace with database in production)
const users = new Map();
const torrents = new Map();
const trafficStats = {
  monthly: 0,
  daily: 0,
  total: 0,
  lastReset: new Date().getMonth()
};

// Default admin user from environment variables
const defaultAdmin = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
  role: 'admin'
};
users.set(process.env.ADMIN_USERNAME || 'admin', defaultAdmin);

// WebTorrent client
const client = new WebTorrent();

// Function to get disk space information
function getDiskSpace() {
  try {
    let stats;
    
    if (process.platform === 'win32') {
      // Windows
      const output = execSync('wmic logicaldisk where size!=0 get size,freespace,caption', { encoding: 'utf8' });
      const lines = output.split('\n').filter(line => line.trim() && !line.includes('Caption'));
      
      if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const freeSpace = parseInt(parts[1]) || 0;
        const totalSpace = parseInt(parts[2]) || 0;
        const usedSpace = totalSpace - freeSpace;
        
        return {
          total: totalSpace,
          used: usedSpace,
          free: freeSpace,
          percentage: totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0
        };
      }
    } else {
      // Linux/Mac
      const output = execSync('df -B1 .', { encoding: 'utf8' });
      const lines = output.split('\n');
      
      if (lines.length > 1) {
        const parts = lines[1].trim().split(/\s+/);
        const totalSpace = parseInt(parts[1]) || 0;
        const usedSpace = parseInt(parts[2]) || 0;
        const freeSpace = parseInt(parts[3]) || 0;
        
        return {
          total: totalSpace,
          used: usedSpace,
          free: freeSpace,
          percentage: totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0
        };
      }
    }
  } catch (error) {
    console.error('Error getting disk space:', error);
  }
  
  // Fallback values
  return {
    total: 0,
    used: 0,
    free: 0,
    percentage: 0
  };
}

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Authentication routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const user = users.get(username);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.user = { username: user.username, role: user.role };
  res.json({ success: true, user: { username: user.username, role: user.role } });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  if (users.has(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(username, {
    username,
    password: hashedPassword,
    role: 'user'
  });
  
  res.json({ success: true });
});

// Torrent routes
app.post('/api/torrents/upload', requireAuth, upload.single('torrent'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No torrent file provided' });
    }
    
    const torrentData = fs.readFileSync(req.file.path);
    
    client.add(torrentData, (torrent) => {
      const torrentInfo = {
        id: torrent.infoHash,
        name: torrent.name,
        size: torrent.length,
        files: torrent.files.length,
        peers: 0,
        downloaded: 0,
        uploaded: 0,
        ratio: 0,
        speed: { download: 0, upload: 0 },
        status: 'downloading',
        addedAt: new Date(),
        user: req.session.user.username
      };
      
      torrents.set(torrent.infoHash, torrentInfo);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({ success: true, torrent: torrentInfo });
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to add torrent' });
  }
});

app.post('/api/torrents/magnet', requireAuth, (req, res) => {
  try {
    const { magnetUri } = req.body;
    
    if (!magnetUri || !magnetUri.startsWith('magnet:')) {
      return res.status(400).json({ error: 'Invalid magnet URI' });
    }
    
    client.add(magnetUri, (torrent) => {
      const torrentInfo = {
        id: torrent.infoHash,
        name: torrent.name || 'Unknown',
        size: torrent.length || 0,
        files: torrent.files ? torrent.files.length : 0,
        peers: 0,
        downloaded: 0,
        uploaded: 0,
        ratio: 0,
        speed: { download: 0, upload: 0 },
        status: 'downloading',
        addedAt: new Date(),
        user: req.session.user.username
      };
      
      torrents.set(torrent.infoHash, torrentInfo);
      
      res.json({ success: true, torrent: torrentInfo });
    });
    
  } catch (error) {
    console.error('Magnet error:', error);
    res.status(500).json({ error: 'Failed to add magnet link' });
  }
});

app.get('/api/torrents', requireAuth, (req, res) => {
  const userTorrents = Array.from(torrents.values())
    .filter(t => t.user === req.session.user.username || req.session.user.role === 'admin');
  
  res.json(userTorrents);
});

app.delete('/api/torrents/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const torrent = client.get(id);
  
  if (!torrent) {
    return res.status(404).json({ error: 'Torrent not found' });
  }
  
  const torrentInfo = torrents.get(id);
  if (torrentInfo.user !== req.session.user.username && req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  torrent.destroy();
  torrents.delete(id);
  
  res.json({ success: true });
});

// Stats routes
app.get('/api/stats', requireAuth, (req, res) => {
  // Reset monthly stats if new month
  const currentMonth = new Date().getMonth();
  if (currentMonth !== trafficStats.lastReset) {
    trafficStats.monthly = 0;
    trafficStats.lastReset = currentMonth;
  }
  
  const userTorrents = Array.from(torrents.values())
    .filter(t => t.user === req.session.user.username || req.session.user.role === 'admin');
  
  // Get disk space information
  const diskSpace = getDiskSpace();
  
  const stats = {
    torrents: {
      total: userTorrents.length,
      active: userTorrents.filter(t => t.status === 'downloading' || t.status === 'seeding').length,
      seeding: userTorrents.filter(t => t.status === 'seeding').length
    },
    traffic: trafficStats,
    diskSpace: diskSpace,
    koyebLimits: {
      monthlyBandwidth: 100 * 1024 * 1024 * 1024, // 100GB
      usedBandwidth: trafficStats.monthly,
      remainingBandwidth: (100 * 1024 * 1024 * 1024) - trafficStats.monthly,
      diskSpace: {
        // Koyeb free tier has ephemeral storage, but show current usage
        totalSpace: diskSpace.total,
        usedSpace: diskSpace.used,
        freeSpace: diskSpace.free,
        usagePercentage: diskSpace.percentage
      }
    }
  };
  
  res.json(stats);
});

// WebSocket for real-time updates
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  const interval = setInterval(() => {
    // Update torrent stats
    client.torrents.forEach(torrent => {
      const info = torrents.get(torrent.infoHash);
      if (info) {
        info.peers = torrent.numPeers;
        info.downloaded = torrent.downloaded;
        info.uploaded = torrent.uploaded;
        info.ratio = torrent.downloaded > 0 ? torrent.uploaded / torrent.downloaded : 0;
        info.speed = {
          download: torrent.downloadSpeed,
          upload: torrent.uploadSpeed
        };
        info.status = torrent.progress === 1 ? 'seeding' : 'downloading';
        
        // Update traffic stats
        trafficStats.total += torrent.uploadSpeed / 1000; // Convert to bytes per second
        trafficStats.monthly += torrent.uploadSpeed / 1000;
        trafficStats.daily += torrent.uploadSpeed / 1000;
      }
    });
    
    // Send updates to client
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update',
        torrents: Array.from(torrents.values()),
        stats: trafficStats,
        diskSpace: getDiskSpace()
      }));
    }
  }, 2000);
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Torrent Seeder running on port ${PORT}`);
  console.log(`Default login: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  client.destroy();
  server.close(() => {
    process.exit(0);
  });
});
