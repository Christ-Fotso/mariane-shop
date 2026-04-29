#!/bin/bash
# =============================================================
# setup-secrets.sh — Initialize Docker Secrets files
# Run this script ONCE on your VPS before the first deployment.
# Each secret is stored as a plain text file in ./secrets/
# The ./secrets/ folder is in .gitignore and NEVER pushed to Git.
# =============================================================

set -e

SECRETS_DIR="./secrets"
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

echo "⚙️  Setting up Docker Secrets in $SECRETS_DIR/"
echo ""

prompt_secret() {
  local name="$1"
  local description="$2"
  local default_val="$3"

  read -rp "  $description [$name]: " value
  if [ -z "$value" ] && [ -n "$default_val" ]; then
    value="$default_val"
  fi
  printf "%s" "$value" > "$SECRETS_DIR/$name"
  chmod 600 "$SECRETS_DIR/$name"
  echo "  ✅ $name saved"
}

echo "📦 Database Configuration"
prompt_secret "DB_PASSWORD"    "PostgreSQL password (strong password recommended)" "changeme_$(openssl rand -hex 8)"
# DATABASE_URL uses the same password — auto-generate it
DB_PASS=$(cat "$SECRETS_DIR/DB_PASSWORD")
printf "postgresql://postgres:%s@db:5432/maris_shop?schema=public" "$DB_PASS" > "$SECRETS_DIR/DATABASE_URL"
chmod 600 "$SECRETS_DIR/DATABASE_URL"
echo "  ✅ DATABASE_URL saved (auto-generated from DB_PASSWORD)"

echo ""
echo "🔑 JWT Configuration"
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
printf "%s" "$JWT_SECRET" > "$SECRETS_DIR/JWT_SECRET"
chmod 600 "$SECRETS_DIR/JWT_SECRET"
echo "  ✅ JWT_SECRET auto-generated (strong random key)"

echo ""
echo "📧 Email (SMTP) Configuration"
prompt_secret "EMAIL_HOST"  "SMTP Host (ex: smtp.gmail.com)" "smtp.gmail.com"
prompt_secret "EMAIL_PORT"  "SMTP Port (587 for TLS, 465 for SSL)" "587"
prompt_secret "EMAIL_USER"  "SMTP Email address (ex: you@gmail.com)" ""
prompt_secret "EMAIL_PASS"  "SMTP App Password (NOT your Gmail password)" ""
prompt_secret "ADMIN_EMAIL" "Admin email to receive reservation notifications" ""

echo ""
echo "🎉 All secrets created in $SECRETS_DIR/"
echo "   → Run 'docker compose up -d --build' to start the application."
