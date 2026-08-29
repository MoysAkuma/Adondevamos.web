/**
 * Profile.styles.ts
 * Styled components and TypeScript interfaces for the Profile page.
 * Shared 8-bit tokens come from './pixel.styles'.
 */

import { Card, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Re-export shared tokens so the page has a single import source.
export {
  PixelTypography,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledContentCard,
  StyledContentArea,
} from './pixel.styles';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface UserCity {
  id?: string;
  name: string;
}

export interface UserState {
  id?: string;
  name: string;
}

export interface UserCountry {
  id?: string;
  name?: string;
  acronym: string;
}

/** Shape of the user object returned by GET /Users/:id */
export interface UserInfo {
  id?: string;
  tag: string;
  email: string;
  name: string;
  lastname?: string;
  lastName?: string;
  description?: string;
  thumbnail?: string | null;
  City: UserCity;
  State: UserState;
  Country: UserCountry;
}

export interface VoteCounts {
  trips: number;
  places: number;
}

/** Shape of the profile data returned by GET /Users/:id/Profile */
export interface ProfileData {
  createdTrips: unknown[];
  votedTrips: unknown[];
  voteCounts: VoteCounts;
}

// ─── Profile-specific styled components ──────────────────────────────────────

/** Centered container — Profile uses 600 px instead of the default 800 px. */
export const StyledProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '600px !important',
  margin: '0 auto',
  padding: theme.spacing(2),
}));

/** Full-width loading state card with a green background. */
export const StyledLoadingCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#52B788',
  padding: theme.spacing(4),
  textAlign: 'center',
}));
