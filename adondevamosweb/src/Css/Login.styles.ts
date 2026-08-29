/**
 * Login.styles.ts
 * Styled components specific to the Login page.
 * Shared 8-bit tokens come from './pixel.styles'.
 */

import { Container, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Re-export shared tokens used in Login so the page has a single import source.
export {
  PixelTypography,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledContentCard,
  StyledContentArea,
} from './pixel.styles';

// ─── Login-specific styled components ────────────────────────────────────────

/** Narrow centered container — Login uses 500 px instead of the default 800 px. */
export const StyledLoginContainer = styled(Container)(({ theme }) => ({
  maxWidth: '500px !important',
  margin: '0 auto',
  padding: theme.spacing(2),
}));

/**
 * 8-bit press-down button for primary login actions.
 * Different from PixelButton — uses a translate-on-press effect.
 */
export const LoginButton = styled('button')(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'all 0.1s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
  },
  '&:active': {
    transform: 'translate(4px, 4px)',
    boxShadow: 'none',
  },
}));

/** Pixel-art styled TextField — shared between the email and password fields. */
export const PixelTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    border: '3px solid #2C2C2C',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: '#F8F9FA',
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#2C2C2C',
  },
}));
