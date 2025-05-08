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
