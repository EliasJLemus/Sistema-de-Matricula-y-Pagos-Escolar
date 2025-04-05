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
import FormularioApoderado from './FormularioApoderado';

// Font family constant to match sidebar and topbar
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface ApoderadoModalProps {
  open: boolean;
  onClose: () => void;
  apoderadoId?: string | number;
  isEditing?: boolean;
}

const ApoderadoModal: React.FC<ApoderadoModalProps> = ({
  open,
  onClose,
  apoderadoId,
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
          borderRadius: '16px',
          bgcolor: 'rgba(249, 249, 249, 0.98)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(90deg, #1A1363 0%, #538A3E 100%)',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isEditing ? (
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              ) : (
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </>
              )}
            </svg>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily,
              fontWeight: 700,
              color: '#FFFFFF',
              m: 0,
            }}
          >
            {isEditing ? 'Editar Apoderado' : 'Registrar Apoderado'}
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#FFFFFF',
            position: 'absolute',
            right: '20px',
            '&:hover': {
              bgcolor: 'rgba(243, 130, 35, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <FormularioApoderado 
          apoderadoId={apoderadoId} 
          isEditing={isEditing} 
          isModal={true}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ApoderadoModal;