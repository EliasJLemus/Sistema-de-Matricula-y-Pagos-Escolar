"use client";

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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormularioMatricula from "./FormularioMatricula";
import { useEffect, useState } from "react";
import {
  useGetMatriculaByUuid,
  useActualizarEstadoComprobante,
} from "@/lib/queries";
import FeedbackModal, {
  FeedbackStatus,
} from "@/components/FeedbackModal/FeedbackModal";

const fontFamily = "'Nunito', sans-serif";

interface MatriculaModalProps {
  open: boolean;
  onClose: () => void;
  matriculaId?: string | number;
  isEditing?: boolean;
}

const MatriculaModal: React.FC<MatriculaModalProps> = ({
  open,
  onClose,
  matriculaId,
  isEditing = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(null);

  const { data, isLoading } = useGetMatriculaByUuid(
    typeof matriculaId === "string" ? matriculaId : ""
  );

  useEffect(() => {
    if (data?.data?.url_imagen) {
      setComprobanteUrl(`http://localhost:3000${data.data.url_imagen}`);
    }
  }, [data]);

  const { mutate: actualizarEstado } = useActualizarEstadoComprobante();
  const [feedback, setFeedback] = useState<{
    open: boolean;
    status: FeedbackStatus;
    title: string;
    description: string;
  }>({ open: false, status: "loading", title: "", description: "" });

  const handleActualizarEstado = (estado: "Aceptado" | "Rechazado") => {
    if (typeof matriculaId !== "string") return;

    setFeedback({
      open: true,
      status: "loading",
      title: "Actualizando estado...",
      description: "Por favor espera un momento.",
    });

    actualizarEstado(
      { uuid: matriculaId, estado },
      {
        onSuccess: () => {
          setFeedback({
            open: true,
            status: "success",
            title: "¡Éxito!",
            description: `Comprobante ${estado.toLowerCase()} correctamente.`,
          });
        },
        onError: (err: any) => {
          setFeedback({
            open: true,
            status: "error",
            title: "Error",
            description: err.message || "No se pudo actualizar el comprobante.",
          });
        },
      }
    );
  };

  return (
    <>
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
        {/* HEADER */}
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
            <Typography
              variant="h6"
              sx={{ fontFamily, fontWeight: 700, color: "#FFFFFF" }}
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

        {/* CONTENT */}
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FormularioMatricula
                matriculaId={matriculaId}
                isEditing={isEditing}
                isModal={true}
                onClose={onClose}
              />
            </Box>

            {isEditing && (
              <Paper
                elevation={3}
                sx={{
                  width: { xs: "100%", lg: "380px" },
                  flexShrink: 0,
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
                  sx={{ fontFamily, fontWeight: 700, color: "#1A1363", mb: 2 }}
                >
                  Comprobante Enviado
                </Typography>

                {isLoading ? (
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
                    onClick={() => handleActualizarEstado("Aceptado")}
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
                    onClick={() => handleActualizarEstado("Rechazado")}
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

      <FeedbackModal
        open={feedback.open}
        status={feedback.status}
        title={feedback.title}
        description={feedback.description}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default MatriculaModal;
