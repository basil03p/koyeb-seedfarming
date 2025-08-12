@echo off
echo 🔧 Torrent Seeder - Environment Setup
echo =====================================
echo.

echo 📋 Copy these environment variables to your Koyeb deployment:
echo.
echo NODE_ENV=production
echo.

REM Prompt for admin credentials
set /p ADMIN_USERNAME="Enter admin username (default: admin): "
if "%ADMIN_USERNAME%"=="" set ADMIN_USERNAME=admin

set /p ADMIN_PASSWORD="Enter admin password (default: admin123): "
if "%ADMIN_PASSWORD%"=="" set ADMIN_PASSWORD=admin123

echo.
echo ADMIN_USERNAME=%ADMIN_USERNAME%
echo ADMIN_PASSWORD=%ADMIN_PASSWORD%
echo.
echo ✅ Environment variables generated!
echo 📝 Save these credentials safely!
echo.
echo 🚀 Ready for Koyeb deployment!
echo    Follow the KOYEB_DEPLOYMENT_GUIDE.md for detailed instructions.
echo.
pause
