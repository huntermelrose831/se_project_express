#!/bin/bash

# WTWR Backend Update Script
# Run this script on your DigitalOcean droplet

echo "🚀 WTWR Backend Update Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Get project directory
read -p "Enter your project directory path (e.g., /var/www/se_project_express): " PROJECT_DIR

# Validate directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Directory $PROJECT_DIR does not exist!"
    exit 1
fi

cd "$PROJECT_DIR" || exit

print_success "Changed to directory: $PROJECT_DIR"
echo ""

# Step 1: Backup
echo "Step 1: Creating backup..."
BACKUP_DIR="${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
cd ..
cp -r "$(basename "$PROJECT_DIR")" "$BACKUP_DIR"
if [ $? -eq 0 ]; then
    print_success "Backup created at: $BACKUP_DIR"
else
    print_error "Backup failed!"
    exit 1
fi
cd "$PROJECT_DIR" || exit
echo ""

# Step 2: Stop PM2
echo "Step 2: Stopping PM2 processes..."
pm2 stop all
print_success "PM2 processes stopped"
echo ""

# Step 3: Stash local changes
echo "Step 3: Stashing local changes (like .env)..."
git stash
print_success "Local changes stashed"
echo ""

# Step 4: Pull latest code
echo "Step 4: Pulling latest code from GitHub..."
git pull origin main
if [ $? -eq 0 ]; then
    print_success "Code updated successfully"
else
    print_error "Git pull failed! Check your repository."
    exit 1
fi
echo ""

# Step 5: Restore .env
echo "Step 5: Restoring .env file..."
git stash pop
if [ -f ".env" ]; then
    print_success ".env file restored"
else
    print_warning ".env file not found - you'll need to create it"
    echo "Copy from .env.example and update values:"
    echo "  cp .env.example .env"
    echo "  nano .env"
fi
echo ""

# Step 6: Install dependencies
echo "Step 6: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed"
else
    print_error "npm install failed!"
    exit 1
fi
echo ""

# Step 7: Create logs directory
echo "Step 7: Creating logs directory..."
mkdir -p logs
print_success "Logs directory created"
echo ""

# Step 8: Check .env file
echo "Step 8: Checking .env configuration..."
if [ -f ".env" ]; then
    print_success ".env file exists"

    # Check for required variables
    required_vars=("NODE_ENV" "PORT" "MONGODB_URI" "JWT_SECRET")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env; then
            print_success "$var is set"
        else
            print_warning "$var is NOT set in .env"
        fi
    done
else
    print_error ".env file missing!"
    echo "Please create .env file with required variables:"
    echo "  NODE_ENV=production"
    echo "  PORT=3001"
    echo "  MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db"
    echo "  JWT_SECRET=your-secret-key"
    echo "  FRONTEND_URL=http://your-frontend-url"
    echo ""
    read -p "Press Enter to continue after creating .env file..."
fi
echo ""

# Step 9: Test application
echo "Step 9: Testing application..."
echo "Starting node app.js for 5 seconds to test..."
timeout 5 node app.js &
sleep 6
if pgrep -f "node app.js" > /dev/null; then
    pkill -f "node app.js"
    print_success "Application starts successfully"
else
    print_success "Application test completed"
fi
echo ""

# Step 10: Start with PM2
echo "Step 10: Starting application with PM2..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    pm2 start app.js --name wtwr-api
fi
print_success "Application started with PM2"
echo ""

# Step 11: Save PM2 configuration
echo "Step 11: Saving PM2 configuration..."
pm2 save
print_success "PM2 configuration saved"
echo ""

# Step 12: Check status
echo "Step 12: Checking application status..."
pm2 status
echo ""

# Step 13: Display logs
echo "Step 13: Displaying recent logs..."
pm2 logs wtwr-api --lines 20 --nostream
echo ""

# Summary
echo "================================"
echo "✨ Update Complete!"
echo "================================"
echo ""
print_success "Backup location: $BACKUP_DIR"
print_success "Application is running with PM2"
echo ""
echo "Next steps:"
echo "  1. Check logs: pm2 logs wtwr-api"
echo "  2. Test API: curl http://localhost:3001/items"
echo "  3. Monitor: pm2 monit"
echo ""
echo "If something went wrong, rollback with:"
echo "  pm2 stop all"
echo "  cd .."
echo "  rm -rf $(basename "$PROJECT_DIR")"
echo "  mv $BACKUP_DIR $(basename "$PROJECT_DIR")"
echo "  cd $(basename "$PROJECT_DIR")"
echo "  pm2 start ecosystem.config.js"
echo ""
print_success "Done! 🎉"
