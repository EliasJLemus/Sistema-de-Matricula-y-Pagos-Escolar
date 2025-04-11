import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormularioUsuario, { UsuarioFormData } from './FormularioUsuario';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioFormData) => void;
  initialData?: UsuarioFormData;
}

const UsuarioModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Usuario' : 'Crear Usuario'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormularioUsuario onSubmit={onSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};

export default UsuarioModal;
