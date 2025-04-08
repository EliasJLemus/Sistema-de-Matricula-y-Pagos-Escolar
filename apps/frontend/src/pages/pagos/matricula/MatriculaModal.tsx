"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FormularioMatricula from "./FormularioMatricula"
import { useEffect, useState } from "react"

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

interface MatriculaModalProps {
  open: boolean
  onClose: () => void
  matriculaId?: string | number
  isEditing?: boolean
}

const MatriculaModal: React.FC<MatriculaModalProps> = ({
  open,
  onClose,
  matriculaId,
  isEditing = false,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [comprobanteUrl, setComprobanteUrl] = useState<string>("")
  const [loadingComprobante, setLoadingComprobante] = useState<boolean>(false)

  useEffect(() => {
    if (open && matriculaId) {
      setLoadingComprobante(true)

      // Simular fetch al backend
      setTimeout(() => {
        const simulatedUrl = "" // simula sin comprobante
        setComprobanteUrl(simulatedUrl)
        setLoadingComprobante(false)
      }, 1000)
    }
  }, [open, matriculaId])

  const handleAceptar = () => {
    console.log("✅ Comprobante aceptado")
  }

  const handleRechazar = () => {
    console.log("❌ Comprobante rechazado")
  }

  const handleEnviarFactura = () => {
    console.log("📤 Factura enviada")
  }

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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              ) : (
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
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
            {isEditing ? "Editar Matrícula" : "Registrar Matrícula"}
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

      <DialogContent sx={{ p: 3 }}>
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", lg: "row" },
      gap: 3,
      alignItems: "flex-start",
    }}
  >
    {/* 🧾 FORMULARIO */}
    <Box
      sx={{
        flex: 1,
        maxWidth: "850px",
        minWidth: { lg: "600px" },
      }}
    >
      <FormularioMatricula
        matriculaId={matriculaId}
        isEditing={isEditing}
        onClose={onClose}
      />
    </Box>

    {/* 📎 COMPROBANTE - SOLO SI ES EDICIÓN */}
    {isEditing && (
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3,
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#fff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily,
            fontWeight: 700,
            color: "#1A1363",
            mb: 2,
          }}
        >
          Comprobante Enviado
        </Typography>

        {loadingComprobante ? (
          <CircularProgress sx={{ color: "#538A3E", mb: 2 }} />
        ) : comprobanteUrl ? (
          <Box
            component="img"
            src={comprobanteUrl}
            alt="Comprobante"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 300,
              objectFit: "contain",
              borderRadius: "12px",
              mb: 3,
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
            }}
          />
        ) : (
          <Paper
            elevation={0}
            sx={{
              px: 3,
              py: 2,
              mb: 3,
              bgcolor: "#FFF3CD",
              color: "#856404",
              border: "1px solid #FFECB5",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            🛈 Comprobante no enviado
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleAceptar}
            sx={{
              bgcolor: "#4CAF50",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#3e8e41" },
            }}
          >
            ACEPTAR
          </Button>

          <Button
            variant="outlined"
            onClick={handleRechazar}
            sx={{
              borderColor: "#e53935",
              color: "#e53935",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#ffe6e6",
                borderColor: "#e53935",
              },
            }}
          >
            RECHAZAR
          </Button>

          <Button
            variant="contained"
            onClick={handleEnviarFactura}
            sx={{
              bgcolor: "#BDBDBD",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#9e9e9e" },
            }}
          >
            ENVIAR FACTURA
          </Button>
        </Box>
      </Paper>
    )}
  </Box>
</DialogContent>

    </Dialog>
  )
}

export default MatriculaModal
