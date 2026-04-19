# GenericFilter Component - Documentation

## Overview

The `GenericFilter` component is a highly reusable, configurable filter control that can be used across different parts of the application. It replaces individual filter implementations with a single, maintainable component.

## Features

- ✅ **Fully Configurable**: Define filters through a simple configuration array
- ✅ **Multiple Input Types**: Supports text, date, select, and checkbox inputs
- ✅ **Location Cascade**: Automatic filtering of states by country, cities by state
- ✅ **Collapsible by Default**: Filters are hidden by default to save screen space
- ✅ **Auth-aware**: Can show/hide filters based on authentication status
- ✅ **Clean UI**: Edit-in-place interface with confirmation
- ✅ **Search & Clear**: Built-in search and clear functionality

## Usage

### Basic Example

```javascript
import GenericFilter from '../Commons/GenericFilter';

function MyComponent() {
    const filterConfig = [
        { field: 'name', label: 'Name', type: 'text' },
        { field: 'country', label: 'Country', type: 'select', options: countries }
    ];
    
    const handleSearch = (filters) => {
        console.log('Search with filters:', filters);
        // Perform search...
    };
    
    return (
        <GenericFilter
            onSearch={handleSearch}
            filterConfig={filterConfig}
            title="My Filters"
            defaultExpanded={false}
        />
    );
}
```

### Filter Configuration

Each filter in the `filterConfig` array is an object with the following properties:

```javascript
{
    field: string,           // Required - Field name in filter object
    label: string,           // Required - Display label
    type: string,           // Required - 'text', 'date', 'select', or 'checkbox'
    options: array,         // Optional - For select/checkbox types
    requireAuth: boolean,   // Optional - Show only when authenticated
    cascade: object         // Optional - For location cascading
}
```

### Input Types

#### Text Input
```javascript
{ 
    field: 'name', 
    label: 'Place Name', 
    type: 'text' 
}
```

#### Date Input
```javascript
{ 
    field: 'startdate', 
    label: 'Start Date', 
    type: 'date' 
}
```

#### Select Dropdown
```javascript
{ 
    field: 'countryid', 
    label: 'Country', 
    type: 'select', 
    options: countries  // Array of { id, name } objects
}
```

#### Single Checkbox (Boolean)
```javascript
{ 
    field: 'mytrips', 
    label: 'My Trips', 
    type: 'checkbox'  // No options = single boolean checkbox
}
```

#### Multiple Checkboxes (Array)
```javascript
{ 
    field: 'facilities', 
    label: 'Facilities', 
    type: 'checkbox', 
    options: facilities  // Array of { id, name } objects
}
```

### Location Cascade Configuration

For hierarchical location filtering (Country → State → City):

```javascript
const filterConfig = [
    { 
        field: 'countryid', 
        label: 'Country', 
        type: 'select', 
        options: countries,
        cascade: {
            resetFields: ['stateid', 'cityid'],  // Clear these when changed
            filterField: 'stateid',              // Filter this field's options
            sourceField: 'countryid',            // Based on this property
            sourceData: states,                  // From this data source
            subsequentFilters: ['cityid']        // Also clear these filters
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

### Authentication-aware Filters

Show filters only to authenticated users:

```javascript
const filterConfig = [
    { field: 'name', label: 'Name', type: 'text' },
    { 
        field: 'mytrips', 
        label: 'My Trips', 
        type: 'checkbox',
        requireAuth: true  // Only shown if showAuthFilters=true
    }
];

<GenericFilter
    filterConfig={filterConfig}
    showAuthFilters={isLogged}  // Pass authentication state
    onSearch={handleSearch}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSearch` | Function | Required | Callback when search button clicked. Receives filter object |
| `filterConfig` | Array | Required | Array of filter configuration objects |
| `title` | String | "Filters" | Title displayed in filter header |
| `defaultExpanded` | Boolean | false | Whether filters are expanded by default |
| `showAuthFilters` | Boolean | false | Whether to show filters with `requireAuth: true` |

## Complete Examples

### Place Filters

```javascript
import React, { useMemo } from "react";
import GenericFilter from "../Commons/GenericFilter";

