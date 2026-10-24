import { Dialog, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const PixelModalTypography = styled(Typography)(() => ({
  fontFamily: "'Press Start 2P', cursive",
}));

export const PixelModalDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#F5F5F5',
  },
}));

export const PixelModalSelect = styled(Select)(() => ({
  borderRadius: 0,
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  border: '2px solid #2C2C2C',
}));

export const modalTitleRootSx: SxProps<Theme> = {
  backgroundColor: '#3D5A80',
  borderBottom: '4px solid #2C2C2C',
  p: 3,
};

export const modalTitleTextSx: SxProps<Theme> = {
  fontSize: { xs: '0.7rem', sm: '0.9rem' },
  color: '#FFFFFF',
};

export const modalContentSx: SxProps<Theme> = {
  backgroundColor: '#F5F5F5',
  pt: '24px !important',
};

export const modalLoaderSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  py: 4,
};

export const modalAlertSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '2px solid #2C2C2C',
};

export const modalInfoAlertSx: SxProps<Theme> = {
  ...modalAlertSx,
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.55rem',
};

export const modalInputLabelSx: SxProps<Theme> = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
};

export const modalMenuItemSx: SxProps<Theme> = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
};

export const modalFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
  },
};

export const modalActionsSx: SxProps<Theme> = {
  backgroundColor: '#52B788',
  borderTop: '4px solid #2C2C2C',
  p: 2,
  gap: 1,
  justifyContent: 'flex-end',
};

export const modalActionBtnBaseSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
};

export const modalCancelBtnSx: SxProps<Theme> = {
  ...modalActionBtnBaseSx,
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  '&:hover': { backgroundColor: '#F8F8F8' },
};

export const modalPrimaryBtnSx: SxProps<Theme> = {
  ...modalActionBtnBaseSx,
  backgroundColor: '#3D5A80',
  color: '#FFFFFF',
  '&:hover': { backgroundColor: '#2d4a70' },
  '&.Mui-disabled': { backgroundColor: '#999', color: '#ccc' },
};
