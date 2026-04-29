# Mariane Shop — Boutique Vitrine avec Réservation

Site vitrine haut de gamme "Mobile First" avec système de réservation en ligne. Développé avec Next.js, Prisma (PostgreSQL) et déployé via Docker.

## Prérequis
- Docker & Docker Compose installés sur le VPS

## Déploiement sur VPS

### 1. Cloner le dépôt
```bash
git clone https://github.com/Christ-Fotso/mariane-shop.git
cd mariane-shop
```

### 2. Créer les secrets
```bash
chmod +x setup-secrets.sh
./setup-secrets.sh
```
Ce script crée le dossier `secrets/` avec un fichier par variable sensible. Ce dossier est **ignoré par Git** et ne sera jamais publié.

### 3. Lancer l'application
```bash
docker compose up -d --build
```

L'application est accessible sur le port **3000**.

## Structure des secrets (`./secrets/`)
```
secrets/
├── DATABASE_URL      # URL de connexion PostgreSQL
├── DB_PASSWORD       # Mot de passe PostgreSQL
├── JWT_SECRET        # Clé secrète JWT (auto-générée)
├── EMAIL_HOST        # Hôte SMTP
├── EMAIL_PORT        # Port SMTP
├── EMAIL_USER        # Adresse email SMTP
├── EMAIL_PASS        # Mot de passe SMTP
└── ADMIN_EMAIL       # Email de notification admin
```

## Développement local

```bash
cp .env.example .env
# Remplir .env avec vos valeurs

npm install
npx prisma db push
npm run dev
```

## Architecture
Clean Architecture : `src/core/domain` → `src/core/application` → `src/core/infrastructure` → `src/app`
