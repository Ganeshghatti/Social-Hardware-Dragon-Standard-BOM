# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or use MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.local` file has been created. Make sure MongoDB is running:

**Option A: Local MongoDB**
```bash
# If MongoDB is installed via Homebrew (macOS)
brew services start mongodb-community

# Or start manually
mongod --dbpath ~/data/db
```

**Option B: MongoDB Atlas**
Update `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/robotic_arm_dashboard
```

### 3. Initialize Database
```bash
# Start the dev server
npm run dev

# In another terminal, initialize the database
curl http://localhost:3000/api/init
```

Or visit `http://localhost:3000/api/init` in your browser.

### 4. Login
Navigate to `http://localhost:3000` and login with:
- Email: `admin@roboticarm.com`
- Password: `admin123456`

## Default Credentials
**Please change these in production!**
- Email: admin@roboticarm.com
- Password: admin123456

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongosh` should connect
- Check the connection string in `.env.local`
- Try: `mongodb://localhost:27017` for local connections

### Port Already in Use
If port 3000 is taken, Next.js will auto-select another port (3001, 3002, etc.)

### Database Initialization Failed
- Ensure MongoDB is running
- Check `.env.local` has correct `MONGODB_URI`
- Try accessing `http://localhost:3000/api/init` manually

## Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Adding Your First Data

Once logged in:
1. Go to **Suppliers** → Add a supplier
2. Go to **Parts** → Add parts (link to suppliers)
3. Go to **BOMs** → Create a BOM with parts
4. Go to **Work Orders** → Create production orders

