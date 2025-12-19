# Wheel of Names - Full-Stack Next.js App

A full-stack spin wheel application built with Next.js 14, React, and Neon PostgreSQL database.

## 🚀 Features

- **Spin Wheel**: Interactive wheel to randomly select winners
- **Admin Panel**: Upload Excel files, manage entries, configure spins
- **Database Integration**: All data stored in Neon PostgreSQL
- **Fixed Spins**: Configure specific winners for specific spins
- **Winners Tracking**: Complete winners ladder with history
- **Mobile Optimized**: Responsive design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL (Serverless)
- **Styling**: CSS with mobile optimizations
- **Deployment**: Vercel

## 📦 Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL client (for migrations) or Neon SQL Editor

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/githasnain/nextwheel.git
   cd nextwheel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   
   Or run the setup script:
   ```powershell
   .\setup-env.ps1
   ```

4. **Run database migration**
   
   Using psql:
   ```bash
   psql 'postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f migrations/001_initial_schema.sql
   ```
   
   Or using Neon SQL Editor:
   - Go to Neon dashboard
   - Open SQL Editor
   - Copy contents of `migrations/001_initial_schema.sql`
   - Run the query

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Visit http://localhost:3000

## 🗄️ Database Schema

The app uses the following tables:
- `files` - Uploaded Excel files
- `entries` - Normalized entries from files
- `winners` - Winners list with spin numbers
- `settings` - Application settings
- `removed_entries` - Tracked removed entries
- `selected_winners` - Fixed winners for specific spins
- `admin_password` - Admin password storage

## 🔐 Default Credentials

- **Admin Password**: `admin` (change after first login)

## 📡 API Routes

- `GET/POST /api/files` - File management
- `GET/DELETE/PATCH /api/files/[id]` - Individual file operations
- `GET /api/entries` - Get entries with filtering
- `GET/POST/DELETE /api/winners` - Winners management
- `GET/POST /api/settings` - Settings management
- `POST/PATCH /api/admin/password` - Password operations
- `GET/POST/DELETE /api/selected-winners` - Fixed winners

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Import to Vercel**
   - Go to https://vercel.com
   - Import project from GitHub: `githasnain/nextwheel`
3. **Add Environment Variable**
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL` with your Neon connection string
   - Apply to: Production, Preview, Development
4. **Deploy**
   - Vercel will auto-detect Next.js and deploy

See `VERCEL_DEPLOY.md` for detailed instructions.

## 📝 Project Structure

```
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main page
├── components/       # React components
├── lib/              # Utilities
│   ├── api.ts        # API client
│   └── db.ts         # Database connection
├── migrations/       # Database migrations
├── src/              # Original React app
└── utils/            # Helper functions
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migration
- `npm run lint` - Run ESLint

## 📚 Documentation

- `PROJECT_STATUS.md` - Detailed project status
- `SETUP_INSTRUCTIONS.md` - Quick setup guide
- `VERCEL_DEPLOY.md` - Deployment instructions
- `MIGRATION_SUMMARY.md` - Migration details

## 🐛 Troubleshooting

**Database Connection Issues**:
- Verify `DATABASE_URL` is set correctly
- Check Neon database is accessible
- Ensure migration has been run

**Build Errors**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**API Errors**:
- Check browser console for errors
- Verify API routes are accessible
- Check database connection

## 📄 License

Private project

## 👤 Author

Hasnain Haider

---

**Repository**: https://github.com/githasnain/nextwheel.git
