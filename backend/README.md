# FleetTrack Backend API

FleetTrack est une application de gestion de flotte permettant de suivre les trajets, le carburant, le kilométrage et la maintenance des camions. Elle offre un espace Admin pour la gestion et un espace Chauffeur pour les missions et mises à jour en temps réel.

## Technologies

- **Node.js** & **Express.js** - Framework backend
- **MongoDB** & **Mongoose** - Base de données
- **dotenv** - Gestion des variables d'environnement

## Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd FleetTrack/backend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis éditer le fichier `.env` avec vos configurations.

4. Lancer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Configuration

Créer un fichier `.env` à la racine avec les variables suivantes :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/FleetTrack_DB
```

## Structure du projet

```
backend/
├── src/
│   ├── app.js              # Configuration Express
│   ├── config/             # Configurations (DB, etc.)
│   ├── controllers/        # Logique métier
│   ├── middlewares/        # Middlewares personnalisés
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── utils/              # Fonctions utilitaires
│   └── validators/         # Validation des données
├── tests/                  # Tests unitaires
├── server.js               # Point d'entrée
├── package.json
└── .env
```

## Scripts 

- `npm start` - Démarrer le serveur en mode production
- `npm run dev` - Démarrer le serveur en mode développement avec nodemon
