# Updating Existing WTWR Backend Deployment

This guide will help you update your existing deployment with the new version that includes error handling, validation, and logging.

## Overview of Changes

Your new version includes:

- ✅ Custom error classes (BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError)
- ✅ Centralized error handling middleware
- ✅ Request validation with celebrate/Joi
- ✅ Winston logging (request.log and error.log)
- ✅ Environment variable support with dotenv
- ✅ Improved security and error handling

## Step-by-Step Update Process

### Step 1: Prepare Local Repository

**Install dotenv locally (if not already done):**

```bash
cd /home/hunterm/Desktop/projects/wtwr/se_project_express
npm install dotenv
```

**Commit and push your changes:**

```bash
git add .
git commit -m "Add error handling, validation, logging, and production config"
git push origin main
```

### Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
# or
ssh your_username@YOUR_DROPLET_IP
```

### Step 3: Navigate to Your Project Directory

Find where your project is located. Common locations:

```bash
# Check common locations
cd /var/www/se_project_express
# or
cd /home/your_username/se_project_express
# or
cd ~/se_project_express

# Verify you're in the right place
pwd
ls -la
```

### Step 4: Backup Current Deployment (Optional but Recommended)

```bash
# Create a backup of your current version
cd ..
cp -r se_project_express se_project_express_backup_$(date +%Y%m%d)

# Go back to project directory
cd se_project_express
```

### Step 5: Stop the Running Application

**If using PM2:**

```bash
pm2 list                    # See all running processes
pm2 stop all                # Stop all processes
# or
pm2 stop app_name           # Stop specific app
```

**If running with node/nodemon directly:**

```bash
# Find the process
ps aux | grep node

# Kill the process (replace PID with actual process ID)
kill PID
```

**If running as a systemd service:**

```bash
sudo systemctl stop your-service-name
```

### Step 6: Pull Latest Code

```bash
# Make sure you're in the project directory
cd /var/www/se_project_express  # or your actual path

# Stash any local changes (like .env file)
git stash

# Pull latest code
git pull origin main

# Restore your stashed changes (if needed)
git stash pop
```

### Step 7: Install New Dependencies

```bash
# Install all dependencies including new ones (celebrate, joi, validator, winston, dotenv)
npm install

# Or use production install (excludes devDependencies)
npm install --production
```

**New packages that will be installed:**

- dotenv (environment variables)
- celebrate (request validation)
- validator (URL validation)
- winston (logging)
- express-winston (logging middleware)

### Step 8: Update/Create Environment File

**Check if .env file exists:**

```bash
ls -la .env
```

**If .env doesn't exist, create it:**

```bash
nano .env
```

**Add the following (update with your actual values):**

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
# Use your existing MongoDB connection string
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wtwr_db

# JWT Configuration - Use a strong secret (generate one below)
JWT_SECRET=your-existing-or-new-secret-key

# CORS Configuration - Your frontend URL
FRONTEND_URL=http://your-droplet-ip
# or if you have a domain:
# FRONTEND_URL=https://yourdomain.com
```

**Generate a strong JWT secret (if you need a new one):**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save and exit:** Ctrl+X, then Y, then Enter

**Set proper permissions:**

```bash
chmod 600 .env
```

### Step 9: Create Logs Directory

```bash
# Create logs directory for PM2 (if using PM2)
mkdir -p logs
```

### Step 10: Update PM2 Configuration (If Using PM2)

**Check if ecosystem.config.js exists:**

```bash
cat ecosystem.config.js
```

**If it doesn't exist or needs updating, create/update it:**

```bash
nano ecosystem.config.js
```

**Add this configuration:**

```javascript
module.exports = {
  apps: [
    {
      name: "wtwr-api",
      script: "./app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
      time: true,
    },
  ],
};
```

Save and exit.

### Step 11: Test the Application Locally on Droplet

Before starting with PM2, test that the app runs:

```bash
# Test the app directly
node app.js
```

You should see:

```
Connected to MongoDB
App listening at port 3001
```

If you see errors:

- Check MongoDB is running: `sudo systemctl status mongod`
- Check your .env file has correct values
- Check for syntax errors in the logs

**Once it works, stop it:** Press Ctrl+C

### Step 12: Start Application with PM2

**If this is your first time using PM2:**

```bash
# Start the app
pm2 start ecosystem.config.js

# Save the PM2 process list
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it gives you (run it with sudo)
```

**If you already have PM2 configured:**

```bash
# Start or restart the app
pm2 restart ecosystem.config.js

# Or if using old configuration
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs wtwr-api
```

### Step 13: Verify Application is Running

**Check PM2 status:**

```bash
pm2 status
pm2 logs wtwr-api --lines 50
```

**Test the API locally on the droplet:**

```bash
curl http://localhost:3001/items
```

**Check the logs are being created:**

```bash
ls -la *.log
tail -f request.log
tail -f error.log
```

### Step 14: Update Nginx Configuration (If Needed)

**Check current Nginx configuration:**

