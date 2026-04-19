import { useState, useCallback, useMemo } from 'react';

/**
 * Reusable pagination hook
 * @param {Array} items - Array of items to paginate
 * @param {Object} config - Configuration options
 * @param {number} config.initialPage - Starting page (default: 1)
 * @param {number} config.itemsPerPage - Items per page (default: 10)
 * @param {number[]} config.pageSizeOptions - Available page size options (default: [5, 10, 20, 50])
 * @returns {Object} - Pagination state and methods
 */
export const usePagination = (items = [], config = {}) => {
  const {
    initialPage = 1,
    itemsPerPage: initialItemsPerPage = 10,
    pageSizeOptions = [5, 10, 20, 50]
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage) || 1,
    [items.length, itemsPerPage]
  );

  // Calculate current items to display
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Calculate range info
  const startItem = useMemo(
    () => Math.min((currentPage - 1) * itemsPerPage + 1, items.length),
    [currentPage, itemsPerPage, items.length]
  );

  const endItem = useMemo(
    () => Math.min(currentPage * itemsPerPage, items.length),
    [currentPage, itemsPerPage, items.length]
  );

  // Navigation methods
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Change items per page
  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Reset pagination
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setItemsPerPage(initialItemsPerPage);
  }, [initialPage, initialItemsPerPage]);

  // Get page numbers for pagination UI
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return {
    // Data
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    pageSizeOptions,
    totalItems: items.length,
    startItem,
    endItem,
    
    // Computed
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isEmpty: items.length === 0,
    
    // Methods
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    changeItemsPerPage,
    reset,
    getPageNumbers
  };
};

export default usePagination;
