# LearnFlow

LearnFlow is a comprehensive learning management and productivity platform built with SvelteKit, designed to provide an engaging and interactive educational experience.

## 🚀 Features

- **Course Management**
  - Interactive course content with markdown support
  - Course progress tracking
  - Lesson completion system
  - Dynamic course navigation

- **Learning Tools**
  - Calculator
  - Dictionary
  - Flashcards with spaced repetition
  - Note-taking with markdown support
  - Pomodoro timer
  - Task management
  - Chat support

- **Community Features**
  - Discussion forums with categories and topics
  - User groups and collaboration
  - Real-time activity feed
  - User profiles and progress tracking

- **Administrative Features**
  - User management
  - Course content management
  - Forum moderation
  - Analytics and statistics

## 🛠️ Technology Stack

- **Frontend:**
  - SvelteKit 2.x
  - TypeScript
  - TailwindCSS with Typography plugin
  - Chart.js for data visualization
  - Marked/Markdown-it for markdown rendering
  - FontAwesome icons

- **Backend:**
  - Firebase Authentication
  - PostgreSQL database
  - Node.js

- **Additional Tools:**
  - KaTeX for mathematical expressions
  - Highlight.js for code syntax highlighting
  - Splide.js for carousels

## 🚦 Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- Firebase account and project setup
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learnflow-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=LearnFlow

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Database Configuration
DATABASE_URL=your_database_url
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Admin Configuration
VITE_ADMIN_EMAILS=admin@example.com
VITE_CSRF_SECRET=your_csrf_secret

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key

# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

For production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🧪 Testing

To run tests:

```bash
npm run check
```

To watch for changes during development:

```bash
npm run check:watch
```

## 📁 Project Structure

```
learnflow-app/
├── src/
│   ├── lib/                 # Shared components and utilities
│   │   ├── components/     # Reusable UI components
│   │   ├── services/      # Business logic and API calls
│   │   ├── stores/        # Svelte stores for state management
│   │   └── utils/         # Utility functions
│   ├── routes/             # SvelteKit routes and pages
│   └── app.html           # HTML template
├── static/                 # Static assets
└── tests/                 # Test files
```

## 🔒 Security

- CSRF protection implemented
- Firebase Authentication
- Secure session management
- Input validation and sanitization
- Protected API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Initial work - [Your Name]

## 🙏 Acknowledgments

- SvelteKit team for the amazing framework
- Firebase team for authentication services
- All contributors and users of the platform

## 📚 Content Management

### Course Creation

Courses are managed through a file-based system in the `/static/content/courses/` directory:

1. Add course metadata to `index.json`:
```json
{
  "courses": [
    {
      "id": "course-id",
      "title": "Course Title",
      "type": "course",
      "slug": "course-slug",
      "description": "Course description",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "duration",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

2. Create course content in `course-id.md`:
```markdown
---
title: Course Title
description: Course description
tags: ["tag1", "tag2"]
difficulty: beginner
estimatedTime: duration
---

# Course Title

Course introduction...

## Module: Module Title

Module description...

### Lesson: Lesson Title

Lesson content...
```

The course system supports:
- Markdown content with frontmatter metadata
- Mathematical expressions via KaTeX
- Code syntax highlighting
- Module and lesson hierarchy
- Course tagging and categorization

## Course Summaries

Below is a structured summary of the MPSI - Mathématiques course, organized by domain:

### Raisonnement et vocabulaire ensembliste
Key Topics:
- Logique et raisonnement
- Ensembles, fonctions et relations binaires

Summary:
- Logique et raisonnement: assertions, modes de raisonnement formel
- Ensembles : inclusion, opérations (union, intersection, complémentaire)
- Fonctions et relations : définitions, injectivité, surjectivité, bijectivité

Exercises:
- Exercice 1.1 : Vrai/Faux sur les formules logiques
- Exercice 1.2 : Manipulation d'ensembles et relations

### Calculs algébriques
Key Topics:
- Sommations et produits

Summary:
- Sommations simples : séries géométriques, télescopiques
- Produits et factorisations remarquables

Exercises:
- Exercice 2.1 : Calcul de sommes géométriques
- Exercice 2.2 : Factorisation de polynômes

### Nombres complexes et trigonométrie
Key Topics:
- Nombres complexes
- Trigonométrie

Summary:
- Forme algébrique et trigonométrique des complexes
- Applications de la trigonométrie (identités, équations)

Exercises:
- Exercice 3.1 : Opérations sur nombres complexes
- Exercice 3.2 : Résolution d'équations trigonométriques

### Arithmétique
Key Topics:
- Arithmétique dans l'ensemble des entiers

Summary:
- Divisibilité, pgcd, algorithme d'Euclide
- Congruences et théorèmes classiques

Exercises:
- Exercice 4.1 : Calcul de pgcd
- Exercice 4.2 : Problèmes de congruences

### Structures algébriques usuelles
Key Topics:
- Groupes, anneaux, corps élémentaires

Summary:
- Définitions et exemples de structures algébriques
- Propriétés élémentaires (associativité, commutativité)

Exercises:
- Exercice 5.1 : Vérification des axiomes d'un groupe

### Polynômes et fractions rationnelles
Key Topics:
- Polynômes
- Fractions rationnelles

Summary:
- Degré, racines, factorisation
- Décomposition en éléments simples

Exercises:
- Exercice 6.1 : Factorisation polynomiale
- Exercice 6.2 : Décomposition de fractions rationnelles

### Espaces vectoriels et applications linéaires
Key Topics:
- Espaces vectoriels de dimension finie
- Applications linéaires, matrices, changement de base

Summary:
- Bases, dimension, sous-espaces affines
- Représentation matricielle, équivalence, similarité

Exercises:
- Exercice 7.1 : Calcul de dimension et base
- Exercice 7.2 : Passage d'une base à une autre

### Groupe symétrique et déterminant
Key Topics:
- Groupe symétrique
- Déterminant des matrices

Summary:
- Permutations, signature
- Propriétés du déterminant et calcul

Exercises:
- Exercice 8.1 : Calcul de déterminant par développement
- Exercice 8.2 : Signature d'une permutation

### Espaces préhilbertiens réels
Key Topics:
- Produit scalaire, normes
- Orthogonalité, projections

Summary:
- Définition d'un espace préhilbertien réel
- Inégalités de Cauchy-Schwarz et de Minkowski

Exercises:
- Exercice 9.1 : Calcul de produit scalaire
- Exercice 9.2 : Construction de projections orthogonales
