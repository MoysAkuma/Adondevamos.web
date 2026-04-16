# Catalogues Cache - Quick Reference

## Usage

### Import the Hook
```javascript
import useCatalogues from '../hooks/useCatalogues';
```

### Basic Usage
```javascript
const { catalogues, loading } = useCatalogues();

if (loading) return <CircularProgress />;

// Access all catalogues
console.log(catalogues.countries);
console.log(catalogues.states);
console.log(catalogues.cities);
console.log(catalogues.facilities);
```

### Direct Access
```javascript
// Get individual arrays directly
const { countries, states, cities, facilities } = useCatalogues();
```

### Custom Cache Duration
```javascript
// Cache for 30 minutes
const { catalogues } = useCatalogues({ cacheExpirationMinutes: 30 });

// Cache for 2 hours
const { catalogues } = useCatalogues({ cacheExpirationMinutes: 120 });
```

### Force Refresh
```javascript
// Always fetch fresh data
const { catalogues } = useCatalogues({ forceRefresh: true });

// Or use manual refresh
const { refreshCatalogues } = useCatalogues();
await refreshCatalogues();
```

### Check Cache Status
```javascript
const { isCacheValid, lastUpdated } = useCatalogues();

console.log('Cache valid:', isCacheValid);
console.log('Last updated:', lastUpdated);
```

## Configuration

Edit `src/Resources/config.jsx`:

```javascript
cache: {
  cataloguesExpirationMinutes: 60  // Change this value
}
```

## When to Use

✅ **Use when:**
- Loading location dropdowns (countries, states, cities)
- Displaying facility options
- Any component that needs catalogue data

❌ **Don't use when:**
- You need real-time data that changes frequently
- You're working with user-specific data (not catalogues)

## Cache Refresh Triggers

Cache is automatically refreshed when:
1. Cache expires (after configured minutes)
2. User closes browser tab/window
3. Management saves new location (countries, states, cities, facilities)
4. `clearCache()` is called manually
5. `refreshCatalogues()` is called
6. Component uses `forceRefresh: true` option

## Troubleshooting

### Catalogues not updating
```javascript
// Force a refresh
const { refreshCatalogues } = useCatalogues();
await refreshCatalogues();
```

### Cache too old
```javascript
// Reduce cache duration
const { catalogues } = useCatalogues({ cacheExpirationMinutes: 15 });
```

### Always get fresh data
```javascript
// Bypass cache
const { catalogues } = useCatalogues({ forceRefresh: true });
```

## Examples

### In a Form Component
```javascript
function CreatePlace() {
    const { countries, states, cities, facilities, loading } = useCatalogues();
    
    if (loading) return <CircularProgress />;
    
    return (
        <form>
            <CountrySelect options={countries} />
            <StateSelect options={states} />
            <CitySelect options={cities} />
            <FacilitiesSelect options={facilities} />
        </form>
    );
}
```

### In Management Component
```javascript
function ManageSite() {
    const { catalogues, refreshCatalogues } = useCatalogues();
    
    const handleLocationUpdate = async () => {
        await refreshCatalogues();
    };
    
    return (
        <CountryManager 
            countries={catalogues.countries}
            onUpdate={handleLocationUpdate}
        />
    );
}
```

### With Error Handling
```javascript
function MyComponent() {
    const { catalogues, loading, error } = useCatalogues();
    
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    return <div>{/* Use catalogues */}</div>;
}
```

## Performance Impact

| Scenario | Before (API calls) | After (with cache) |
|----------|-------------------|-------------------|
| First page load | 1 | 1 |
| Navigate to another page | 1 | 0 |
| Navigate 10 pages | 10 | 1 |
| After cache expires | N/A | 1 (auto refresh) |

## Storage Details

| Item | Location | Lifetime |
|------|----------|----------|
| Catalogues data | Session Storage | Until tab closes or expires |
| Cache timestamp | Session Storage | Until tab closes |
| Cache size | ~10-50 KB | Depends on catalogue size |

---

For detailed documentation, see: `CATALOGUES_HOOK_README.md`
