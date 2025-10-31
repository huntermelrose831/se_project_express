# WTWR Express Backend Deployment Guide

## Prerequisites

- DigitalOcean droplet with Ubuntu 20.04 or higher
- SSH access to your droplet
- Domain name (optional, can use IP address)
- GitHub repository with latest code

## Step 1: Prepare Your Local Project

✅ **Already completed:**

- Added `.env.example` file with configuration template
- Updated `config.js` to use environment variables
- Added `dotenv` support to `app.js`
- Created `ecosystem.config.js` for PM2
- Updated `.gitignore` to exclude `.env` and `*.log` files

### Install dotenv locally (if not already done):

```bash
cd /home/hunterm/Desktop/projects/wtwr/se_project_express
npm install dotenv
```

### Update package.json scripts (optional but recommended):

Add to the "scripts" section:

```json
"start": "node app.js",
"dev": "nodemon app.js",
"lint": "npx eslint .",
"pm2:start": "pm2 start ecosystem.config.js",
"pm2:stop": "pm2 stop ecosystem.config.js",
"pm2:restart": "pm2 restart ecosystem.config.js"
```

## Step 2: Push Code to GitHub

```bash
cd /home/hunterm/Desktop/projects/wtwr/se_project_express
git add .
git commit -m "Prepare backend for production deployment"
git push origin main
```

## Step 3: Set Up Your Droplet

### SSH into your droplet:

```bash
ssh root@YOUR_DROPLET_IP
# or
ssh your_username@YOUR_DROPLET_IP
```

### Update system packages:

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Node.js and npm (if not already installed):

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

### Install MongoDB (Option 1: Local MongoDB on Droplet):

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages and install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

**OR MongoDB Atlas (Option 2: Cloud Database - Recommended):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your droplet's IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/wtwr_db`)

### Install PM2 (Process Manager):

```bash
sudo npm install -g pm2
```

### Install Nginx (Reverse Proxy):

```bash
sudo apt install -y nginx
```

## Step 4: Clone Your Repository on Droplet

```bash
# Navigate to your preferred directory
cd /var/www
# or
cd /home/your_username

# Clone your repository
git clone https://github.com/huntermelrose831/se_project_express.git

# Navigate into the project
cd se_project_express
```

## Step 5: Configure Environment Variables

Create a `.env` file on your droplet:

```bash
cd /var/www/se_project_express
nano .env
```

Add the following (update with your values):

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wtwr_db

# JWT Configuration - CHANGE THIS TO A STRONG RANDOM STRING
JWT_SECRET=your-super-secret-random-string-change-this

# CORS Configuration - Your frontend URL
FRONTEND_URL=http://your-droplet-ip
# or if you have a domain:
# FRONTEND_URL=https://yourdomain.com
```

**Generate a strong JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save and exit (Ctrl+X, Y, Enter)

## Step 6: Install Dependencies

```bash
cd /var/www/se_project_express
npm install --production
```

## Step 7: Update CORS Settings

Make sure your `app.js` has proper CORS configuration. You may need to update it to:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
```

## Step 8: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/wtwr-api
```

Add the following configuration:

**For IP address access:**

```nginx
server {
    listen 80;
    server_name YOUR_DROPLET_IP;

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

**For domain name access:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # or yourdomain.com

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

Enable the site and restart Nginx:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/wtwr-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 9: Start Application with PM2

```bash
cd /var/www/se_project_express

# Start the app
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs wtwr-api

# Save PM2 process list (survives reboots)
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the instructions that appear (you'll need to run a command with sudo)
```

## Step 10: Configure Firewall

```bash
# Allow SSH (if not already allowed)
sudo ufw allow ssh

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS (for later SSL setup)
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 11: Set Up SSL with Certbot (Optional but Recommended)

**Only if you have a domain name:**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# or for subdomain:
# sudo certbot --nginx -d api.yourdomain.com

# Follow the prompts
# Certbot will automatically update your Nginx configuration

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL is set up, update your `.env` file:

```env
FRONTEND_URL=https://yourdomain.com
```

And restart PM2:

```bash
pm2 restart wtwr-api
```

## Step 12: Test Your Deployment

### Test from your droplet:

```bash
# Test if app is running
curl http://localhost:3001

# Test MongoDB connection
pm2 logs wtwr-api
```

### Test from your local machine:

```bash
# Replace with your droplet IP or domain
curl http://YOUR_DROPLET_IP
# or
curl https://api.yourdomain.com

# Test a specific endpoint
curl http://YOUR_DROPLET_IP/items
```

### Test in browser:

Visit: `http://YOUR_DROPLET_IP` or `https://api.yourdomain.com`

## Step 13: Update Frontend Configuration

On your local machine, update your React app:

**In `/home/hunterm/Desktop/projects/wtwr/se_project_react/src/utils/api.js` and `auth.js`:**

Change the base URL from:

```javascript
const baseUrl = "http://localhost:3001";
```

To:

```javascript
const baseUrl = "http://YOUR_DROPLET_IP";
// or
const baseUrl = "https://api.yourdomain.com";
```

Then rebuild and redeploy your frontend.

## Useful PM2 Commands

```bash
pm2 list                    # List all processes
pm2 logs wtwr-api          # View logs
pm2 restart wtwr-api       # Restart app
pm2 stop wtwr-api          # Stop app
pm2 delete wtwr-api        # Remove from PM2
pm2 monit                  # Monitor CPU/memory
```

## Updating Your App

When you make changes:

```bash
# On your local machine
git add .
git commit -m "Your changes"
git push origin main

# On your droplet
cd /var/www/se_project_express
git pull origin main
npm install --production  # If dependencies changed
pm2 restart wtwr-api
```

## Troubleshooting

### Check if app is running:

```bash
pm2 status
pm2 logs wtwr-api
```

### Check Nginx:

```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Check MongoDB (if local):

```bash
sudo systemctl status mongod
```

### Check if port 3001 is in use:

```bash
sudo lsof -i :3001
```

### View application logs:

```bash
cd /var/www/se_project_express
cat error.log
cat request.log
```

## Security Checklist

- ✅ Change default JWT_SECRET to a strong random string
- ✅ Use environment variables for sensitive data
- ✅ Enable firewall (ufw)
- ✅ Set up SSL/HTTPS with Certbot
- ✅ Keep system and packages updated
- ✅ Use strong passwords for MongoDB
- ✅ Configure proper CORS settings
- ✅ Don't commit .env to Git

## Quick Reference

**Your API will be available at:**

- HTTP: `http://YOUR_DROPLET_IP`
- HTTPS: `https://api.yourdomain.com` (after SSL setup)

**Backend endpoints:**

- `GET /items` - Get all clothing items
- `POST /signin` - User sign in
- `POST /signup` - User registration
- `GET /users/me` - Get current user
- etc.

Good luck with your deployment! 🚀
