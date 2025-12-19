# PowerShell script to create .env.local file
# Run this script: .\setup-env.ps1

$envContent = @"
# Neon Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_7qrNFW6JeIYT@ep-round-scene-adwnlsiz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8
Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green

