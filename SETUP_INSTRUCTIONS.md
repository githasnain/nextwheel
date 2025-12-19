# Quick Setup Instructions

## Step 1: Create .env.local File

**Option A: Using PowerShell (Windows)**
```powershell
.\setup-env.ps1
```

**Option B: Manual Creation**
Create a file named `.env.local` in the root directory with:
```
DATABASE_URL=postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Option C: Copy from example**
```bash
cp .env.example .env.local
```

## Step 2: Run Database Migration

```bash
psql 'postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f migrations/001_initial_schema.sql
```

## Step 3: Install Dependencies (if not done)

```bash
npm install
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 5: Deploy to Vercel

1. Push to GitHub
2. In Vercel dashboard, add environment variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
3. Deploy

## ✅ Everything is Ready!

All code is complete. You just need to:
1. Create `.env.local` (2 minutes)
2. Run migration (1 minute)
3. Test locally (optional)
4. Deploy (automatic via Vercel)

