# PowerShell helper script to initialize PostgreSQL database and run migrations
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " To-Do App Database & Migration Helper  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Check if PostgreSQL server is running on port 5432
Write-Host "`n[1/3] Checking PostgreSQL connection on localhost:5432..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue

if (-not $connection.TcpTestSucceeded) {
    Write-Host "`n[ERROR] PostgreSQL server is NOT running on port 5432." -ForegroundColor Red
    Write-Host "Please start the PostgreSQL Windows service:" -ForegroundColor Yellow
    Write-Host "  1. Press Win + R, type 'services.msc' and press Enter."
    Write-Host "  2. Locate 'postgresql-x64-18' (or your PostgreSQL version)."
    Write-Host "  3. Right-click it and select 'Start'."
    Write-Host "  4. Then re-run this script."
    exit 1
}

Write-Host "[OK] PostgreSQL server is running!" -ForegroundColor Green

# 2. Check & Create Database todo_db
Write-Host "`n[2/3] Checking database 'todo_db'..." -ForegroundColor Yellow
$postgresBin = "C:\Program Files\PostgreSQL\18\bin"
if (Test-Path "$postgresBin\createdb.exe") {
    $env:PGPASSWORD = "password" # matches default in .env
    & "$postgresBin\createdb.exe" -U postgres -h localhost -p 5432 todo_db 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database 'todo_db' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Database 'todo_db' already exists or ready." -ForegroundColor Gray
    }
}

# 3. Run Django Migrations
Write-Host "`n[3/3] Running Django migrations..." -ForegroundColor Yellow
& .\venv\Scripts\python.exe manage.py migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Migrations completed successfully! Your To-Do app database is ready." -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Migration failed. Check your password in .env" -ForegroundColor Red
}
