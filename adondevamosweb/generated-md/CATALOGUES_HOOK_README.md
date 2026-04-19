# Catalogues Hook Documentation

## Overview

The `useCatalogues` hook provides a centralized, cached solution for managing application catalogues (countries, states, cities, and facilities) across the entire application.

## Features

- ✅ **Session Storage Caching**: Catalogues are cached in session storage to reduce API calls
- ✅ **Configurable Expiration**: Cache expiration time is configurable (default: 60 minutes)
- ✅ **Automatic Refresh**: Automatically checks cache validity and fetches fresh data when needed
- ✅ **Manual Refresh**: Provides a `refreshCatalogues()` function to force refresh from API
- ✅ **Error Handling**: Built-in error handling and loading states
- ✅ **TypeScript Ready**: Fully typed for better development experience

## Usage

### Basic Usage

```javascript
import useCatalogues from '../hooks/useCatalogues';

function MyComponent() {
    const { catalogues, loading, error } = useCatalogues();
    
    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div>
            <p>Countries: {catalogues.countries.length}</p>
            <p>States: {catalogues.states.length}</p>
            <p>Cities: {catalogues.cities.length}</p>
            <p>Facilities: {catalogues.facilities.length}</p>
        </div>
    );
}
```

### With Custom Cache Expiration

```javascript
// Cache expires after 30 minutes
const { catalogues, loading } = useCatalogues({ 
    cacheExpirationMinutes: 30 
});
```

### Force Refresh from API

```javascript
// Always fetch fresh data, ignore cache
const { catalogues, loading } = useCatalogues({ 
    forceRefresh: true 
});
```

### Manual Refresh

```javascript
function MyComponent() {
    const { catalogues, refreshCatalogues } = useCatalogues();
    
    const handleRefresh = async () => {
        try {
            await refreshCatalogues();
            console.log('Catalogues refreshed!');
        } catch (error) {
            console.error('Failed to refresh:', error);
        }
    };
    
    return (
        <button onClick={handleRefresh}>Refresh Catalogues</button>
    );
}
```

### Accessing Individual Catalogues

```javascript
const { countries, states, cities, facilities } = useCatalogues();

// These are the same as:
// catalogues.countries, catalogues.states, etc.
```

### Check Cache Validity

```javascript
const { isCacheValid, lastUpdated } = useCatalogues();

console.log('Cache is valid:', isCacheValid);
console.log('Last updated:', lastUpdated);
```

### Clear Cache

```javascript
const { clearCache } = useCatalogues();

// Clear all cached data
clearCache();
```

## API Reference

### Hook Parameters

```typescript
interface UseCataloguesOptions {
    cacheExpirationMinutes?: number;  // Default: 60
    forceRefresh?: boolean;            // Default: false
}
```

### Return Values

```typescript
interface UseCataloguesReturn {
    // Data
    catalogues: {
        countries: Array<Country>;
        states: Array<State>;
        cities: Array<City>;
        facilities: Array<Facility>;
    };
    countries: Array<Country>;
    states: Array<State>;
    cities: Array<City>;
    facilities: Array<Facility>;
    
    // State
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    isCacheValid: boolean;
    
    // Methods
    refreshCatalogues: () => Promise<CatalogueData>;
    clearCache: () => void;
}
```

## Implementation in Management Pages

When new locations are saved through the management interface (ManageSite page), the cache is automatically refreshed:

```javascript
// ManageSite.jsx
const { refreshCatalogues } = useCatalogues();

const handleLocationUpdate = async () => {
    await refreshCatalogues();
};

// Pass to child components
<CountryManager onUpdate={handleLocationUpdate} />
<StatesManager onUpdate={handleLocationUpdate} />
<CitiesManager onUpdate={handleLocationUpdate} />
<Facilitymanager onUpdate={handleLocationUpdate} />
```

This ensures that any changes made in the management interface are immediately reflected throughout the application.

## Components Using the Hook

The following components have been updated to use `useCatalogues`:

- `CreateUser.jsx`
- `EditUser.jsx`
- `Create.jsx` (Page)
- `Edit.jsx` (Page)
- `ManageSite.jsx` (Page)

## Cache Storage

The hook uses session storage with the following keys:

- `adondevamos_catalogues`: Stores the catalogue data
- `adondevamos_catalogues_timestamp`: Stores the last update timestamp

Cache is cleared when:
1. The browser tab/window is closed
2. `clearCache()` is called manually
3. Cache expires based on `cacheExpirationMinutes`

## Benefits

1. **Reduced API Calls**: Catalogues are fetched once per session (or per expiration period)
2. **Improved Performance**: Subsequent page loads use cached data
3. **Consistent Data**: All components use the same cached data
4. **Easy Configuration**: Cache expiration can be adjusted per component if needed
5. **Automatic Updates**: Management interface automatically refreshes cache when data changes

## Configuration

To change the default cache expiration time globally, modify the default value in `useCatalogues.js`:

```javascript
const useCatalogues = (options = {}) => {
    const {
        cacheExpirationMinutes = 60, // Change this default value
        forceRefresh = false
    } = options;
    // ...
}
```

## Migration Notes

### Before (Old Pattern)
```javascript
// Component-specific API call
useEffect(() => {
    const getCatalogues = async() => {
        const response = await axios.get(`${URL}/all`);
        setAllCatalogues(response.data.info);
    };
    getCatalogues();
}, []);
```

### After (New Pattern)
```javascript
// Centralized hook with caching
const { catalogues, loading } = useCatalogues();

useEffect(() => {
    if (!loading) {
        setAllCatalogues(catalogues);
    }
}, [loading, catalogues]);
```

## Troubleshooting

### Cache Not Updating After Management Changes

Ensure the management components are calling `onUpdate()` after successful saves:

```javascript
const formSuccess = () => {
    // ... other code
    if (onUpdate) {
        onUpdate();
    }
};
```

### Cache Expires Too Quickly/Slowly

Adjust the `cacheExpirationMinutes` parameter:

```javascript
// For frequently changing data
const { catalogues } = useCatalogues({ cacheExpirationMinutes: 10 });

// For rarely changing data
const { catalogues } = useCatalogues({ cacheExpirationMinutes: 120 });
```

### Force Fresh Data

Use `forceRefresh` option or call `refreshCatalogues()`:

```javascript
const { catalogues } = useCatalogues({ forceRefresh: true });
// OR
const { refreshCatalogues } = useCatalogues();
await refreshCatalogues();
```
