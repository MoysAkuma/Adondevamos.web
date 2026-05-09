# Google AdSense Integration Guide

## Setup

### 1. Get Your AdSense Client ID
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in or create an account
3. Navigate to Ads → Overview
4. Your client ID will be in the format: `ca-pub-XXXXXXXXXXXXXXXX`

### 2. Configure Environment Variable
Edit `.env` file in the project root and replace the placeholder:

```env
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```

**Important:** 
- Never commit your actual AdSense client ID to version control
- Add `.env` to `.gitignore` if not already there
- Use `.env.example` as a template for team members

### 3. Restart Development Server
After changing `.env`, restart your development server:

```bash
npm start
```

## Usage

### Head Script
The AdSense script is automatically loaded in the `<head>` tag via `public/index.html`. No additional setup needed.

### Display Ads Using Component

Import the AdSense component:

```jsx
import AdSense from './components/AdSense';
```

#### Basic Ad
```jsx
<AdSense slot="1234567890" />
```

#### Auto Format Ad (Recommended)
```jsx
<AdSense 
  slot="1234567890" 
  format="auto"
  responsive={true}
/>
```

#### Fixed Size Ad
```jsx
<AdSense 
  slot="1234567890" 
  format="rectangle"
  responsive={false}
  style={{ width: '300px', height: '250px' }}
/>
```

#### Ad with Custom Styling
```jsx
<AdSense 
  slot="1234567890" 
  className="my-ad-container"
  style={{ margin: '20px 0', textAlign: 'center' }}
/>
```

## Ad Formats

- `auto` - Automatically sized ad (recommended for responsive design)
- `fluid` - Fluid ad that adapts to container
- `rectangle` - Rectangle ad (300x250, 336x280, etc.)
- `vertical` - Vertical ad (120x600, 160x600, etc.)
- `horizontal` - Horizontal ad (728x90, 970x90, etc.)

## Ad Placement Examples

### In a Blog Post
```jsx
function BlogPost() {
  return (
    <div>
      <h1>Post Title</h1>
      <p>Introduction...</p>
      
      {/* In-article ad */}
      <AdSense slot="1234567890" />
      
      <p>Rest of content...</p>
    </div>
  );
}
```

### In Sidebar
```jsx
function Sidebar() {
  return (
    <aside>
      <AdSense 
        slot="9876543210" 
        format="vertical"
        style={{ marginBottom: '20px' }}
      />
    </aside>
  );
}
```

### Footer Ad
```jsx
function Footer() {
  return (
    <footer>
      <AdSense 
        slot="5555555555" 
        format="horizontal"
      />
      <p>&copy; 2026 Your Site</p>
    </footer>
  );
}
```

## Getting Ad Slot IDs

1. Go to AdSense → Ads → By ad unit
2. Click "Create new ad unit" or use existing ones
3. Copy the `data-ad-slot` value
4. Use this value in the `slot` prop of the AdSense component

## Testing

### Development
- Ads may not show in development mode
- Check browser console for any AdSense errors
- The component won't render if client ID is not configured

### Production
- Build and deploy: `npm run build`
- Ads will appear after AdSense approves your site
- It may take 24-48 hours for ads to start showing

## Troubleshooting

### Ads Not Showing
1. ✅ Verify `REACT_APP_ADSENSE_CLIENT_ID` is set correctly
2. ✅ Ensure you've restarted the dev server after changing `.env`
3. ✅ Check if your site is approved by AdSense
4. ✅ Disable ad blockers when testing
5. ✅ Check browser console for errors

### Environment Variable Not Working
- React requires the `REACT_APP_` prefix for custom environment variables
- Environment variables are embedded at build time, so restart is required
- Never use `VITE_` prefix with create-react-app (use `REACT_APP_`)

## Best Practices

1. **Don't Overload**: Place 3-4 ads per page maximum
2. **Above the Fold**: Place at least one ad in visible area
3. **Natural Placement**: Integrate ads naturally into content
4. **Mobile Friendly**: Use responsive ads for mobile devices
5. **Performance**: Ads load asynchronously, don't block page rendering

## AdSense Policies
Make sure your site complies with [AdSense Program Policies](https://support.google.com/adsense/answer/48182):
- Original content
- User-friendly navigation
- No prohibited content
- Sufficient text content
- Privacy policy

## File Structure
```
adondevamosweb/
├── public/
│   └── index.html              # AdSense head script
├── src/
│   └── components/
│       └── AdSense.js          # Reusable AdSense component
├── .env                        # Your actual config (gitignored)
└── .env.example               # Template for team
```
