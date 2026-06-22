import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import i18n from '../i18n';

export function NavBar() {
  const { t } = useTranslation();

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">
            {t('home')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/boards" sx={{ flexGrow: 1 }}>
            {t('boards')}
          </Button>
        </Box>

        <Button color="inherit" onClick={() => changeLang('en')}>
          EN
        </Button>
        <Button color="inherit" onClick={() => changeLang('fr')}>
          FR
        </Button>
      </Toolbar>
    </AppBar>
  );
}
