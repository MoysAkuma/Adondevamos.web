import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AccountCircle } from '@mui/icons-material';

// Styled components for 8-bit retro design
const StyledAvatar = styled(Avatar)(({ theme, size = 'medium' }) => {
  const sizes = {
    small: { width: 32, height: 32, fontSize: '0.875rem', border: '2px solid #2C2C2C' },
    medium: { width: 40, height: 40, fontSize: '1rem', border: '2px solid #2C2C2C' },
    large: { width: 56, height: 56, fontSize: '1.25rem', border: '3px solid #2C2C2C' },
    xlarge: { width: 80, height: 80, fontSize: '1.75rem', border: '4px solid #2C2C2C' }
  };

  return {
    ...sizes[size],
    borderRadius: 0,
    backgroundColor: '#E63946',
    color: '#FFFFFF',
    fontFamily: "'Press Start 2P', cursive",
    fontWeight: 700,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translate(-2px, -2px)',
      boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: sizes[size].width * 0.7,
    },
  };
});

const getInitials = (name, tag) => {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (tag && tag.trim()) {
    return tag[0].toUpperCase();
  }
  return '?';
};

const getAvatarColor = (name, tag) => {
  const colors = [
    '#E63946', // Red
    '#F77F00', // Orange
    '#FCBF49', // Yellow
    '#52B788', // Green
    '#3D5A80', // Blue
    '#6B5B95', // Purple
    '#D62828', // Crimson
    '#2A9D8F', // Teal
  ];
  
  const text = name || tag || '';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * UserAvatar - A reusable avatar component for displaying user/member images
 * 
 * @param {Object} props
 * @param {string} [props.src] - Image URL (optional)
 * @param {string} [props.name] - User's full name (used for initials)
 * @param {string} [props.tag] - User's tag/username (fallback for initials)
 * @param {string} [props.size='medium'] - Size: 'small', 'medium', 'large', 'xlarge'
 * @param {string} [props.alt] - Alt text for image
 * @param {Object} [props.sx] - Additional MUI sx styles
 * @param {boolean} [props.showIcon=true] - Show AccountCircle icon if no image/name
 */
function UserAvatar({ 
  src, 
  name, 
  tag, 
  size = 'medium', 
  alt, 
  sx = {},
  showIcon = true,
  ...otherProps 
}) {
  const initials = getInitials(name, tag);
  const bgColor = getAvatarColor(name, tag);
  const displayAlt = alt || name || tag || 'User';

  // If we have an image URL, use it
  if (src) {
    return (
      <StyledAvatar
        src={src}
        alt={displayAlt}
        size={size}
        sx={{ 
          backgroundColor: bgColor,
          ...sx 
        }}
        {...otherProps}
      />
    );
  }

  // If we have name or tag, show initials
  if (name || tag) {
    return (
      <StyledAvatar
        alt={displayAlt}
        size={size}
        sx={{ 
          backgroundColor: bgColor,
          ...sx 
        }}
        {...otherProps}
      >
        {initials}
      </StyledAvatar>
    );
  }

  // Fallback to icon
  return (
    <StyledAvatar
      alt={displayAlt}
      size={size}
      sx={{ 
        backgroundColor: bgColor,
        ...sx 
      }}
      {...otherProps}
    >
      {showIcon && <AccountCircle />}
    </StyledAvatar>
  );
}

export default UserAvatar;
