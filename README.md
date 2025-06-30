# TGV Max Finder 🚄

Une application moderne pour trouver vos trajets TGV Max en quelques clics. Développée avec Next.js et FastAPI.

## 🚀 Fonctionnalités

- **Recherche simple** : Trouvez des trajets aller simple depuis une gare
- **Recherche aller-retour** : Découvrez des destinations avec trajets retour
- **Recherche par plage de dates** : Explorez les disponibilités sur plusieurs jours
- **Interface moderne** : Design responsive avec Tailwind CSS
- **API SNCF** : Données en temps réel via l'API officielle SNCF

## 🛠️ Technologies

### Frontend
- **Next.js 15** - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React 19** - Bibliothèque UI

### Backend
- **FastAPI** - Framework Python moderne
- **Uvicorn** - Serveur ASGI
- **Pandas** - Manipulation de données
- **Requests** - Client HTTP

## 📦 Installation

### Prérequis
- Node.js 18+ 
- Python 3.9+
- npm ou yarn

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🚀 Démarrage rapide

1. **Cloner le repository**
```bash
git clone https://github.com/henznd/vercell2.git
cd tgvmax-vercel
```

2. **Installer les dépendances frontend**
```bash
cd frontend
npm install
```

3. **Installer les dépendances backend**
```bash
cd ../backend
pip install fastapi uvicorn pandas requests
```

4. **Lancer le backend**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Lancer le frontend** (dans un nouveau terminal)
```bash
cd frontend
npm run dev
```

6. **Accéder à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000

## 📡 API Endpoints

### Trajets aller simple
```
GET /api/trains/single?date=2025-06-27&origin=PARIS&destination=LYON
```

### Trajets aller-retour
```
GET /api/trains/round-trip?depart_date=2025-06-27&return_date=2025-06-29&origin=PARIS
```

### Recherche par plage de dates
```
GET /api/trains/range?start_date=2025-06-27&days=7&origin=PARIS
```

## 🎨 Interface

L'application propose une interface moderne avec :
- **Hero section** avec dégradé de couleurs
- **Formulaire de recherche** intuitif
- **Cartes de résultats** avec animations
- **Design responsive** pour mobile et desktop
- **Mode sombre** (en développement)

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` dans le dossier backend :

```env
SNCF_API_URL=https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records
API_LIMIT=100
```

## 📱 Fonctionnalités avancées

- **Filtres temporels** : Recherche par créneaux horaires
- **Paramètres avancés** : Options de recherche personnalisées
- **Favoris** : Sauvegarde des trajets préférés (en développement)
- **Statistiques** : Analyses des trajets (en développement)
- **Carte interactive** : Visualisation géographique (en développement)

## 🚀 Déploiement

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Railway/Render (Backend)
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développeur

**Baptiste Cuchet** 🚀

- GitHub : [@baptistecuchet](https://github.com/baptistecuchet)
- Email : baptiste.cuchet@example.com

## 🙏 Remerciements

- **SNCF** pour l'API officielle des données TGV Max
- **Vercel** pour l'hébergement et Next.js
- **Tailwind CSS** pour le framework de design
- **FastAPI** pour le backend moderne

---

⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez ! 