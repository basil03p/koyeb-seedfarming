#!/bin/bash
# Quick setup script for generating secure environment variables

echo "🔧 Torrent Seeder - Environment Setup"
echo "====================================="
echo

echo "📋 Copy these environment variables to your Koyeb deployment:"
echo
echo "NODE_ENV=production"
echo

# Prompt for admin credentials
read -p "Enter admin username (default: admin): " ADMIN_USERNAME
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}

read -s -p "Enter admin password (default: admin123): " ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}
echo
echo

echo "ADMIN_USERNAME=$ADMIN_USERNAME"
echo "ADMIN_PASSWORD=$ADMIN_PASSWORD"
echo
echo "✅ Environment variables generated!"
echo "📝 Save these credentials safely!"
echo
echo "🚀 Ready for Koyeb deployment!"
echo "   Follow the KOYEB_DEPLOYMENT_GUIDE.md for detailed instructions."
