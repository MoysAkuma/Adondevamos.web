/**
 * ResetPassword.styles.ts
 * Styled components specific to the ResetPassword page.
 * Shared 8-bit tokens come from './pixel.styles'.
 */

import { Button, Card, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// ─── Styled Components ────────────────────────────────────────────────────────

/**
 * Narrow centered container with top margin offset.
 * Used without CenteredTemplate — the marginTop provides vertical spacing.
 */
export const StyledResetContainer = styled(Container)(({ theme }) => ({
  maxWidth: '500px !important',
  margin: '0 auto',
  padding: theme.spacing(2),
  marginTop: theme.spacing(8),
}));

/** Plain white card for the reset form. */
export const StyledResetCard = styled(Card)(() => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#FFFFFF',
}));

/**
 * Bold uppercase 8-bit action button with a press-down translate effect.
 * Different from PixelButton and LoginButton — heavier border, uppercase text.
 */
export const ResetButton = styled(Button)(() => ({
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  '&:hover': {
    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
  },
  '&:active': {
    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
    transform: 'translate(2px, 2px)',
  },
}));
