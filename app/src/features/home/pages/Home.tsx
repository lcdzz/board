import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}
      </Typography>
      <Typography>{t('welcomeMessage')}</Typography>
    </Container>
  );
}