function PlaceFilter({ searchMethod, countries, states, cities, facilitiesOptions }) {
    const filterConfig = useMemo(() => [
        { field: 'name', label: 'Place Name', type: 'text' },
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
        { field: 'cityid', label: 'City', type: 'select', options: cities },
        { field: 'facilities', label: 'Facilities', type: 'checkbox', options: facilitiesOptions }
    ], [countries, states, cities, facilitiesOptions]);

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

### Trip Filters with Auth

```javascript
import React, { useMemo } from "react";
import GenericFilter from '../Commons/GenericFilter';
import useCatalogues from '../../hooks/useCatalogues';
import { useAuth } from '../../context/AuthContext';

function TripFilters({ searchMethod }) {
    const { isLogged, loading } = useAuth();
    const { countries, states, cities } = useCatalogues();

    const filterConfig = useMemo(() => [
        { field: 'name', label: 'Trip Name', type: 'text' },
        { field: 'initialdate', label: 'Initial Date', type: 'date' },
        { field: 'finaldate', label: 'Final Date', type: 'date' },
        { 
            field: 'countryid', 
            label: 'Country', 
            type: 'select', 
            options: countries,
            cascade: { /* ... */ }
        },
        { field: 'stateid', label: 'State', type: 'select', options: states },
        { field: 'cityid', label: 'City', type: 'select', options: cities },
        { field: 'mytrips', label: 'My Trips', type: 'checkbox', requireAuth: true },
        { field: 'membertrips', label: 'Trips I\'m In', type: 'checkbox', requireAuth: true }
    ], [countries, states, cities]);

    return (
        <GenericFilter
            onSearch={searchMethod}
            filterConfig={filterConfig}
            title="Trip Filters"
            defaultExpanded={false}
            showAuthFilters={isLogged && !loading}
        />
    );
}
```

## Filter Object Format

When the search button is clicked, `onSearch` is called with a filter object:

```javascript
{
    name: "Beach",
    countryid: 1,
    stateid: 5,
    cityid: 42,
    facilities: [1, 3, 7],  // Array for multiple checkboxes
    mytrips: true,          // Boolean for single checkbox
    initialdate: "2026-04-15",
    finaldate: "2026-04-20"
}
```

Fields that are not set will have `null` value.

## UI Behavior

### Edit-in-Place
1. Initially shows "None" for unset filters
2. Click Edit icon to show input
3. Fill in value
4. Click Check icon to confirm

### Collapsible
- Click expand/collapse icon to show/hide filter inputs
- Saves screen space when not actively filtering

### Clear Button
- Resets all filters to initial state
- Clears cascaded selections

### Search Button
- Shows "Search" when no filters applied
- Shows "Search with Filters" when at least one filter is active

## Migration from Old Pattern

### Before (Old PlaceFilter)
```javascript
// 300+ lines of code with hardcoded filter logic
const [filters, setFilters] = useState({ /* ... */ });
const [selectedFilters, setSelectedFilters] = useState({ /* ... */ });
const [showInput, setShowInput] = useState({ /* ... */ });
const [filteredStates, setFilteredStates] = useState([]);
// ... lots more state and handlers
```

### After (New PlaceFilter)
```javascript
// ~50 lines of configuration-based code
const filterConfig = useMemo(() => [
    { field: 'name', label: 'Place Name', type: 'text' },
    { field: 'countryid', label: 'Country', type: 'select', options: countries }
], [countries]);

return <GenericFilter onSearch={searchMethod} filterConfig={filterConfig} />;
```

## Benefits

### Code Reduction
- **PlaceFilter**: ~350 lines → ~60 lines (83% reduction)
- **TripFilters**: ~300 lines → ~70 lines (77% reduction)

### Maintainability
- Single source of truth for filter logic
- Bug fixes apply to all filter components
- Easy to add new filter types

### Consistency
- Same UI/UX across all filter components
- Predictable behavior for users

### Flexibility
- Add new filters with simple configuration
- Customize per-component behavior via props
- Easy to extend with new input types

## Extending

### Adding New Input Types

Edit `GenericFilter.jsx` to add new input types:

```javascript
if (type === "my-custom-type") {
    return (
        <MyCustomInput
            value={filters[field]}
            onChange={handleChange}
            // ...
        />
    );
}
```

### Custom Cascade Logic

Extend the `cascade` configuration object:

```javascript
cascade: {
    resetFields: ['field1', 'field2'],
    filterField: 'targetField',
    sourceField: 'sourceProperty',
    sourceData: dataArray,
    customLogic: (value) => { /* custom filter */ }
}
```

## Components Using GenericFilter

- ✅ **PlaceFilter** - Location-based place filtering
- ✅ **TripFilters** - Trip search with date and location filters

## Performance Considerations

- Uses `useMemo` for filter config to prevent unnecessary re-renders
- Efficient state management with single filter object
- Minimal re-renders on user interactions

---

**Created**: April 15, 2026  
**Location**: `src/Component/Commons/GenericFilter.jsx`  
**Used by**: PlaceFilter.jsx, TripFilters.jsx
