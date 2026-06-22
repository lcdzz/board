import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export function BoardDetail() {
  const { id } = useParams();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Board</Typography>
      <Typography>Board ID: {id}</Typography>
      <Typography>Board view placeholder — implement details here.</Typography>
    </Container>
  );
}
