# NavBar Configuration System

## 📁 Files Created

- `src/config/navbar.config.json` - Main navigation configuration
- `src/hooks/useNavbarConfig.js` - React hook for configuration management
- `src/config/navbar.examples.json` - Example configurations
- Updated `src/Component/NavBar.jsx` - Component using configuration

## 🎛️ Configuration Options

### Main Configuration (`navbar.config.json`)

```javascript
{
  "navbar": {
    "brand": {
      "name": "AdondeVamos",    // Site/app name
      "href": "/"              // Home link
    },
    "menuItems": [
      {
        "id": "unique-id",       // Unique identifier
        "title": "Display Text", // Text shown in menu
        "href": "/path",         // Navigation path
        "icon": "🏠",           // Emoji or icon (optional)
        "roles": ["user"],      // Which roles can see this item
        "order": 1,             // Display order
        "visible": true         // Show/hide globally
      }
    ],
    "authButtons": {
      "login": { /* Login button config */ },
      "logout": { /* Logout button config */ }
    },
    "settings": {
      "showIcons": true,        // Enable/disable icons
      "mobileBreakpoint": "768px",
      "maxMenuItems": 5,
      "enableAnimations": true,
      "theme": {
        "style": "8bit",        // Theme style
        "showPixelEffects": true
      }
    }
  }
}
```

## 👥 Role-Based Access

### Supported Roles
- `anon` - Not logged in users
- `user` - Regular logged in users  
- `admin` - Administrator users

### Permission System
Configure which roles can access different menu items:

```json
"roles": ["anon", "user", "admin"]  // Available to all
"roles": ["user", "admin"]           // Authenticated only
"roles": ["admin"]                   // Admin only
```

## 🎨 Customization

### 1. Add New Menu Item
Edit `navbar.config.json`:

```json
{
  "id": "newpage",
  "title": "New Page", 
  "href": "/newpage",
  "icon": "📄",
  "roles": ["user", "admin"],
  "order": 10,
  "visible": true
}
```

### 2. Change Theme Settings
```json
"settings": {
  "showIcons": false,           // Hide all icons
  "theme": {
    "style": "minimal",         // Change to minimal theme
    "showPixelEffects": false   // Disable 8-bit effects
  }
}
```

### 3. Customize for Different User Types
```json
"menuItems": [
  {
    "id": "premium",
    "title": "Premium Features",
    "href": "/premium", 
    "roles": ["premium", "admin"],  // New role type
    "order": 5,
    "visible": true
  }
]
```

## 🔧 Usage in Components

### Basic Usage
```jsx
import { useNavbarConfig } from '../hooks/useNavbarConfig';

function MyComponent() {
  const { menuItems, brand, settings } = useNavbarConfig(userRole, isLogged);
  
  return (
    <div>
      {menuItems.map(item => (
        <a key={item.id} href={item.href}>{item.title}</a>
      ))}
    </div>
  );
}
```

### Permission Checking
```jsx
const { canAccess, getMenuItemById } = useNavbarConfig(role, isLogged);

// Check access permissions
if (canAccess('admin')) {
  // Show admin content
}

// Get specific menu item
const homeItem = getMenuItemById('home');
```

## 🎮 8-Bit Theme Features

- Retro pixel font (Press Start 2P)
- 8-bit color palette (dark blues with neon pink)
- Pixel-perfect borders and shadows
- Retro hover animations
- Gaming-style icons

## 📱 Mobile Features

- Hamburger menu for mobile devices
- Touch-optimized buttons
- Smooth slide animations
- Overlay backdrop
- Responsive icon sizing

## 🔄 Dynamic Updates

The configuration is reactive - changes to role or login status automatically update the visible menu items without page refresh.

## 🚀 Quick Start

1. **Modify menu items** in `navbar.config.json`
2. **Component automatically updates** using the configuration
3. **Test different roles** by changing user authentication state
4. **Customize styling** via the settings object

## 💡 Examples

Check `navbar.examples.json` for:
- Simple site configuration
- E-commerce site setup  
- Different icon sets
- Alternative permission schemes

This system makes your navbar completely configurable without touching the React component code!