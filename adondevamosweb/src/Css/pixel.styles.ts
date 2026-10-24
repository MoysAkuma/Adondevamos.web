/**
 * pixel.styles.ts
 * Shared 8-bit / pixel-art design system for all pages.
 * Import from here instead of redefining in every page file.
 */

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// ─── Typography ──────────────────────────────────────────────────────────────

/** "Press Start 2P" pixel typography — use in place of Typography everywhere. */
export const PixelTypography = styled(Typography)(() => ({
  fontFamily: "'Press Start 2P', cursive",
}));

// ─── Layout ──────────────────────────────────────────────────────────────────

/**
 * Centered page container with max-width guard.
 * Override `maxWidth` via `sx` prop when a page needs a different width.
 */
export const StyledContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(2),
}));

// ─── Header Card ─────────────────────────────────────────────────────────────

/** 8-bit page header card. Override `backgroundColor` via `sx` for per-page accent colors. */
export const StyledHeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#3D5A80',
}));

/** Content area inside the header card. */
export const StyledHeaderContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#3D5A80',
  color: '#FFFFFF',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

// ─── Section Card ─────────────────────────────────────────────────────────────

/** 8-bit section block. Repeatable building block for page sections. */
export const StyledSectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
}));

/** Colored title bar at the top of a section card. Flex row — add end content (e.g. toggle buttons) as siblings. */
export const StyledSectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#52B788',
  padding: theme.spacing(2),
  borderBottom: '4px solid #2C2C2C',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

/** Content area inside a section card. */
export const StyledSectionContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#E0AC69',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

// ─── Content Card ────────────────────────────────────────────────────────────

/** Main content card (warm sand background). Used for form and detail areas. */
export const StyledContentCard = styled(Card)(() => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#E0AC69',
}));

/** Content area inside a content card. Uses larger padding (spacing 3). */
export const StyledContentArea = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#E0AC69',
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

// ─── Button ──────────────────────────────────────────────────────────────────

/** 8-bit pixel-art action button. */
export const PixelButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-2px)',
    boxShadow: '3px 3px 0px #2C2C2C',
  },
  transition: 'all 0.2s ease-in-out',
}));
