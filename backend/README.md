# TGV Max API Backend

API FastAPI pour rechercher des trajets TGV Max.

## 🚀 Déploiement

### Option 1: Railway (Recommandé)

1. **Créer un compte Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec votre compte GitHub

2. **Déployer depuis GitHub**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository `vercell-3`
   - Sélectionnez le dossier `backend` comme source

3. **Configuration**
   - Railway détectera automatiquement que c'est une application Python
   - Les variables d'environnement seront configurées automatiquement

4. **Variables d'environnement (optionnelles)**
   ```
   SNCF_API_URL=https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records
   API_LIMIT=100
   ```

### Option 2: Render

1. **Créer un compte Render**
   - Allez sur [render.com](https://render.com)
   - Connectez-vous avec votre compte GitHub

2. **Créer un nouveau Web Service**
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub
   - Sélectionnez le repository `vercell-3`

3. **Configuration**
   - **Name**: `tgvmax-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Variables d'environnement**
   ```
   SNCF_API_URL=https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records
   API_LIMIT=100
   ```

### Option 3: Heroku

1. **Installer Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Téléchargez depuis https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Déployer**
   ```bash
   cd backend
   heroku create tgvmax-api
   git add .
   git commit -m "Initial API deployment"
   git push heroku main
   ```

3. **Configuration**
   ```bash
   heroku config:set SNCF_API_URL=https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records
   heroku config:set API_LIMIT=100
   ```

## 📡 Endpoints API

### Base URL
```
https://your-api-domain.com
```

### Endpoints disponibles

#### 1. Informations générales
- `GET /` - Informations sur l'API
- `GET /health` - Vérification de l'état
- `GET /docs` - Documentation interactive (Swagger UI)
- `GET /redoc` - Documentation alternative

#### 2. Recherche de trajets
- `GET /api/trains/single` - Trajets aller simple
- `GET /api/trains/round-trip` - Trajets aller-retour
- `GET /api/trains/range` - Recherche par plage de dates
- `GET /api/stations` - Liste des gares disponibles

### Exemples d'utilisation

#### Trajet aller simple
```bash
curl "https://your-api-domain.com/api/trains/single?date=2025-01-27&origin=PARIS&destination=LYON"
```

#### Trajet aller-retour
```bash
curl "https://your-api-domain.com/api/trains/round-trip?depart_date=2025-01-27&return_date=2025-01-29&origin=PARIS"
```

#### Recherche par plage de dates
```bash
curl "https://your-api-domain.com/api/trains/range?start_date=2025-01-27&days=7&origin=PARIS"
```

## 🔧 Développement local

1. **Installer les dépendances**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Lancer le serveur**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Accéder à l'API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs

## 📊 Monitoring

### Railway
- Dashboard automatique avec métriques
- Logs en temps réel
- Monitoring des performances

### Render
- Dashboard avec métriques
- Logs accessibles
- Monitoring des déploiements

### Heroku
- Dashboard Heroku avec métriques
- Logs via `heroku logs --tail`
- Monitoring via add-ons

## 🔒 Sécurité

### Variables d'environnement sensibles
- Ne jamais commiter de clés API dans le code
- Utiliser les variables d'environnement de la plateforme
- Configurer CORS pour limiter l'accès

### CORS Configuration
En production, mettez à jour la configuration CORS dans `main.py` :
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 🚀 Mise à jour

### Railway
- Push automatique depuis GitHub
- Déploiement automatique à chaque commit

### Render
- Push automatique depuis GitHub
- Déploiement automatique à chaque commit

### Heroku
```bash
git add .
git commit -m "Update API"
git push heroku main
```

## 📞 Support

Pour toute question ou problème :
- GitHub Issues: [Repository](https://github.com/henznd/vercell-3)
- Email: baptiste.cuchet@gmail.com 