/**
 * MainTrips.styles.ts
 * Styled components and interfaces specific to the MainTrips page.
 * Shared 8-bit tokens come from './pixel.styles'.
 */

import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Re-export shared tokens so the page has a single import source.
export {
  PixelTypography,
  StyledContainer,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledSectionCard,
  StyledSectionHeader,
  StyledSectionContent,
  PixelButton as StyledButton,
} from './pixel.styles';

// ─── Interfaces ───────────────────────────────────────────────────────────────

/** Shape of a trip item returned by the ranking API. */
export interface RankingTrip {
  id: string;
  name: string;
  votes: number;
  position?: number;
}

/** Snackbar notification state used across page-level components. */
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// ─── MainTrips-specific styled components ─────────────────────────────────────

/**
 * Compact toggle button shown in section headers to collapse/expand content.
 * Smaller font and padding than PixelButton.
 */
export const ToggleButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
  padding: theme.spacing(0.5, 1),
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-1px)',
    boxShadow: '2px 2px 0px #2C2C2C',
  },
  transition: 'all 0.2s ease-in-out',
}));
