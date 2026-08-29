import React from 'react';
import { Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { PixelTypography } from '../../Css/pixel.styles';
import { StyledAvatar, StyledStepCard } from '../../Css/Home.styles';

// ─── Interface ───────────────────────────────────────────────────────────────

export interface StepCardProps {
  icon: SvgIconComponent;
  title: string;
  subtitle: string;
  cardColor?: string;
  avatarColor?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const StepCard: React.FC<StepCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  cardColor,
  avatarColor,
}) => (
  <StyledStepCard cardcolor={cardColor}>
    <StyledAvatar avatarcolor={avatarColor}>
      <Icon sx={{ fontSize: 28, color: '#FFFFFF' }} />
    </StyledAvatar>
    <Box>
      <PixelTypography
        variant="subtitle1"
        sx={{ fontSize: '0.7rem', color: '#2C2C2C', mb: 1 }}
      >
        {title}
      </PixelTypography>
      <PixelTypography
        variant="body2"
        sx={{ fontSize: '0.5rem', color: '#2C2C2C', lineHeight: 1.4 }}
      >
        {subtitle}
      </PixelTypography>
    </Box>
  </StyledStepCard>
);

export default StepCard;
