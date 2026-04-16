# Generic Filter - Quick Reference

## Quick Start

```javascript
import GenericFilter from '../Commons/GenericFilter';

const filterConfig = [
    { field: 'name', label: 'Name', type: 'text' }
];

<GenericFilter 
    onSearch={(filters) => console.log(filters)} 
    filterConfig={filterConfig} 
/>
```

## Filter Types

### Text Input
```javascript
{ field: 'name', label: 'Name', type: 'text' }
```

### Date Input
```javascript
{ field: 'startdate', label: 'Start Date', type: 'date' }
```

### Single Dropdown
```javascript
{ 
    field: 'country', 
    label: 'Country', 
    type: 'select', 
    options: [
        { id: 1, name: 'USA' },
        { id: 2, name: 'Canada' }
    ]
}
```

### Boolean Checkbox
```javascript
{ field: 'active', label: 'Active Only', type: 'checkbox' }
// No options = single checkbox (true/false)
```

### Multiple Checkboxes
```javascript
{ 
    field: 'categories', 
    label: 'Categories', 
    type: 'checkbox',
    options: [
        { id: 1, name: 'Category A' },
        { id: 2, name: 'Category B' }
    ]
}
// Returns array: [1, 2]
```

### Auth-Required Filter
```javascript
{ 
    field: 'myitems', 
    label: 'My Items', 
    type: 'checkbox',
    requireAuth: true  // Only shows when showAuthFilters=true
}

<GenericFilter 
    showAuthFilters={isLogged}
    filterConfig={config}
/>
```

## Location Cascade

### Country → State → City

```javascript
const filterConfig = [
    { 
        field: 'countryid',
        label: 'Country',
        type: 'select',
        options: countries,
        cascade: {
            resetFields: ['stateid', 'cityid'],
            filterField: 'stateid',
            sourceField: 'countryid',
            sourceData: states,
            subsequentFilters: ['cityid']
        }
    },
    { 
        field: 'stateid',
        label: 'State',
        type: 'select',
        options: states,
        cascade: {
            resetFields: ['cityid'],
            filterField: 'cityid',
            sourceField: 'stateid',
            sourceData: cities
        }
    },
    { 
        field: 'cityid',
        label: 'City',
        type: 'select',
        options: cities
    }
];
```

## Props

```javascript
<GenericFilter
    onSearch={handleSearch}           // Required - Called with filter object
    filterConfig={filterConfig}       // Required - Array of filter configs
    title="My Filters"                // Optional - Default: "Filters"
    defaultExpanded={false}           // Optional - Default: false
    showAuthFilters={isLogged}        // Optional - Default: false
/>
```

## Complete Examples

### Simple Filter
```javascript
function SimpleFilter({ onSearch }) {
    const config = [
        { field: 'search', label: 'Search', type: 'text' }
    ];
    
    return (
        <GenericFilter 
            onSearch={onSearch} 
            filterConfig={config}
        />
    );
}
```

### Place Filter
```javascript
function PlaceFilter({ searchMethod, countries, states, cities, facilities }) {
    const filterConfig = useMemo(() => [
        { field: 'name', label: 'Place Name', type: 'text' },
        { 
            field: 'countryid', 
            label: 'Country', 
            type: 'select', 
            options: countries,
            cascade: { /* ... */ }
        },
        { field: 'stateid', label: 'State', type: 'select', options: states },
        { field: 'cityid', label: 'City', type: 'select', options: cities },
        { field: 'facilities', label: 'Facilities', type: 'checkbox', options: facilities }
    ], [countries, states, cities, facilities]);

    return (
        <GenericFilter
            onSearch={searchMethod}
            filterConfig={filterConfig}
            title="Place Filters"
            defaultExpanded={false}
        />
    );
}
```

### Trip Filter with Auth
```javascript
import { useAuth } from '../../context/AuthContext';
import useCatalogues from '../../hooks/useCatalogues';

function TripFilters({ searchMethod }) {
    const { isLogged } = useAuth();
    const { countries, states, cities } = useCatalogues();

    const filterConfig = useMemo(() => [
        { field: 'name', label: 'Trip Name', type: 'text' },
        { field: 'startdate', label: 'Start Date', type: 'date' },
        { field: 'enddate', label: 'End Date', type: 'date' },
        { field: 'countryid', label: 'Country', type: 'select', options: countries },
        { field: 'mytrips', label: 'My Trips', type: 'checkbox', requireAuth: true }
    ], [countries]);

    return (
        <GenericFilter
            onSearch={searchMethod}
            filterConfig={filterConfig}
            showAuthFilters={isLogged}
        />
    );
}
```

## Filter Object Output

Search callback receives object with all filter values:

```javascript
{
    name: "Beach",
    countryid: 1,
    stateid: 5,
    cityid: 42,
    facilities: [1, 3, 7],  // Array for multi-checkbox
    active: true,           // Boolean for single checkbox
    startdate: "2026-04-15"
}
```

Unset fields are `null`.

## Common Patterns

### With useMemo
```javascript
const filterConfig = useMemo(() => [
    { field: 'name', label: 'Name', type: 'text' }
], [dependencies]);
```

### With Catalogues Hook
```javascript
const { countries, states, cities } = useCatalogues();

const filterConfig = useMemo(() => [
    { field: 'countryid', label: 'Country', type: 'select', options: countries }
], [countries]);
```

### Handle Search
```javascript
const handleSearch = (filters) => {
    // filters = { name: "Beach", countryid: 1, ... }
    fetchData(filters);
};
```

## Options Format

Arrays of objects with `id` and `name`:

```javascript
const countries = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'Canada' }
];

// Or with value/label
const options = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' }
];
```

## Tips

✅ **DO:**
- Use `useMemo` for filterConfig
- Keep filter configs together
- Use descriptive field names
- Set `defaultExpanded={false}` to save space

❌ **DON'T:**
- Recreate config on every render
- Use complex nested logic in config
- Forget to pass all required options

## Troubleshooting

### Filters not showing
→ Check `filterConfig` is not empty

### Location cascade not working
→ Verify `cascade` config has correct field names

### Auth filters not appearing
→ Pass `showAuthFilters={true}`

### Options not displaying
→ Check options array has `id`/`name` or `value`/`label`

---

**File**: `src/Component/Commons/GenericFilter.jsx`  
**Docs**: `generated-md/GENERIC_FILTER_COMPONENT.md`
