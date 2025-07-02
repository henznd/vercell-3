#!/bin/bash

# Script de déploiement pour l'API TGV Max
# Usage: ./deploy.sh [railway|render|heroku]

set -e

echo "🚀 Déploiement de l'API TGV Max..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "main.py" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier backend/"
    exit 1
fi

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if [ ! -f "requirements.txt" ]; then
    echo "❌ Erreur: requirements.txt manquant"
    exit 1
fi

# Installer les dépendances localement pour tester
echo "🔧 Installation des dépendances..."
pip install -r requirements.txt

# Tester l'API localement
echo "🧪 Test de l'API localement..."
python -c "
import uvicorn
from main import app
print('✅ API configurée correctement')
"

# Déploiement selon la plateforme
case "${1:-railway}" in
    "railway")
        echo "🚂 Déploiement sur Railway..."
        echo "📋 Instructions:"
        echo "1. Allez sur https://railway.app"
        echo "2. Créez un nouveau projet"
        echo "3. Sélectionnez 'Deploy from GitHub repo'"
        echo "4. Choisissez votre repository: henznd/vercell-3"
        echo "5. Sélectionnez le dossier 'backend'"
        echo "6. Railway détectera automatiquement la configuration"
        ;;
    "render")
        echo "🎨 Déploiement sur Render..."
        echo "📋 Instructions:"
        echo "1. Allez sur https://render.com"
        echo "2. Créez un nouveau Web Service"
        echo "3. Connectez votre repository GitHub"
        echo "4. Configuration:"
        echo "   - Root Directory: backend"
        echo "   - Runtime: Python 3"
        echo "   - Build Command: pip install -r requirements.txt"
        echo "   - Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
        ;;
    "heroku")
        echo "⚡ Déploiement sur Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI non installé"
            echo "📥 Installez-le: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "🔐 Connexion à Heroku..."
        heroku login
        
        echo "🏗️ Création de l'application Heroku..."
        heroku create tgvmax-api-$(date +%s)
        
        echo "📤 Déploiement..."
        git add .
        git commit -m "Deploy API to Heroku"
        git push heroku main
        
        echo "🔧 Configuration des variables d'environnement..."
        heroku config:set SNCF_API_URL="https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records"
        heroku config:set API_LIMIT="100"
        
        echo "🌐 Ouverture de l'application..."
        heroku open
        ;;
    *)
        echo "❌ Plateforme non reconnue: $1"
        echo "📋 Plateformes supportées: railway, render, heroku"
        exit 1
        ;;
esac

echo "✅ Déploiement configuré!"
echo "📚 Documentation: https://github.com/henznd/vercell-3"
echo "📧 Support: baptiste.cuchet@gmail.com" 