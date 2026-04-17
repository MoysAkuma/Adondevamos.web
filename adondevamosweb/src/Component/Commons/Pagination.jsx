import React from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FirstPage,
  LastPage,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';

// 8-bit styled components
const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#E0AC69',
  border: '4px solid #2C2C2C',
  borderRadius: 0,
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginTop: theme.spacing(2)
}));

const PaginationRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1)
}));

const PageButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  alignItems: 'center',
  flexWrap: 'wrap'
}));

const PixelButton = styled(Button)(({ theme, active }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  minWidth: '40px',
  minHeight: '40px',
  border: '3px solid #2C2C2C',
  borderRadius: 0,
  boxShadow: active ? 'inset 4px 4px 0px rgba(0,0,0,0.3)' : '4px 4px 0px rgba(0,0,0,0.3)',
  backgroundColor: active ? '#52B788' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#2C2C2C',
  '&:hover': {
    backgroundColor: active ? '#52B788' : '#F0F0F0',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
  },
  '&:disabled': {
    backgroundColor: '#CCCCCC',
    color: '#888888',
    border: '3px solid #999999'
  },
  padding: theme.spacing(1)
}));

const PixelIconButton = styled(IconButton)(({ theme }) => ({
  border: '3px solid #2C2C2C',
  borderRadius: 0,
  boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  '&:hover': {
    backgroundColor: '#F0F0F0',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
  },
  '&:disabled': {
    backgroundColor: '#CCCCCC',
    color: '#888888',
    border: '3px solid #999999'
  }
}));

const PixelSelect = styled(Select)(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  border: '3px solid #2C2C2C',
  borderRadius: 0,
  backgroundColor: '#FFFFFF',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  color: '#2C2C2C'
}));

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  pageSizeOptions = [5, 10, 20, 50],
  totalItems,
  startItem,
  endItem,
  hasNextPage,
  hasPrevPage,
  goToPage,
  nextPage,
  prevPage,
  goToFirstPage,
  goToLastPage,
  changeItemsPerPage,
  getPageNumbers,
  showFirstLast = true,
  showPageSize = true,
  showInfo = true,
  compact = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pageNumbers = getPageNumbers();

  if (totalItems === 0) {
    return null;
  }

  return (
    <PaginationContainer>
      {/* Info Row */}
      {showInfo && (
        <PaginationRow sx={{ justifyContent: 'center' }}>
          <InfoTypography>
            Showing {startItem}-{endItem} of {totalItems}
          </InfoTypography>
        </PaginationRow>
      )}

      {/* Navigation Row */}
      <PaginationRow sx={{ justifyContent: 'center' }}>
        <PageButtonsContainer>
          {/* First Page */}
          {showFirstLast && !isMobile && (
            <PixelIconButton
              onClick={goToFirstPage}
              disabled={!hasPrevPage}
              size="small"
              title="First Page"
            >
              <FirstPage />
            </PixelIconButton>
          )}

          {/* Previous Page */}
          <PixelIconButton
            onClick={prevPage}
            disabled={!hasPrevPage}
            size="small"
            title="Previous Page"
          >
            <NavigateBefore />
          </PixelIconButton>

          {/* Page Numbers */}
          {!compact && pageNumbers.map((pageNum) => (
            <PixelButton
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              active={pageNum === currentPage ? 1 : 0}
              size="small"
            >
              {pageNum}
            </PixelButton>
          ))}

          {/* Compact mode - show current page */}
          {compact && (
            <InfoTypography sx={{ mx: 1 }}>
              {currentPage} / {totalPages}
            </InfoTypography>
          )}

          {/* Next Page */}
          <PixelIconButton
            onClick={nextPage}
            disabled={!hasNextPage}
            size="small"
            title="Next Page"
          >
            <NavigateNext />
          </PixelIconButton>

          {/* Last Page */}
          {showFirstLast && !isMobile && (
            <PixelIconButton
              onClick={goToLastPage}
              disabled={!hasNextPage}
              size="small"
              title="Last Page"
            >
              <LastPage />
            </PixelIconButton>
          )}
        </PageButtonsContainer>
      </PaginationRow>

      {/* Page Size Selector */}
      {showPageSize && (
        <PaginationRow sx={{ justifyContent: 'center' }}>
          <FormControl size="small">
            <PixelSelect
              value={itemsPerPage}
              onChange={(e) => changeItemsPerPage(e.target.value)}
              sx={{ minWidth: 100 }}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size} sx={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}>
                  {size} per page
                </MenuItem>
              ))}
            </PixelSelect>
          </FormControl>
        </PaginationRow>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
