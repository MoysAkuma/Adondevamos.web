/**
 * Pagination Configuration and Usage Examples
 * 
 * This file demonstrates how to configure and use the pagination system
 */

// ============================================
// BASIC USAGE EXAMPLE
// ============================================

import usePagination from '../hooks/usePagination';
import Pagination from '../Component/Commons/Pagination';

function BasicPaginationExample() {
  const items = [/* your array of items */];
  
  // Default configuration (10 items per page)
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

// ============================================
// CUSTOM CONFIGURATION
// ============================================

function CustomConfigExample() {
  const items = [/* your array of items */];
  
  // Custom configuration
  const pagination = usePagination(items, {
    initialPage: 1,              // Start on page 1
    itemsPerPage: 20,            // Show 20 items per page
    pageSizeOptions: [10, 20, 50, 100]  // Available page sizes
  });
  
  return (
    <div>
      {pagination.paginatedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      <Pagination
        {...pagination}
        showFirstLast={true}    // Show first/last page buttons
        showPageSize={true}     // Show page size selector
        showInfo={true}         // Show "Showing X-Y of Z"
      />
    </div>
  );
}

// ============================================
// MOBILE/COMPACT MODE
// ============================================

function CompactPaginationExample() {
  const items = [/* your array of items */];
  const pagination = usePagination(items, {
    itemsPerPage: 5,
    pageSizeOptions: [5, 10]
  });
  
  return (
    <div>
      {pagination.paginatedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      {/* Compact mode - good for mobile */}
      <Pagination
        {...pagination}
        compact={true}           // Show only current page number
        showFirstLast={false}    // Hide first/last buttons
        showPageSize={false}     // Hide page size selector
      />
    </div>
  );
}

// ============================================
// LARGE DATASET WITH SEARCH
// ============================================

function SearchWithPaginationExample() {
  const { results, search } = useSearch(searchFunction);
  
  const pagination = usePagination(results, {
    itemsPerPage: 50,
    pageSizeOptions: [25, 50, 100, 200]
  });
  
  const handleSearch = async (filters) => {
    await search(filters);
    pagination.goToFirstPage(); // Reset to first page on new search
  };
  
  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      
      {pagination.isEmpty ? (
        <div>No results found</div>
      ) : (
        <>
          <div>
            {pagination.paginatedItems.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
          
          <Pagination {...pagination} />
        </>
      )}
    </div>
  );
}

// ============================================
// PROGRAMMATIC NAVIGATION
// ============================================

function ProgrammaticNavigationExample() {
  const items = [/* your array of items */];
  const pagination = usePagination(items);
  
  const handleJumpToPage = () => {
    pagination.goToPage(5); // Jump to page 5
  };
  
  const handleChangePageSize = () => {
    pagination.changeItemsPerPage(50); // Change to 50 items per page
  };
  
  const handleReset = () => {
    pagination.reset(); // Reset to initial state
  };
  
  return (
    <div>
      <button onClick={handleJumpToPage}>Go to Page 5</button>
      <button onClick={handleChangePageSize}>Show 50 per page</button>
      <button onClick={handleReset}>Reset</button>
      
      {/* Check pagination state */}
      {pagination.hasNextPage && <p>More pages available</p>}
      {pagination.hasPrevPage && <p>Previous pages available</p>}
      
      <Pagination {...pagination} />
    </div>
  );
}

// ============================================
// CONFIGURATION OPTIONS REFERENCE
// ============================================

/*
PAGINATION HOOK OPTIONS:
{
  initialPage: number,           // Starting page (default: 1)
  itemsPerPage: number,          // Items per page (default: 10)
  pageSizeOptions: number[]      // Available page sizes (default: [5, 10, 20, 50])
}

PAGINATION COMPONENT PROPS:
- currentPage: number             // Current active page
- totalPages: number              // Total number of pages
- itemsPerPage: number            // Current items per page
- pageSizeOptions: number[]       // Available page size options
- totalItems: number              // Total number of items
- startItem: number               // First item number on current page
- endItem: number                 // Last item number on current page
- hasNextPage: boolean            // Whether there's a next page
- hasPrevPage: boolean            // Whether there's a previous page
- goToPage: (page) => void        // Navigate to specific page
- nextPage: () => void            // Go to next page
- prevPage: () => void            // Go to previous page
- goToFirstPage: () => void       // Go to first page
- goToLastPage: () => void        // Go to last page
- changeItemsPerPage: (size) => void  // Change page size
- getPageNumbers: () => number[]  // Get array of page numbers to display
- showFirstLast: boolean          // Show first/last page buttons (default: true)
- showPageSize: boolean           // Show page size selector (default: true)
- showInfo: boolean               // Show info text (default: true)
- compact: boolean                // Use compact mode (default: false)
*/

// ============================================
// STYLING CUSTOMIZATION
// ============================================

// The pagination component uses 8-bit retro styling by default.
// You can customize colors by modifying the styled components in:
// src/Component/Commons/Pagination.jsx

// Colors used:
// - Primary: #52B788 (green)
// - Background: #E0AC69 (tan/beige)
// - Border: #2C2C2C (dark gray)
// - Text: #FFFFFF (white) and #2C2C2C (dark gray)
// - Disabled: #CCCCCC (light gray)
