# Database Migration Instructions

## Using psql (Recommended)

Run the migration SQL file directly using psql:

```bash
psql 'postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f migrations/001_initial_schema.sql
```

Or if you have the connection string in an environment variable:

```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

## Using npm script

Make sure `.env.local` exists with:
```
DATABASE_URL=postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Then run:
```bash
npm run migrate
```

## Verify Migration

After running the migration, you can verify the tables were created by connecting to the database and running:

```sql
\dt
```

You should see:
- files
- entries
- winners
- settings
- removed_entries
- selected_winners
- admin_password

