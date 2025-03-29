import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormularioEstudiante from './FormularioEstudiante';

// Font family constant to match sidebar and topbar
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface EstudianteModalProps {
  open: boolean;
  onClose: () => void;
  estudianteId?: string | number;
  isEditing?: boolean;
}

const EstudianteModal: React.FC<EstudianteModalProps> = ({
  open,
  onClose,
  estudianteId,
  isEditing = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          bgcolor: 'rgba(249, 249, 249, 0.98)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden'
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          fontFamily, 
          fontWeight: 700, 
          fontSize: '1.25rem',
          color: '#1A1363',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 2,
          px: 3,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ mr: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              {isEditing ? 
                <path d="M22 12.5l-3 3-3-3"></path> :
                <>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </>
              }
            </svg>
          </Box>
          {isEditing ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              color: 'grey.800'
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <FormularioEstudiante 
          estudianteId={estudianteId} 
          isEditing={isEditing} 
          isModal={true}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EstudianteModal;