```bash
sudo nginx -t
cat /etc/nginx/sites-available/default
# or
cat /etc/nginx/sites-available/wtwr-api
```

**If CORS settings changed, you might need to update Nginx headers:**

```bash
sudo nano /etc/nginx/sites-available/wtwr-api
```

**Ensure your config includes:**

```nginx
server {
    listen 80;
    server_name YOUR_DROPLET_IP;  # or your domain

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Test and restart Nginx:**

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 15: Test from Outside the Droplet

**From your local machine:**

```bash
# Test basic endpoint
curl http://YOUR_DROPLET_IP/items

# Test with browser
# Open: http://YOUR_DROPLET_IP/items
```

### Step 16: Update Frontend (If Not Done Yet)

On your local machine, update the frontend to point to your droplet:

**In `se_project_react/src/utils/api.js` and `auth.js`:**

```javascript
// Change from
const baseUrl = "http://localhost:3001";

// To
const baseUrl = "http://YOUR_DROPLET_IP";
// or
const baseUrl = "https://yourdomain.com";
```

Then rebuild and redeploy your frontend.

## Troubleshooting

### Application won't start

**Check logs:**

```bash
pm2 logs wtwr-api
cat error.log
```

**Common issues:**

- Missing .env file → Create it with required variables
- MongoDB not running → `sudo systemctl start mongod`
- Port already in use → `sudo lsof -i :3001` and kill the process
- Missing dependencies → Run `npm install`

### MongoDB connection errors

**If using local MongoDB:**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

**If using MongoDB Atlas:**

- Check connection string is correct in .env
- Verify IP whitelist includes your droplet's IP (or 0.0.0.0/0)
- Check database user credentials

### "Cannot find module 'dotenv'" error

```bash
npm install dotenv
pm2 restart wtwr-api
```

### CORS errors from frontend

**Update your .env file:**

```env
FRONTEND_URL=http://your-frontend-url
```

**Or update app.js to allow your frontend:**

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
```

Then restart:

```bash
pm2 restart wtwr-api
```

### Validation errors on all requests

This is expected! The new version includes request validation. Make sure your frontend is sending:

- Valid email format for user routes
- Valid URL format for image URLs
- Valid MongoDB ObjectIDs for item/user IDs

### Logs not being created

```bash
# Check file permissions
ls -la *.log

# Check if logs directory exists (for PM2)
mkdir -p logs

# Restart the app
pm2 restart wtwr-api
```

## Useful Commands

### PM2 Commands

```bash
pm2 list                    # List all processes
pm2 logs wtwr-api          # View logs in real-time
pm2 logs wtwr-api --lines 100  # View last 100 lines
pm2 restart wtwr-api       # Restart app
pm2 stop wtwr-api          # Stop app
pm2 delete wtwr-api        # Remove from PM2
pm2 monit                  # Monitor CPU/memory
pm2 flush                  # Clear logs
```

### Application Logs

```bash
# View winston logs
tail -f request.log
tail -f error.log

# View PM2 logs
tail -f logs/pm2-error.log
tail -f logs/pm2-out.log
```

### MongoDB Commands

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start/stop/restart MongoDB
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod

# Connect to MongoDB shell
mongosh
# or on older versions
mongo
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## Quick Update Checklist

- [ ] Stop running application (`pm2 stop all`)
- [ ] Backup current version (optional)
- [ ] Pull latest code (`git pull origin main`)
- [ ] Install dependencies (`npm install`)
- [ ] Create/update .env file with all required variables
- [ ] Create logs directory (`mkdir -p logs`)
- [ ] Test application (`node app.js`)
- [ ] Start with PM2 (`pm2 start ecosystem.config.js`)
- [ ] Check logs (`pm2 logs wtwr-api`)
- [ ] Test API endpoints (`curl http://localhost:3001/items`)
- [ ] Test from browser (http://YOUR_DROPLET_IP)
- [ ] Update frontend API URL if needed

## Rollback (If Something Goes Wrong)

If the update causes issues:

```bash
# Stop current version
pm2 stop all

# Restore backup
cd ..
rm -rf se_project_express
mv se_project_express_backup_YYYYMMDD se_project_express
cd se_project_express

# Start old version
pm2 start ecosystem.config.js
# or
pm2 start app.js --name wtwr-api
```

## Environment Variables Reference

Make sure your `.env` file has all these variables:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://your-frontend-url
```

## What's New in This Version

Your updated backend now includes:

1. **Error Handling:**

   - Custom error classes in `utils/errors/`
   - Centralized error handler in `middlewares/error-handler.js`
   - Proper HTTP status codes (400, 401, 403, 404, 409, 500)

2. **Request Validation:**

   - All routes validated with celebrate/Joi
   - Email validation
   - URL validation for images
   - MongoDB ObjectID validation

3. **Logging:**

   - Winston logger for all requests → `request.log`
   - Winston logger for all errors → `error.log`
   - Better debugging and monitoring

4. **Security:**
   - Environment variables for sensitive data
   - Improved JWT secret management
   - Better CORS configuration

Good luck with your update! 🚀
