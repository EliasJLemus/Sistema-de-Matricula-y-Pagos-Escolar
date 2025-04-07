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
  Button,
  CircularProgress,
  Paper,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useState, useEffect } from "react"
import FormularioMensualidad from "./FormularioMensualidad"

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
  isEditing = false,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [comprobanteUrl, setComprobanteUrl] = useState<string>("")
  const [loadingComprobante, setLoadingComprobante] = useState<boolean>(false)

  useEffect(() => {
    if (open && mensualidadId) {
      setLoadingComprobante(true)

      // Simular fetch al backend
      setTimeout(() => {
        // 🔁 Simulá que esta URL viene del backend (ponela en blanco si querés simular que no hay imagen)
        const simulatedUrl = "" // o `https://api.miapp.com/comprobantes/${mensualidadId}.jpg`
        setComprobanteUrl(simulatedUrl)
        setLoadingComprobante(false)
      }, 1000)
    }
  }, [open, mensualidadId])

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
        <Typography variant="h6" sx={{ fontFamily, fontWeight: 700, color: "#FFFFFF" }}>
          {isEditing ? "Efectuar Pago de Mensualidad" : "Registrar Mensualidad"}
        </Typography>

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
            flexDirection: fullScreen ? "column" : "row",
            gap: 3,
          }}
        >
          {/* 📋 Formulario */}
          <Box sx={{ flex: 1 }}>
            <FormularioMensualidad
              mensualidadId={mensualidadId}
              isEditing={isEditing}
              onClose={onClose}
              comprobante={comprobanteUrl}
            />
          </Box>

          {/* 📎 Comprobante */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#fff",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
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

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
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
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default MensualidadModal
