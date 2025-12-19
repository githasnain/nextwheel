# Vercel Deployment Instructions

## ✅ Code Pushed to GitHub
Repository: https://github.com/githasnain/nextwheel.git

## 🚀 Deploy to Vercel

### Step 1: Import Project in Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: `githasnain/nextwheel`
4. Vercel will auto-detect Next.js

### Step 2: Configure Environment Variables
**CRITICAL**: Add this environment variable in Vercel:

**Variable Name**: `DATABASE_URL`

**Variable Value**: 
```
postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**How to add**:
1. In Vercel project settings → Environment Variables
2. Add new variable:
   - Key: `DATABASE_URL`
   - Value: (paste the connection string above)
   - Environment: Production, Preview, Development (select all)
3. Save

### Step 3: Run Database Migration
Before the app works, you need to run the migration on your Neon database:

```bash
psql 'postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f migrations/001_initial_schema.sql
```

Or use Neon's SQL editor:
1. Go to your Neon dashboard
2. Open SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Run the query

### Step 4: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be live!

## 📝 Important Notes

- **Same Database for Production**: The app uses the same Neon database for both development and production
- **No Local .env Needed**: Environment variables are set in Vercel
- **Migration Required**: Make sure to run the migration SQL before using the app
- **Auto-Deploy**: Future pushes to `main` branch will auto-deploy

## 🔍 Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Test admin panel login (default password: "admin")
3. Upload a file to test database connection
4. Check Neon dashboard to see data being stored

## 🐛 Troubleshooting

**Build Fails**:
- Check that `DATABASE_URL` is set in Vercel environment variables
- Verify Next.js version compatibility

**Database Connection Errors**:
- Ensure migration has been run
- Check Neon database is accessible
- Verify connection string is correct

**App Works but No Data**:
- Run the database migration
- Check browser console for API errors
- Verify API routes are working

