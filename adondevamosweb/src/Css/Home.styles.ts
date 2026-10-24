/**
 * Home.styles.ts
 * Styled components specific to the Home page and its sub-components.
 * For shared 8-bit design tokens, import from './pixel.styles'.
 */

import { Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Re-export shared styles so existing imports from this file keep working.
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

// ─── Custom prop interfaces ───────────────────────────────────────────────────

export interface StyledStepCardProps {
  cardcolor?: string;
}

export interface StyledAvatarProps {
  avatarcolor?: string;
}

// ─── Home-specific styled components ─────────────────────────────────────────

/** Card used inside StepCard — supports a per-instance background color. */
export const StyledStepCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'cardcolor',
})<StyledStepCardProps>(({ theme, cardcolor }) => ({
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  backgroundColor: cardcolor || '#E0AC69',
  padding: theme.spacing(2),
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '10px 10px 0px rgba(0,0,0,0.3)',
  },
  transition: 'all 0.2s ease-in-out',
}));

/** Avatar used inside StepCard — supports a per-instance background color. */
export const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'avatarcolor',
})<StyledAvatarProps>(({ avatarcolor }) => ({
  backgroundColor: avatarcolor || '#3D5A80',
  border: '2px solid #2C2C2C',
  borderRadius: 0,
  width: 45,
  height: 45,
}));
