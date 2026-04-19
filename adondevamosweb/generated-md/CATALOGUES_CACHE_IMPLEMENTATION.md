# Catalogues Caching Implementation Summary

## Overview
Implemented a centralized, reusable hook for managing catalogues (countries, states, cities, facilities) with session storage caching to reduce API calls and improve application performance.

## Changes Made

### 1. Created `useCatalogues` Hook
**File**: `src/hooks/useCatalogues.js`

Features:
- Session storage caching with configurable expiration time
- Automatic cache validation and refresh
- Manual refresh capability via `refreshCatalogues()` function
- Clear cache functionality
- Loading and error states
- Last updated timestamp tracking

### 2. Updated Configuration
**File**: `src/Resources/config.jsx`

Added cache configuration:
```javascript
cache: {
  cataloguesExpirationMinutes: 60  // Development: 1 hour
  cataloguesExpirationMinutes: 120 // Production: 2 hours
}
```

### 3. Updated Components to Use Hook

#### Pages Updated:
- ✅ **Create.jsx** - Uses hook to load catalogues for create forms
- ✅ **Edit.jsx** - Uses hook to load catalogues for edit forms  
- ✅ **ManageSite.jsx** - Uses hook with refresh capability for management interface

#### User Components Updated:
- ✅ **CreateUser.jsx** - Removed direct API call, now uses hook
- ✅ **EditUser.jsx** - Removed direct API call, now uses hook

#### Management Components Updated:
All management components now accept and call `onUpdate` callback to refresh cache after saves:
- ✅ **CountryManager.jsx**
- ✅ **StatesManager.jsx** 
- ✅ **CitiesManager.jsx**
- ✅ **Facilitymanager.jsx**

## How It Works

### Initial Load
1. Component calls `useCatalogues()`
2. Hook checks if cached data exists and is valid
3. If valid cache exists → use cached data (no API call)
4. If cache invalid/missing → fetch from API and cache

### Cache Expiration
- Default: 60 minutes (configurable via `config.cache.cataloguesExpirationMinutes`)
- Can be overridden per component: `useCatalogues({ cacheExpirationMinutes: 30 })`
- Cache stored in session storage (cleared when tab/window closes)

### Management Updates
When new locations are saved through ManageSite:
1. Management component calls `onUpdate()` callback
2. Callback triggers `refreshCatalogues()` in ManageSite
3. Fresh data fetched from API and cache updated
4. All components using the hook automatically get updated data

## Benefits

### Performance
- ❌ **Before**: Every page load = 1 API call to `/catalogues/all`
- ✅ **After**: First load = 1 API call, subsequent loads = 0 API calls (until cache expires)

### User Experience
- Faster page loads (no waiting for API on every navigation)
- Consistent data across entire application
- Automatic updates when new locations are saved

### Developer Experience
- Single source of truth for catalogues
- No need to manage API calls in each component
- Easy to configure cache behavior
- Built-in loading and error states

## Configuration Options

```javascript
// Use default configuration (60 min in dev, 120 min in prod)
const { catalogues, loading } = useCatalogues();

// Override cache expiration (30 minutes)
const { catalogues, loading } = useCatalogues({ 
    cacheExpirationMinutes: 30 
});

// Force refresh from API (ignore cache)
const { catalogues, loading } = useCatalogues({ 
    forceRefresh: true 
});

// Access individual catalogue arrays
const { countries, states, cities, facilities } = useCatalogues();

// Manual refresh
const { refreshCatalogues } = useCatalogues();
await refreshCatalogues();

// Check cache status
const { isCacheValid, lastUpdated } = useCatalogues();
```

## Session Storage Keys
- `adondevamos_catalogues` - Stores catalogue data
- `adondevamos_catalogues_timestamp` - Stores last update timestamp

## Testing Checklist

### Verify Cache Functionality
- [ ] Open DevTools → Application → Session Storage
- [ ] Load any page that uses catalogues
- [ ] Verify `adondevamos_catalogues` and `adondevamos_catalogues_timestamp` appear
- [ ] Navigate to different pages
- [ ] Verify no new API calls to `/catalogues/all` (check Network tab)

### Verify Cache Expiration
- [ ] Load page with catalogues
- [ ] Wait for cache expiration (60 min) or manually delete from session storage
- [ ] Reload page
- [ ] Verify new API call is made

### Verify Management Refresh
- [ ] Go to ManageSite → Create new country/state/city
- [ ] Verify cache is refreshed (check timestamp in session storage)
- [ ] Navigate to Create/Edit pages
- [ ] Verify new location appears in dropdowns

### Verify Error Handling
- [ ] Disconnect network
- [ ] Clear session storage
- [ ] Reload page
- [ ] Verify error state is shown

## Migration Pattern

For any component still making direct API calls to `/catalogues/all`:

```javascript
// OLD CODE (Remove)
useEffect(() => {
    const getCatalogues = async() => {
        const response = await axios.get(`${URL}/catalogues/all`);
        setAllCatalogues(response.data.info);
    };
    getCatalogues();
}, []);

// NEW CODE (Add)
import useCatalogues from '../hooks/useCatalogues';

const { catalogues, loading: cataloguesLoading } = useCatalogues();

useEffect(() => {
    if (!cataloguesLoading) {
        setAllCatalogues(catalogues);
    }
}, [cataloguesLoading, catalogues]);
```

## Future Enhancements

Potential improvements for future iterations:

1. **IndexedDB Storage** - For persistent cache across browser sessions
2. **Background Refresh** - Fetch fresh data in background before cache expires
3. **Partial Cache Updates** - Update only changed catalogue items
4. **Cache Size Monitoring** - Alert if cache size grows too large
5. **Analytics** - Track cache hit rate and performance improvements

## Documentation

Full documentation available at:
- `generated-md/CATALOGUES_HOOK_README.md`

---

**Implementation Date**: April 15, 2026  
**Developer**: Migration to reusable hook pattern with caching
