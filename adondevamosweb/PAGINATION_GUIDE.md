# Pagination System - Quick Start Guide

## Overview
A fully configurable, reusable pagination system with 8-bit retro styling.

## Features
✅ Configurable items per page
✅ Multiple page size options
✅ First/Last page navigation
✅ Previous/Next page buttons
✅ Page number buttons
✅ Info display (showing X-Y of Z items)
✅ Compact mode for mobile
✅ Automatic page reset on data changes
✅ 8-bit retro styling

## Basic Usage

```jsx
import usePagination from '../hooks/usePagination';
import Pagination from '../Component/Commons/Pagination';

function MyComponent() {
  const items = [/* your data array */];
  const pagination = usePagination(items);
  
  return (
    <div>
      {/* Display paginated items */}
      {pagination.paginatedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      {/* Pagination controls */}
      <Pagination {...pagination} />
    </div>
  );
}
```

## Configuration

### Default Configuration
```javascript
const pagination = usePagination(items, {
  initialPage: 1,
  itemsPerPage: 10,
  pageSizeOptions: [5, 10, 20, 50]
});
```

### Custom Configuration
```javascript
const pagination = usePagination(items, {
  initialPage: 1,
  itemsPerPage: 25,              // Start with 25 items per page
  pageSizeOptions: [10, 25, 50, 100]  // Custom page size options
});
```

## Pagination Component Props

### Required (spread from hook)
- `currentPage`, `totalPages`, `itemsPerPage`, `totalItems`
- `startItem`, `endItem`, `hasNextPage`, `hasPrevPage`
- `goToPage()`, `nextPage()`, `prevPage()`, `goToFirstPage()`, `goToLastPage()`
- `changeItemsPerPage()`, `getPageNumbers()`, `pageSizeOptions`

### Optional Display Settings
```jsx
<Pagination
  {...pagination}
  showFirstLast={true}   // Show first/last page buttons (default: true)
  showPageSize={true}    // Show page size selector (default: true)
  showInfo={true}        // Show "Showing X-Y of Z" text (default: true)
  compact={false}        // Use compact mode for mobile (default: false)
/>
```

## Compact Mode (Mobile)
```jsx
<Pagination
  {...pagination}
  compact={true}
  showFirstLast={false}
  showPageSize={false}
/>
```

## Available Methods

```javascript
const pagination = usePagination(items);

// Navigation
pagination.goToPage(5);           // Jump to specific page
pagination.nextPage();            // Go to next page
pagination.prevPage();            // Go to previous page
pagination.goToFirstPage();       // Go to first page
pagination.goToLastPage();        // Go to last page

// Configuration
pagination.changeItemsPerPage(50); // Change page size (resets to page 1)
pagination.reset();                // Reset to initial configuration

// State checks
pagination.hasNextPage;            // Boolean
pagination.hasPrevPage;            // Boolean
pagination.isEmpty;                // Boolean (no items)
pagination.totalItems;             // Number of total items
pagination.totalPages;             // Number of total pages
```

## Integration with Search

```jsx
import useSearch from '../hooks/useSearch';
import usePagination from '../hooks/usePagination';

function SearchPage() {
  const { results, search } = useSearch(searchFunction);
  const pagination = usePagination(results, {
    itemsPerPage: 20,
    pageSizeOptions: [10, 20, 50]
  });
  
  const handleSearch = async (filters) => {
    await search(filters);
    pagination.goToFirstPage(); // Reset to first page on new search
  };
  
  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {pagination.paginatedItems.map(item => (
        <ResultCard key={item.id} item={item} />
      ))}
      <Pagination {...pagination} />
    </div>
  );
}
```

## Styling

The pagination component uses 8-bit retro styling with these colors:
- **Active Button**: #52B788 (green)
- **Background**: #E0AC69 (tan/beige)
- **Border**: #2C2C2C (dark gray)
- **Text**: #FFFFFF (white) and #2C2C2C (dark gray)

To customize colors, edit:
`src/Component/Commons/Pagination.jsx`

## Page Size Options

Common configurations:
```javascript
// Small datasets (< 100 items)
pageSizeOptions: [5, 10, 20]

// Medium datasets (100-1000 items)
pageSizeOptions: [10, 25, 50, 100]

// Large datasets (> 1000 items)
pageSizeOptions: [25, 50, 100, 200]
```

## Tips

1. **Reset on new data**: Always call `goToFirstPage()` when loading new data
2. **Mobile optimization**: Use `compact={true}` for small screens
3. **Performance**: The hook uses `useMemo` for efficient re-renders
4. **Accessibility**: All buttons have proper titles/labels
5. **Empty state**: Use `pagination.isEmpty` to show "no results" message

## Files
- Hook: `src/hooks/usePagination.js`
- Component: `src/Component/Commons/Pagination.jsx`
- Examples: `src/hooks/usePagination.examples.js`
