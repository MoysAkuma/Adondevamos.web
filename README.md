# 🌍 Adondevamos.web

> **AdondeVamos.net**

A collaborative trip planning platform that helps groups decide on destinations through shared recommendations and democratic voting.

[![Version](https://img.shields.io/badge/version-0.0.Alpha-orange)](https://github.com/MoysAkuma/Adondevamos.web)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Material--UI](https://img.shields.io/badge/Material--UI-7.0.1-blue)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Application Pages](#application-pages)
- [Authentication & Authorization](#authentication--authorization)
- [API Configuration](#api-configuration)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## 🎯 Overview

**Adondevamos.web** is a React-based frontend application that enables users to:
- Create and manage trips
- Share place recommendations within trip groups
- Collaborate with team members on trip planning
- Vote democratically on suggested destinations
- Discover popular places through community rankings

The platform solves the common problem: *"Where should we go?"* by providing a structured, collaborative decision-making tool for travel planning.

---

## ✨ Features

### 🗺️ Trip Management
- **Create Trips**: Set up new trip itineraries with details and destinations
- **Edit Trips**: Modify trip information and itinerary
- **View Trips**: Browse trips with detailed information and member lists
- **Search Trips**: Find trips by name, location, or other criteria

### 📍 Place Recommendations
- **Create Places**: Add new places with detailed information:
  - Name, description, and location (with map picker)
  - Multiple images upload with gallery management
  - Facilities and amenities tagging
  - Geographic categorization (country, state, city)
- **Edit Places**: Update place information and photos
- **View Places**: Explore places with image carousel and full details
- **Search Places**: Filter places by location, facilities, and other criteria

### 👥 Collaboration
- **Member Management**: Add collaborators to trips
- **Member List**: View all trip participants
- **Voting System**: Democratic voting on destinations
- **Activity Tracking**: Monitor member contributions

### 🔐 Authentication & Security
- **User Registration & Login**: Secure account management
- **Role-Based Access Control (RBAC)**:
  - **Admin**: User and content management
  - **Moderator**: Content moderation
  - **User**: Basic trip and place creation
- **Session Management**:
  - Automatic token refresh (15-minute intervals)
  - Idle timeout (30 minutes with 5-minute warning)
  - Cross-tab synchronization
  - Activity tracking
- **Protected Routes**: Role/permission-based access control
- **Session Warning Dialog**: Alerts before automatic logout

### ⚙️ Admin Management
- **Countries Manager**: Add/edit/delete countries
- **States Manager**: Manage states/provinces
- **Cities Manager**: Maintain city database
- **Facilities Manager**: Configure available amenities
- **User Management**: Admin control panel for user accounts

### 🎨 User Experience
- **Responsive Design**: Mobile-friendly interface
- **Material-UI Components**: Modern, consistent UI/UX
- **Custom Theming**: Retro pixel-art style with "Press Start 2P" font
- **Image Management**: Gallery upload with preview and carousel
- **Interactive Maps**: Location picker and visualization
- **FAQ Section**: Comprehensive help documentation
- **User Profiles**: Personal account management

---

## 🛠️ Tech Stack

### Core Technologies
- **React** 19.1.0 - UI library
- **React Router DOM** 6.2.1 - Client-side routing
- **React Scripts** 5.0.1 - Build tooling (Create React App)

### UI Framework
- **Material-UI (MUI)** 7.0.1 - Component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon set
  - `@mui/system` - Styling system
- **Emotion** 11.14.0 - CSS-in-JS styling

### API & State Management
- **Axios** 1.8.4 - HTTP client
- **React Context API** - Global state management (AuthContext)

### Testing
- **Testing Library** - React testing utilities
  - `@testing-library/react` 16.2.0
  - `@testing-library/jest-dom` 6.6.3
  - `@testing-library/user-event` 13.5.0
  - `@testing-library/dom` 10.4.0
---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher recommended) - [Download](https://nodejs.org/)
- **npm** (v6.x or higher) or **yarn** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MoysAkuma/Adondevamos.web.git
   cd Adondevamos.web/adondevamosweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the `adondevamosweb` directory:

```env
# Environment
REACT_APP_ENV=development

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/v1
```

For production, set:
```env
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://your-api-domain.com/v1
```

### Running the Application

**Development Mode** (with hot reload):
```bash
npm start
# or
yarn start
```
The app will open at [http://localhost:3000](http://localhost:3000)

**Production Build**:
```bash
npm run build
# or
yarn build
```
Generates optimized build in the `build/` directory

**Run Tests**:
```bash
npm test
# or
yarn test
```

---

## 📁 Project Structure

```
adondevamosweb/
├── public/                      # Static files
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── App.js                  # Main application component
│   ├── index.tsx               # Application entry point
│   ├── index.css               # Global styles
│   ├── Component/              # Reusable components
│   │   ├── Catalogues/         # Country, State, City selects
│   │   ├── Commons/            # Shared components
│   │   │   ├── AppBar.jsx      # Navigation bar
│   │   │   ├── ProtectedRoute.jsx  # Route guards
│   │   │   ├── SessionWarning.jsx  # Session timeout warning
│   │   │   ├── LocationPicker.jsx  # Map location selector
│   │   │   ├── ImageCarousel.jsx   # Image gallery viewer
│   │   │   ├── ImageUploader.jsx   # Multi-image upload
│   │   ├── ManagmentSite/      # Admin management components
│   │   │   ├── CountryManager.jsx
│   │   │   ├── StatesManager.jsx
│   │   │   ├── CitiesManager.jsx
│   │   │   └── Facilitymanager.jsx
│   │   ├── Places/             # Place-related components
│   │   │   ├── CreatePlace.jsx
│   │   │   ├── EditPlace.jsx
│   │   │   ├── ViewPlace.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   └── ...
│   │   ├── Trips/              # Trip-related components
│   │   │   ├── CreateTrip.jsx
│   │   │   ├── EditTrip.jsx
│   │   │   ├── ViewTrip.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── Itinerary/
│   │   │   └── MembersList/
│   │   └── Users/              # User management components
│   ├── Pages/                  # Route page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Profile.jsx         # User profile
│   │   ├── MainTrips.jsx       # Trips listing
│   │   ├── Create.jsx          # Create trip/place
│   │   ├── Edit.jsx            # Edit trip/place
│   │   ├── View.jsx            # View trip/place
│   │   ├── Search.jsx          # Search page
│   │   ├── ManageSite.jsx      # Admin dashboard
│   │   └── FAQ.jsx             # Help & documentation
│   ├── context/                # React Context providers
│   │   └── AuthContext.js      # Authentication context
│   ├── Resources/              # Configuration & utilities
│   │   ├── config.jsx          # API endpoints config
│   │   └── utils.jsx           # Helper functions
│   └── Css/                    # Component-specific styles
├── build/                      # Production build output
├── package.json               # Dependencies & scripts
└── README.md                  # This file

Root Directory:
├── AUTH_IMPROVEMENTS.md       # Authentication documentation
├── AUTH_QUICK_REFERENCE.md    # Auth quick start guide
├── static.json                # Static server config (Heroku)
├── Diagrams/                  # Architecture diagrams
├── MockUps/                   # Design mockups & prototypes
└── pages/                     # Static HTML pages
```

---

## 🗺️ Application Pages

| Route | Component | Description | Protection |
|-------|-----------|-------------|------------|
| `/` | Home | Landing page with features overview | Public |
| `/Login` | Login | User authentication | Public |
| `/Trips` | MainTrips | Browse all trips | Public |
| `/Places` | MainPlaces | Browse all places | Public |
| `/Create/:opt` | Create | Create trip or place | User |
| `/Edit/:opt/:id` | Edit | Edit trip or place | User |
| `/View/:opt/:id` | View | View trip or place details | Public |
| `/Search/:opt` | Search | Search trips or places | Public |
| `/Profile` | Profile | User profile management | User |
| `/ManageSite` | ManageSite | Admin control panel | Admin |
| `/FAQ` | FAQ | Help & documentation | Public |

**Route Parameters:**
- `:opt` - Type: `trip` or `place`
- `:id` - Entity ID

---

## 🔐 Authentication & Authorization

### Role Hierarchy

The application implements a 4-tier role-based access control system:

```
Admin (Level 2)
    ↓
User (Level 1)
```

### Role Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | All power |
| **Moderator** | Content management, edit/delete own content |
| **User** | Create/edit own trips and places, vote, comment |

### Using Protected Routes

```jsx
import ProtectedRoute from './Component/Commons/ProtectedRoute';

// Require specific role
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

```

### Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isLogged, hasRole, hasPermission, logout } = useAuth();

  return (
    <>
      {isLogged && <p>Welcome, {user.username}!</p>}
      {hasRole('admin') && <AdminButton />}
      {hasPermission('delete') && <DeleteButton />}
    </>
  );
}
```

### Session Management

- **Auto Token Refresh**: Every 15 minutes
- **Idle Timeout**: 30 minutes of inactivity
- **Session Warning**: 5-minute warning before logout
- **Cross-Tab Sync**: Login/logout syncs across browser tabs
- **Activity Tracking**: Mouse, keyboard, scroll, touch events

📚 **Detailed Documentation**: See [AUTH_IMPROVEMENTS.md](AUTH_IMPROVEMENTS.md) and [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)

---

## 🔌 API Configuration

API endpoints are configured in [src/Resources/config.jsx](adondevamosweb/src/Resources/config.jsx):

```javascript
{
  api: {
    baseUrl: 'http://localhost:3001/v1',  // or your API URL
    endpoints: {
      Facilities: '/Facilities',
      Catalogues: '/Catalogues',
      Users: '/Users',
      Places: '/Places',
      Trips: '/Trips',
      Votes: '/Votes'
    }
  }
}
```

**Note**: The backend API is required for full functionality. This is a frontend-only repository.

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploy to Static Hosting

The project includes a `static.json` configuration for platforms like Heroku:

```json
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  }
}
```

### Environment-Specific Builds

Set environment variables before building:

```bash
# Production build
REACT_APP_ENV=production REACT_APP_API_BASE_URL=https://api.production.com npm run build

# Staging build
REACT_APP_ENV=production REACT_APP_API_BASE_URL=https://api.staging.com npm run build
```

---

## 💻 Development

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

### Code Style

The project uses:
- ESLint configuration from `react-app`
- Consistent component structure
- Material-UI styling conventions

### Browser Support

Targets specified in `package.json`:

**Production:**
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Latest Chrome
- Latest Firefox
- Latest Safari

---

## 🗓️ Roadmap

### Completed ✅
- [x] User authentication with RBAC
- [x] Trip creation and management
- [x] Search functionality
- [x] Admin management
- [x] Session management with warnings
- [x] Protected routes
- [x] Responsive design
- [x] Map integration for locations
- [x] Image gallery and upload
- [x] Jwt validation

### In Progress 🚧
- [ ] Migration to Google Cloud Platform
- [ ] Ranking pages by votes
- [ ] Google Maps API
- [ ] Show trips and places by Users and Ubications
- [ ] Comments

### Planned 📋
- [ ] SEO
- [ ] Zod
---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**MoysAkuma**

- GitHub: [@MoysAkuma](https://github.com/MoysAkuma)
- Live: [Adondevamos.net](https://adondevamos.net)

---

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI components from [Material-UI](https://mui.com/)
- Icon set from [Material Icons](https://mui.com/material-ui/material-icons/)
- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38
---

**Made with ❤️ for the Adondevamos community**