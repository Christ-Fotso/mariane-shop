#!/bin/bash
# =============================================================
# deploy.sh — Build, push to Docker Hub & deploy on VPS
# Run this script on your VPS after cloning the repo.
# =============================================================

set -e

DOCKER_USERNAME="christfotso"
IMAGE_NAME="mariane-shop"
FULL_IMAGE="$DOCKER_USERNAME/$IMAGE_NAME"
TAG="${1:-latest}"

echo ""
echo "🚀 Déploiement de $FULL_IMAGE:$TAG"
echo ""

# 1. Build the image
echo "📦 Build de l'image Docker..."
docker build -t "$FULL_IMAGE:$TAG" .
docker tag "$FULL_IMAGE:$TAG" "$FULL_IMAGE:latest"

# 2. Push to Docker Hub
echo "⬆️  Push vers Docker Hub..."
docker push "$FULL_IMAGE:$TAG"
docker push "$FULL_IMAGE:latest"
echo "✅ Image disponible sur: https://hub.docker.com/r/$FULL_IMAGE"

# 3. Run setup-secrets if secrets folder doesn't exist
if [ ! -d "./secrets" ] || [ -z "$(ls -A ./secrets 2>/dev/null | grep -v .gitkeep)" ]; then
  echo ""
  echo "⚙️  Création des secrets (première installation)..."
  chmod +x setup-secrets.sh
  ./setup-secrets.sh
fi

# 4. Start / restart the app
echo ""
echo "🔄 Démarrage des conteneurs..."
docker compose pull
docker compose up -d --build

echo ""
echo "🎉 Application déployée avec succès !"
echo "   → Accessible sur http://$(hostname -I | awk '{print $1}'):3000"
