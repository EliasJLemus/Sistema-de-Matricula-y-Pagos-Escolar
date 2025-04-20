import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormularioBecas from './FormularioBecas';

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface BecasModalProps {
  open: boolean;
  onClose: () => void;
  becaId?: string; // Usamos directamente el UUID
  isEditing?: boolean;
}

const BecasModal: React.FC<BecasModalProps> = ({
  open,
  onClose,
  becaId,
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
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: '#f8f9fa',
          boxShadow: '0px 8px 30px rgba(26, 19, 99, 0.15)',
          overflow: 'hidden',
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(26, 19, 99, 0.3)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A1363 0%, #538A3E 100%)',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="span" sx={{ 
            display: 'inline-flex',
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            p: 1,
            borderRadius: '8px'
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FFFFFF"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
            </svg>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily,
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: '1.25rem',
            }}
          >
            {isEditing ? 'Editar Beca' : 'Nueva Beca'}
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#FFFFFF',
            position: 'absolute',
            right: '16px',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <FormularioBecas
          becaId={becaId} // Pasamos el UUID directamente
          isEditing={isEditing}
          isModal={true}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BecasModal;
