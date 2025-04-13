"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { useGetMatriculaPagos, useCrearMatricula, useGetMatriculaByUuid, useGetVistaDetalleMatricula } from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";
import FeedbackModal, { FeedbackStatus } from "@/components/FeedbackModal/FeedbackModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const fontFamily = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface FormularioMatriculaProps {
  matriculaId?: string | number;
  isEditing?: boolean;
  onClose: () => void;
}

const FormularioMatricula: React.FC<FormularioMatriculaProps> = ({
  matriculaId,
  isEditing = false,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const { data: dataMatricula, isLoading: isLoadingMatricula } = useGetMatriculaByUuid(
    typeof matriculaId === "string" ? matriculaId : ""
  );

  const {
    data: vistaDetalleMatricula,
    refetch: refetchDetalleMatricula
  } = useGetVistaDetalleMatricula(uuidEstudianteSeleccionado);
  
  const { data, isLoading: isLoadingLista } = useGetMatriculaPagos({
    page: 1,
    limit: 100,
    grado: gradoSeleccionado,
    year: new Date().getFullYear(),
  });

  const { mutate: crearMatricula } = useCrearMatricula();

  const estudiantesFiltrados = data?.data.filter(
    (e) => e.uuid_estudiante && e.nombre_estudiante
  );

  useEffect(() => {
    
    setGradoSeleccionado(dataMatricula?.data.grado || "");
    setUuidEstudianteSeleccionado(dataMatricula?.data.uuid_estudiante || "");
    if (
      isEditing &&
      dataMatricula?.data &&
      vistaDetalleMatricula?.data
    ) {
      const matricula = dataMatricula.data;
      const detalle = vistaDetalleMatricula.data;
  
      setFormData({
        tipo_pago: detalle.tipo_pago,
        grado: matricula.grado,
        fecha_matricula: matricula.fecha_matricula?.substring(0, 10),
        descripcion: matricula.descripcion,
        periodicidad: matricula.periodicidad,
        codigo_encargado_principal: matricula.codigo_encargado_principal || "",
        nombre_estudiante: matricula.nombre_estudiante || "",
        tarifa_base: matricula.tarifa_base,
        codigo_plan_detallado: detalle.codigo_plan_detallado,
        codigo_plan_matricula: detalle.codigo_plan_matricula,
        tarifa_plan_matricula: detalle.tarifa_plan_matricula,
        vencimiento: detalle.vencimiento,
        tipo_plan_matricula: detalle.tipo_plan_matricula,
        nivel_plan_matricula: detalle.nivel_plan_matricula,
        year_plan_matricula: detalle.year_plan_matricula,
        nombre_beca: detalle.nombre_beca,
        descuento: detalle.descuento,
        codigo_beca: detalle.codigo_beca,
        total_matricula: detalle.total_matricula,
      });
    }
  }, [isEditing, dataMatricula?.data, vistaDetalleMatricula?.data]);
  
  

  useEffect(() => {
    if (!isEditing && uuidEstudianteSeleccionado && vistaDetalleMatricula?.data) {
      const estudiante = estudiantesFiltrados?.find(
        (est) => est.uuid_estudiante === uuidEstudianteSeleccionado
      );
  
      if (estudiante) {
        setFormData({
          ...estudiante,
          fecha_matricula: new Date().toISOString().split("T")[0],
          uuid_matricula: estudiante.uuid_matricula,
          codigo_plan_detallado: vistaDetalleMatricula.data.codigo_plan_detallado,
          codigo_plan_matricula: vistaDetalleMatricula.data.codigo_plan_matricula,
          tarifa_plan_matricula: vistaDetalleMatricula.data.tarifa_plan_matricula,
          vencimiento: vistaDetalleMatricula.data.vencimiento,
          tipo_plan_matricula: vistaDetalleMatricula.data.tipo_plan_matricula,
          nivel_plan_matricula: vistaDetalleMatricula.data.nivel_plan_matricula,
          year_plan_matricula: vistaDetalleMatricula.data.year_plan_matricula,
          nombre_beca: vistaDetalleMatricula.data.nombre_beca,
          descuento: vistaDetalleMatricula.data.descuento,
          codigo_beca: vistaDetalleMatricula.data.codigo_beca,
          total_matricula: vistaDetalleMatricula.data.total_matricula,
        });
      }
    }
  }, [uuidEstudianteSeleccionado, vistaDetalleMatricula]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "grado") {
      setGradoSeleccionado(value);
      setUuidEstudianteSeleccionado("");
      setFormData({});
    } else if (name === "uuid_estudiante") {
      setUuidEstudianteSeleccionado(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.uuid_estudiante) newErrors.uuid_estudiante = "Seleccione un estudiante.";
    if (!formData.fecha_matricula) newErrors.fecha_matricula = "Seleccione una fecha.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSnackbarClose = () => {
    setAlertOpen(false);
    if (alertSeverity === "success") {
      onClose?.();
      navigate("/pagos/matricula");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage("Faltan campos obligatorios.");
      setAlertOpen(true);
      return;
    }

    setIsSubmitting(true);
    setModalOpen(true);
    setModalStatus("loading");
    setModalTitle("Registrando...");
    setModalDescription("Estamos registrando la matrícula...");

    crearMatricula(
      {
        uuid_estudiante: formData.uuid_estudiante!,
        fecha_matricula: formData.fecha_matricula!,
      },
      {
        onSuccess: (res: any) => {
          setIsSubmitting(false);
          if (res.success) {
            setModalStatus("success");
            setModalTitle("¡Matrícula registrada!");
            setModalDescription(res.data);
            queryClient.invalidateQueries({ queryKey: ["getMatriculas"] });
          } else {
            setModalStatus("error");
            setModalTitle("Error");
            setModalDescription(res.message);
          }
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          setModalStatus("error");
          setModalTitle("Error");
          setModalDescription(error.message || "Error al registrar la matrícula.");
        },
      }
    );
  };

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363 !important",
      "&.Mui-focused": {
        color: "#1A1363 !important",
      },
    },
    "& .MuiInputLabel-shrink": {
      color: "#1A1363 !important",
    },
    "& .MuiInputBase-root": {
      fontFamily,
      borderRadius: "12px",
      backgroundColor: "#f8f9fa",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
        borderWidth: "2px",
      },
    },
    "& .MuiFormHelperText-root": {
      fontFamily,
      color: "#f44336",
    },
  };

  // Estilos comunes para FormControl
  const formControlStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiFormLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiSelect-select": {
      fontFamily,
      backgroundColor: "#f8f9fa",
    },
    "& .MuiRadio-root": {
      color: "#4d4d4d",
    },
    "& .Mui-checked": {
      color: "#538A3E",
    },
    "& .MuiInputBase-root": {
      borderRadius: "12px",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 10px rgba(26, 19, 99, 0.1)",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "#f44336",
      },
      "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#f44336",
      },
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#e7f5e8",
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#f44336",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336",
    },
  };

  // Estilo para botón primario verde
  const primaryButtonStyle = {
    bgcolor: "#538A3E",
    fontFamily,
    textTransform: "none",
    borderRadius: "12px",
    color: "white",
    px: 4,
    py: 1.2,
    minWidth: "140px",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0px 4px 10px rgba(83, 138, 62, 0.3)",
    "&:hover": {
      backgroundColor: "#3e682e",
      transform: "translateY(-2px)",
      boxShadow: "0px 6px 12px rgba(83, 138, 62, 0.4)",
    },
    "&:active": {
      backgroundColor: "#2e5022",
      transform: "translateY(1px)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(83, 138, 62, 0.7)",
      color: "white",
    },
    transition: "all 0.2s ease-in-out",
  };

  // Estilo para botón secundario naranja
  const secondaryButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "12px",
    bgcolor: "#F38223",
    color: "white",
    px: 4,
    py: 1.2,
    minWidth: "140px",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0px 4px 10px rgba(243, 130, 35, 0.3)",
    "&:hover": {
      backgroundColor: "#e67615",
      transform: "translateY(-2px)",
      boxShadow: "0px 6px 12px rgba(243, 130, 35, 0.4)",
    },
    "&:active": {
      backgroundColor: "#d56a10",
      transform: "translateY(1px)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(243, 130, 35, 0.7)",
      color: "white",
    },
    transition: "all 0.2s ease-in-out",
  };

  if (isLoadingMatricula || isLoadingLista) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress sx={{ color: "#538A3E" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "auto" }}>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{
            width: "100%",
            fontFamily,
            "& .MuiAlert-icon": {
              color: alertSeverity === "success" ? "#538A3E" : "#f44336",
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Paper
        elevation={0}
        sx={{
          p: 0,
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
          maxWidth: "1200px",
          mx: "auto",
          bgcolor: "#ffffff",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Datos de matrícula */}
          <Box sx={{ p: 4 }}>
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.05)",
                overflow: "visible",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#1A1363",
                    fontFamily,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    mb: 3,
                    "&::before": {
                      content: '""',
                      display: "inline-block",
                      width: "5px",
                      height: "24px",
                      backgroundColor: "#538A3E",
                      marginRight: "10px",
                      borderRadius: "3px",
                    },
                  }}
                >
                  Datos de Matrícula
                </Typography>

                <Grid container spacing={3}>
                  {/* Grado */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.grado} sx={formControlStyle}>
                      <InputLabel>Grado</InputLabel>
                      <Select 
                        name="grado" 
                        value={gradoSeleccionado} 
                        onChange={handleChange} 
                        label="Grado" 
                        disabled={isEditing}
                      >
                        {["Kinder", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno"].map((grado) => (
                          <MenuItem key={grado} value={grado} sx={{ fontFamily }}>{grado}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Estudiante */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.uuid_estudiante} sx={formControlStyle}>
                      <InputLabel>Estudiante</InputLabel>
                      <Select 
                        name="uuid_estudiante" 
                        value={uuidEstudianteSeleccionado} 
                        onChange={handleChange} 
                        label="Estudiante" 
                        disabled={isEditing}
                      >
                        {estudiantesFiltrados?.map((est) => (
                          <MenuItem key={est.uuid_estudiante} value={est.uuid_estudiante} sx={{ fontFamily }}>
                            {est.nombre_estudiante}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.uuid_estudiante && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.uuid_estudiante}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Fecha matrícula */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha Matrícula"
                      name="fecha_matricula"
                      type="date"
                      value={formData.fecha_matricula || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fecha_matricula}
                      helperText={errors.fecha_matricula}
                      sx={textFieldStyle}
                    />
                  </Grid>

                  {/* CAMPOS NUEVOS - SOLO LECTURA */}
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Tipo de Pago" 
                      value={formData.tipo_pago || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Descripción" 
                      value={formData.descripcion || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Periodicidad" 
                      value={formData.periodicidad || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Código Plan Detallado" 
                      value={formData.codigo_plan_detallado || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Código Plan Matrícula" 
                      value={formData.codigo_plan_matricula || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Tarifa del Plan" 
                      value={formData.tarifa_plan_matricula || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Vencimiento" 
                      value={formData.vencimiento?.substring(0, 10) || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Tipo Plan Matrícula" 
                      value={formData.tipo_plan_matricula || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Nivel" 
                      value={formData.nivel_plan_matricula || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Año Académico" 
                      value={formData.year_plan_matricula || ""} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  {/* Datos de beca si existen */}
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Beca Aplicada" 
                      value={formData.nombre_beca || "Sin beca"} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Descuento" 
                      value={formData.descuento ? `${formData.descuento}%` : "0%"} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Código de Beca" 
                      value={formData.codigo_beca || "-"} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                        },
                      }} 
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Total a Pagar" 
                      value={`L. ${formData.total_matricula || formData.tarifa_plan_matricula || "0.00"}`} 
                      InputProps={{ readOnly: true }} 
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
                          fontWeight: 600,
                        },
                      }} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              p: 3,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              bgcolor: "#f8f9fa",
              position: "sticky",
              bottom: 0,
              zIndex: 10,
            }}
          >
            <Button
              variant="contained"
              onClick={() => setOpenCancelDialog(true)}
              sx={secondaryButtonStyle}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={primaryButtonStyle}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                )
              }
            >
              {isSubmitting
                ? isEditing
                  ? "Actualizando..."
                  : "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Guardar"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Diálogo de confirmación para cancelar */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontFamily }}>
          Confirmar cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontFamily }}>
            ¿Seguro que quieres cancelar el proceso?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenCancelDialog(false)} 
            sx={{ 
              fontFamily,
              color: "#1A1363",
              "&:hover": {
                backgroundColor: "#f0f0f0"
              }
            }}
          >
            No
          </Button>
          <Button 
            onClick={() => {
              setOpenCancelDialog(false);
              onClose?.();
              navigate("/pagos/matricula");
            }}
            autoFocus
            sx={{ 
              fontFamily,
              color: "#F38223",
              "&:hover": {
                backgroundColor: "#f0f0f0"
              }
            }}
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackModal open={modalOpen} status={modalStatus} title={modalTitle} description={modalDescription} onClose={handleCloseModal} />
    </Box>
  );
};

export default FormularioMatricula;