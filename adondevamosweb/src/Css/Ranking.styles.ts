/**
 * Ranking.styles.ts
 * Styled components and interfaces specific to the RankingPage.
 * Shared 8-bit tokens come from './pixel.styles'.
 */

import { Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

// Re-export shared tokens so the page has a single import source.
export {
  PixelTypography,
  StyledContainer,
  StyledSectionCard,
} from './pixel.styles';

// ─── Interfaces ───────────────────────────────────────────────────────────────

/** Valid entity types accepted by the ranking route parameter. */
export type RankingEntityType = 'places' | 'trips' | 'itineraries';

// ─── Ranking-specific styled components ──────────────────────────────────────

/**
 * Gold header card — unique to the Rankings page.
 * Override backgroundColor via sx for per-entity accent if needed.
 */
export const StyledRankingHeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#FFD700',
}));

/** Header content area — blue background with dark text (inverted from default). */
export const StyledRankingHeaderContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#3D5A80',
  color: '#2C2C2C',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

/** Section content with light gray background instead of the default sand color. */
export const StyledRankingContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));
