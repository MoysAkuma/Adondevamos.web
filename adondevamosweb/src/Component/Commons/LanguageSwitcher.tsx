import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage?.split('-')[0] || 'en';

  return (
    <FormControl size="small" sx={{ minWidth: 110, ml: 1 }}>
      <Select
        value={language}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        inputProps={{ 'aria-label': t('language.select') }}
        sx={{ fontSize: '0.65rem' }}
      >
        <MenuItem value="en">{t('language.english')}</MenuItem>
        <MenuItem value="es">{t('language.spanish')}</MenuItem>
      </Select>
    </FormControl>
  );
}
