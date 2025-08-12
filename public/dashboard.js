// Dashboard JavaScript functionality
let ws = null;
let torrents = [];
let stats = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeWebSocket();
    loadTorrents();
    loadStats();
    setupEventListeners();
    
    // Update every 5 seconds
    setInterval(() => {
        loadTorrents();
        loadStats();
    }, 5000);
});

// WebSocket connection for real-time updates
function initializeWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
            torrents = data.torrents;
            stats = data.stats;
            if (data.diskSpace) {
                updateDiskSpaceDisplay(data.diskSpace);
            }
            updateUI();
        }
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(initializeWebSocket, 5000);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });
    
    // Modal triggers
    document.getElementById('addTorrentBtn').addEventListener('click', () => openModal('torrentModal'));
    document.getElementById('addTorrentBtn2').addEventListener('click', () => openModal('torrentModal'));
    document.getElementById('addMagnetBtn').addEventListener('click', () => openModal('magnetModal'));
    document.getElementById('addMagnetBtn2').addEventListener('click', () => openModal('magnetModal'));
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Form submissions
    document.getElementById('torrentForm').addEventListener('submit', handleTorrentUpload);
    document.getElementById('magnetForm').addEventListener('submit', handleMagnetSubmit);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to nav link
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Modal management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    // Reset forms
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    if (form) form.reset();
}

// Load torrents from API
async function loadTorrents() {
    try {
        const response = await fetch('/api/torrents');
        if (!response.ok) throw new Error('Failed to load torrents');
        
        torrents = await response.json();
        updateTorrentsList();
        updateRecentActivity();
    } catch (error) {
        console.error('Error loading torrents:', error);
        showNotification('Failed to load torrents', 'error');
    }
}

// Load statistics from API
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to load stats');
        
        stats = await response.json();
        updateStatsDisplay();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Update UI with latest data
function updateUI() {
    updateTorrentsList();
    updateRecentActivity();
    updateStatsDisplay();
}

