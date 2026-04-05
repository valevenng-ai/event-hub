# EventHub — Backend Node.js / Express

Backend alternatif à Django/DRF, implémentant la même API REST pour EventHub.

## Stack

| Composant | Technologie |
|-----------|------------|
| Framework | Express 4 |
| ORM | Sequelize 6 |
| Base de données | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Hash mot de passe | bcryptjs |

## Installation

```bash
cd backend-node
cp .env.example .env
npm install
npm start
```

## Endpoints

### Auth
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/auth/login/ | Connexion → token + rôle |
| POST | /api/auth/register/ | Création d'utilisateur |

### Events
| Méthode | URL | Accès |
|---------|-----|-------|
| GET | /api/events/ | Tous |
| POST | /api/events/ | Admin |
| GET | /api/events/:id/ | Tous |
| PUT/PATCH | /api/events/:id/ | Admin |
| DELETE | /api/events/:id/ | Admin |

**Filtres** : `?status=upcoming`, `?date=2024-01-01`

### Participants
| Méthode | URL | Accès |
|---------|-----|-------|
| GET | /api/participants/ | Tous |
| POST | /api/participants/ | Admin |
| GET | /api/participants/:id/ | Tous |
| PUT/PATCH | /api/participants/:id/ | Admin |
| DELETE | /api/participants/:id/ | Admin |

**Filtres** : `?search=nom_ou_email`

### Registrations
| Méthode | URL | Accès |
|---------|-----|-------|
| GET | /api/registrations/ | Tous |
| POST | /api/registrations/ | Admin |
| GET | /api/registrations/:id/ | Tous |
| DELETE | /api/registrations/:id/ | Admin |

## Structure

```
src/
├── server.js           # Point d'entrée, connexion DB
├── app.js              # Express app, middlewares, routes
├── config/
│   └── database.js     # Sequelize config
├── models/
│   ├── index.js        # Associations entre modèles
│   ├── User.js
│   ├── Event.js
│   ├── Participant.js
│   └── Registration.js
├── middleware/
│   └── auth.js         # JWT authenticate, isAdmin
├── controllers/
│   ├── events.js
│   ├── participants.js
│   └── registrations.js
└── routes/
    ├── auth.js
    ├── events.js
    ├── participants.js
    └── registrations.js
```

## Compatibilité avec le frontend React

Le header d'auth attendu est identique à Django DRF :
```
Authorization: Token <jwt_token>
```
