# FleetTrack

FleetTrack est une application complète de gestion de flotte de transport, conçue pour faciliter le suivi des véhicules, des chauffeurs, des trajets et de la maintenance. Elle offre une interface d'administration puissante et un portail dédié aux chauffeurs.

## Fonctionnalités

### Espace Administrateur

- **Tableau de bord (Overview)** : Vue d'ensemble des statistiques de la flotte.
- **Gestion des Véhicules** :
  - **Camions** : Ajout, modification et suivi des camions.
  - **Remorques** : Gestion du parc de remorques.
- **Gestion des Pneus** : Suivi de l'état des pneus, assignation aux véhicules et historique.
- **Gestion des Trajets** : Planification et suivi des missions de transport.
- **Gestion des Chauffeurs** : Administration des comptes chauffeurs et de leurs informations.
- **Maintenance** : Suivi des entretiens préventifs et correctifs.

### Espace Chauffeur

- **Tableau de bord** : Informations essentielles pour le chauffeur.
- **Mes Trajets** : Consultation des missions assignées et mise à jour de l'état des trajets.

## Technologies Utilisées

### Backend

- **Node.js** & **Express.js** : Serveur API RESTful.
- **MongoDB** & **Mongoose** : Base de données NoSQL et ODM.
- **JWT (JSON Web Tokens)** : Authentification sécurisée.
- **Bcryptjs** : Hachage des mots de passe.
- **Jest** & **Supertest** : Tests unitaires et d'intégration.

### Frontend

- **React** : Bibliothèque UI.
- **Vite** : Build tool rapide.
- **Tailwind CSS** : Framework CSS utilitaire pour le design.
- **React Router DOM** : Gestion du routage.
- **Axios** : Requêtes HTTP.
- **Lucide React** : Icônes.

### DevOps

- **Docker** & **Docker Compose** : Conteneurisation et orchestration des services.

## Prérequis

- [Node.js](https://nodejs.org/) (v18+ recommandé)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (pour l'installation via Docker)
- [MongoDB](https://www.mongodb.com/) (si installation manuelle sans Docker)

## Installation et Démarrage

### Option 1 : Via Docker Compose (Recommandé)

C'est la méthode la plus simple pour lancer l'application complète (Base de données + Backend + Frontend).

1. **Cloner le projet**

   ```bash
   git clone <votre-repo-url>
   cd FleetTrack
   ```

2. **Lancer les conteneurs**

   ```bash
   docker-compose up --build
   ```

   L'application sera accessible aux adresses suivantes :

   - **Frontend** : http://localhost:5173
   - **Backend API** : http://localhost:5000
   - **MongoDB** : localhost:27017

### Option 2 : Installation Manuelle

#### 1. Configuration du Backend

1. Accédez au dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du dossier `backend` (copiez `.env.example` si disponible) :
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fleet-track
   JWT_SECRET=votre_secret_jwt_tres_securise
   FRONTEND_URL=http://localhost:5173
   ```
4. Initialisez la base de données (Optionnel - Création d'un admin) :
   ```bash
   npm run seed:admin
   ```
5. Lancez le serveur :
   ```bash
   npm run dev
   ```

#### 2. Configuration du Frontend

1. Accédez au dossier frontend :
   ```bash
   cd ../frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du dossier `frontend` :
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Lancez l'application :
   ```bash
   npm run dev
   ```

## Structure du Projet

```
FleetTrack/
├── backend/                # Code source du serveur Node.js
│   ├── src/
│   │   ├── config/         # Configuration DB, etc.
│   │   ├── controllers/    # Logique métier
│   │   ├── middlewares/    # Middlewares Express (Auth, Erreurs...)
│   │   ├── models/         # Modèles Mongoose (User, Vehicle, Trip...)
│   │   ├── routes/         # Définition des routes API
│   │   ├── seeders/        # Scripts d'initialisation de données
│   │   ├── utils/          # Utilitaires (JWT, Helpers)
│   │   ├── validators/     # Validation des données entrantes
│   │   └── app.js          # Point d'entrée de l'application Express
│   ├── tests/              # Tests automatisés
│   ├── Dockerfile
│   └── server.js           # Script de démarrage du serveur
│
├── frontend/               # Code source de l'application React
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Composants réutilisables (Modals, Sidebar...)
│   │   ├── context/        # Contextes React (AuthContext)
│   │   ├── layouts/        # Mises en page (Admin, Driver)
│   │   ├── pages/          # Pages de l'application
│   │   ├── routes/         # Configuration du routage
│   │   ├── services/       # Services API (Axios calls)
│   │   └── App.jsx         # Composant racine
│   ├── Dockerfile
│   └── vite.config.js
│
└── docker-compose.yml      # Orchestration des conteneurs
```

## API Endpoints Principaux

L'API est accessible via `/api`. Voici les groupes de routes principaux :

- **Auth** : `/api/auth` (Login, Register, Profile)
- **Utilisateurs** : `/api/users` (CRUD Utilisateurs)
- **Véhicules** : `/api/vehicles` (CRUD Camions et Remorques)
- **Trajets** : `/api/trips` (Gestion des missions)
- **Pneus** : `/api/tires` (Gestion du stock et assignation)

## Tests

Le backend dispose de tests unitaires et d'intégration avec Jest.

Pour lancer les tests :

```bash
cd backend
npm test
```

## Licence

Ce projet est sous licence ISC.
