import { api } from '@core/api';
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Button, TextInput } from '@shared/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

type Board = {
  id: string;
  name: string;
  createdDtUtc: string;
  lastUpdatedDtUtc: string;
};

export function Boards() {
  const { t } = useTranslation();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const boards = await api.get<Board[]>('/boards');
      setBoards(boards);
    } catch (err) {
      setError(t('boardsLoadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => {
    setDialogOpen(false);
    setNewName('');
  };

  const createBoard = async () => {
    if (!newName) return;
    try {
      await api.post('/boards', { name: newName });
      await fetchBoards();
      closeDialog();
    } catch (err) {
      setError(t('boardCreateError'));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{t('boards')}</Typography>
        <Button variant="contained" onClick={openDialog} disabled={loading}>
          {t('create')}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('createdDt')}</TableCell>
            <TableCell>{t('lastUpdatedDt')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.map((b) => (
            <TableRow key={b.id} hover component={RouterLink} to={`/boards/${b.id}`} style={{ textDecoration: 'none' }}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{new Date(b.createdDtUtc).toLocaleString()}</TableCell>
              <TableCell>{new Date(b.lastUpdatedDtUtc).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('create')}</DialogTitle>
        <DialogContent>
          <TextInput
            autoFocus
            margin="dense"
            label={t('createBoardPrompt')}
            value={newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t('cancel') || 'Cancel'}</Button>
          <Button variant="contained" onClick={createBoard} disabled={!newName}>
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