// Update torrents list
function updateTorrentsList() {
    const container = document.getElementById('torrentsList');
    
    if (torrents.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-download" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>No torrents added yet. Upload a torrent file or add a magnet link to get started.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = torrents.map(torrent => `
        <div class="torrent-item" data-id="${torrent.id}">
            <div class="torrent-header">
                <div>
                    <div class="torrent-name">${escapeHtml(torrent.name)}</div>
                    <div class="torrent-info">
                        Size: ${formatBytes(torrent.size)} • Files: ${torrent.files} • Added: ${formatDate(torrent.addedAt)}
                    </div>
                </div>
                <div class="torrent-actions">
                    <span class="status-badge status-${torrent.status}">${torrent.status}</span>
                    <button class="btn btn-danger" onclick="removeTorrent('${torrent.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="torrent-stats">
                <div class="stat-item">
                    <span class="stat-label">Downloaded:</span>
                    <span class="stat-value">${formatBytes(torrent.downloaded)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Uploaded:</span>
                    <span class="stat-value">${formatBytes(torrent.uploaded)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Ratio:</span>
                    <span class="stat-value">${torrent.ratio.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Peers:</span>
                    <span class="stat-value">${torrent.peers}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Download Speed:</span>
                    <span class="stat-value">${formatSpeed(torrent.speed.download)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Upload Speed:</span>
                    <span class="stat-value">${formatSpeed(torrent.speed.upload)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update recent activity
function updateRecentActivity() {
    const container = document.getElementById('recentTorrents');
    const recentTorrents = torrents.slice(0, 3);
    
    if (recentTorrents.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No recent activity</p>';
        return;
    }
    
    container.innerHTML = recentTorrents.map(torrent => `
        <div class="torrent-item">
            <div class="torrent-header">
                <div>
                    <div class="torrent-name">${escapeHtml(torrent.name)}</div>
                    <div class="torrent-info">
                        ${formatBytes(torrent.size)} • ${torrent.status} • ${formatSpeed(torrent.speed.upload)} up
                    </div>
                </div>
                <span class="status-badge status-${torrent.status}">${torrent.status}</span>
            </div>
        </div>
    `).join('');
}

// Update stats display
function updateStatsDisplay() {
    if (!stats.torrents) return;
    
    // Quick stats
    document.getElementById('totalTorrents').textContent = stats.torrents.total;
    document.getElementById('seedingTorrents').textContent = stats.torrents.seeding;
    document.getElementById('monthlyTraffic').textContent = formatBytes(stats.traffic.monthly);
    document.getElementById('remainingBandwidth').textContent = formatBytes(stats.koyebLimits.remainingBandwidth);
    
    // Update free space in quick stats
    if (stats.diskSpace) {
        document.getElementById('freeSpace').textContent = formatBytes(stats.diskSpace.free);
    }
    
    // Detailed stats
    document.getElementById('statsMonthly').textContent = formatBytes(stats.traffic.monthly);
    document.getElementById('statsTotal').textContent = formatBytes(stats.traffic.total);
    document.getElementById('statsRemaining').textContent = formatBytes(stats.koyebLimits.remainingBandwidth);
    
    // Progress bar
    const usagePercent = (stats.traffic.monthly / stats.koyebLimits.monthlyBandwidth) * 100;
    document.getElementById('trafficProgress').style.width = `${Math.min(usagePercent, 100)}%`;
    document.getElementById('trafficPercent').textContent = `${usagePercent.toFixed(1)}%`;
    
    // Update disk space display if available
    if (stats.diskSpace) {
        updateDiskSpaceDisplay(stats.diskSpace);
    }
}

// Update disk space display
function updateDiskSpaceDisplay(diskSpace) {
    // Update disk space elements if they exist
    const diskTotal = document.getElementById('diskTotal');
    const diskUsed = document.getElementById('diskUsed');
    const diskFree = document.getElementById('diskFree');
    const diskProgress = document.getElementById('diskProgress');
    const diskPercent = document.getElementById('diskPercent');
    
    if (diskTotal) diskTotal.textContent = formatBytes(diskSpace.total);
    if (diskUsed) diskUsed.textContent = formatBytes(diskSpace.used);
    if (diskFree) diskFree.textContent = formatBytes(diskSpace.free);
    
    if (diskProgress && diskPercent) {
        const usage = diskSpace.percentage || 0;
        diskProgress.style.width = `${Math.min(usage, 100)}%`;
        diskPercent.textContent = `${usage.toFixed(1)}%`;
        
        // Change color based on usage
        if (usage > 90) {
            diskProgress.style.background = 'var(--danger-color)';
        } else if (usage > 75) {
            diskProgress.style.background = 'var(--warning-color)';
        } else {
            diskProgress.style.background = 'var(--gradient-primary)';
        }
    }
}

// Handle torrent file upload
async function handleTorrentUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fileInput = document.getElementById('torrentFile');
    
    if (!fileInput.files[0]) {
        showNotification('Please select a torrent file', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/torrents/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Torrent added successfully!', 'success');
            closeModal('torrentModal');
            loadTorrents();
        } else {
            showNotification(result.error || 'Failed to add torrent', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Network error', 'error');
    }
}

// Handle magnet link submission
async function handleMagnetSubmit(e) {
    e.preventDefault();
    
    const magnetUri = document.getElementById('magnetUri').value.trim();
    
    if (!magnetUri.startsWith('magnet:')) {
        showNotification('Please enter a valid magnet URI', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/torrents/magnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ magnetUri })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Magnet link added successfully!', 'success');
            closeModal('magnetModal');
            loadTorrents();
        } else {
            showNotification(result.error || 'Failed to add magnet link', 'error');
        }
    } catch (error) {
        console.error('Magnet error:', error);
        showNotification('Network error', 'error');
    }
}

// Remove torrent
async function removeTorrent(torrentId) {
    if (!confirm('Are you sure you want to remove this torrent?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/torrents/${torrentId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Torrent removed successfully', 'success');
            loadTorrents();
        } else {
            showNotification(result.error || 'Failed to remove torrent', 'error');
        }
    } catch (error) {
        console.error('Remove error:', error);
        showNotification('Network error', 'error');
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/login';
    }
}

// Utility functions
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatSpeed(bytesPerSec) {
    return formatBytes(bytesPerSec) + '/s';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
