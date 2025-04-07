"use client"

import type React from "react"
import { Dialog, DialogContent, IconButton, Box, useTheme, useMediaQuery, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FormularioMensualidad from "./FormularioMensualidad" // Asegúrate de tener este componente

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

interface MensualidadModalProps {
  open: boolean
  onClose: () => void
  mensualidadId?: string | number
  isEditing?: boolean
}

const MensualidadModal: React.FC<MensualidadModalProps> = ({ 
  open, 
  onClose, 
  mensualidadId, 
  isEditing = false 
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "rgba(249, 249, 249, 0.98)",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(90deg, #1A1363 0%, #538A3E 100%)",
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="span" sx={{ display: "inline-flex", mr: 1 }}>
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0l5.59-5.59a.996.996 0 1 0-1.41-1.41z"/>
              ) : (
                <>
                  <path d="M8 17l4 4 8-8"/>
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>
                </>
              )}
            </svg>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily,
              fontWeight: 700,
              color: "#FFFFFF",
              m: 0,
            }}
          >
            {isEditing ? "Efectuar Pago de Mensualidad" : "Registrar Mensualidad"}
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#FFFFFF",
            position: "absolute",
            right: "20px",
            "&:hover": {
              bgcolor: "rgba(243, 130, 35, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <FormularioMensualidad 
          mensualidadId={mensualidadId} 
          isEditing={isEditing} 
          onClose={onClose} 
        />
      </DialogContent>
    </Dialog>
  )
}

export default MensualidadModal