"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";

const fontFamily = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

// Lista mock de estudiantes con datos realistas de nivelados
const estudiantes = [
  { numero: "EST001", nombre: "Abigail López" },
  { numero: "EST002", nombre: "Anna Mejía" },
  { numero: "EST003", nombre: "Berenice Corrales" },
  { numero: "EST004", nombre: "Carlos López" },
  { numero: "EST005", nombre: "Axel López" },
];

interface FormularioNiveladoProps {
  niveladoId?: string | number;
  isEditing?: boolean;
  onClose?: () => void;
}

const FormularioNivelado: React.FC<FormularioNiveladoProps> = ({
  niveladoId,
  isEditing = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning">("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    numero_estudiante: "",
    nombre_estudiante: "",
    grado: "",
    seccion: "",
    fecha_pago: "",
    monto_pagado: 0,
    saldo_restante: 0,
    beca_aplicada: "",
    porcentaje_descuento: "0%",
    recargo: 0,
    estado: "Pendiente",
    comprobante: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && niveladoId) {
      setIsLoading(true);
      // Simular carga de datos de nivelado
      setTimeout(() => {
        setFormData({
          numero_estudiante: "EST001",
          nombre_estudiante: "Abigail López",
          grado: "Kinder",
          seccion: "A",
          fecha_pago: "2025-01-15",
          monto_pagado: 3000,
          saldo_restante: 2000,
          beca_aplicada: "Ninguna",
          porcentaje_descuento: "0%",
          recargo: 0,
          estado: "Pendiente",
          comprobante: "",
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, niveladoId]);

  const calculateSaldoRestante = () => {
    return formData.saldo_restante - formData.monto_pagado + formData.recargo;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === "numero_estudiante") {
      const estudianteSeleccionado = estudiantes.find(est => est.numero === value);
      setFormData(prev => ({
        ...prev,
        numero_estudiante: value,
        nombre_estudiante: estudianteSeleccionado?.nombre || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "monto_pagado" || name === "recargo" || name === "saldo_restante"
          ? Number(value) 
          : value
      }));
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.numero_estudiante) newErrors.numero_estudiante = "Seleccione un estudiante";
    if (!formData.grado) newErrors.grado = "Seleccione un grado";
    if (!formData.seccion) newErrors.seccion = "Seleccione sección";
    if (!formData.fecha_pago) newErrors.fecha_pago = "Fecha de pago requerida";
    if (formData.monto_pagado <= 0) newErrors.monto_pagado = "Monto inválido";
    if (formData.saldo_restante < 0) newErrors.saldo_restante = "Valor inválido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados antes de validar
    const allFields = {
      numero_estudiante: true,
      grado: true,
      seccion: true,
      fecha_pago: true,
      monto_pagado: true,
      saldo_restante: true,
    };
    setTouchedFields(allFields);

    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Datos guardados:", {
          ...formData,
          saldo_restante: calculateSaldoRestante()
        });
        setIsSubmitting(false);
        setAlertMessage("¡El plan nivelado se guardó exitosamente!");
        setAlertSeverity("success");
        setAlertOpen(true);

        // Navegar después de mostrar el mensaje
        setTimeout(() => {
          navigate("/pagos/nivelados");
        }, 2000);
      }, 1500);
    } else {
      setAlertSeverity("warning");
      setAlertMessage("Por favor complete todos los campos requeridos correctamente");
      setAlertOpen(true);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleConfirmCancel = () => {
    setOpenCancelDialog(false);
    if (onClose) {
      onClose();
    } else {
      navigate("/pagos/nivelados");
    }
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

  if (isLoading) {
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
              color: alertSeverity === "success" ? "#538A3E" : 
                    alertSeverity === "warning" ? "#F38223" : "#f44336",
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
          {/* Información del estudiante */}
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
                  Información del Estudiante
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.numero_estudiante}
                      required
                      sx={formControlStyle}
                    >
                      <InputLabel id="estudiante-label">Estudiante Asociado</InputLabel>
                      <Select
                        labelId="estudiante-label"
                        name="numero_estudiante"
                        value={formData.numero_estudiante}
                        label="Estudiante Asociado"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        {estudiantes.map(est => (
                          <MenuItem key={est.numero} value={est.numero} sx={{ fontFamily }}>
                            {est.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.numero_estudiante && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.numero_estudiante}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Código Estudiante"
                      value={formData.numero_estudiante}
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
                    <FormControl
                      fullWidth
                      error={!!errors.grado}
                      required
                      sx={formControlStyle}
                    >
                      <InputLabel id="grado-label">Grado</InputLabel>
                      <Select
                        labelId="grado-label"
                        name="grado"
                        value={formData.grado}
                        label="Grado"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        {['Kinder', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno'].map(grado => (
                          <MenuItem key={grado} value={grado} sx={{ fontFamily }}>{grado}</MenuItem>
                        ))}
                      </Select>
                      {errors.grado && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.grado}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.seccion}
                      required
                      sx={formControlStyle}
                    >
                      <InputLabel id="seccion-label">Sección</InputLabel>
                      <Select
                        labelId="seccion-label"
                        name="seccion"
                        value={formData.seccion}
                        label="Sección"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        {['A', 'B'].map(seccion => (
                          <MenuItem key={seccion} value={seccion} sx={{ fontFamily }}>
                            {`Sección ${seccion}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.seccion && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.seccion}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Comprobante de pago */}
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
                  Comprobante de Pago
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {formData.comprobante ? (
                      <Box
                        component="img"
                        src={formData.comprobante}
                        alt="Comprobante de Pago"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          borderRadius: 2,
                          border: '1px solid #e0e0e0',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No se ha cargado ningún comprobante.
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        mt: 2,
                        fontFamily,
                        bgcolor: '#1A1363',
                        color: '#fff',
                        '&:hover': { bgcolor: '#0f0c4f' },
                      }}
                    >
                      Cargar Comprobante
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFormData((prev) => ({
                                ...prev,
                                comprobante: reader.result as string,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Detalles del nivelado */}
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
                  Detalles del Nivelado
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Pago"
                      name="fecha_pago"
                      type="date"
                      value={formData.fecha_pago}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fecha_pago}
                      helperText={errors.fecha_pago}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Pagado (L.)"
                      name="monto_pagado"
                      type="number"
                      value={formData.monto_pagado}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.monto_pagado}
                      helperText={errors.monto_pagado}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">L.</InputAdornment>
                        ),
                        inputProps: { min: 0 }
                      }}
                      sx={textFieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Saldo Restante (L.)"
                      name="saldo_restante"
                      type="number"
                      value={formData.saldo_restante}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.saldo_restante}
                      helperText={errors.saldo_restante}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">L.</InputAdornment>
                        ),
                        inputProps: { min: 0 }
                      }}
                      sx={textFieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={formControlStyle}>
                      <InputLabel id="beca-label">Beca Aplicada</InputLabel>
                      <Select
                        labelId="beca-label"
                        name="beca_aplicada"
                        value={formData.beca_aplicada}
                        label="Beca Aplicada"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="Ninguna" sx={{ fontFamily }}>Ninguna</MenuItem>
                        <MenuItem value="Excelencia Académica" sx={{ fontFamily }}>Excelencia Académica</MenuItem>
                        <MenuItem value="Descuento Hermanos" sx={{ fontFamily }}>Descuento Hermanos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={formControlStyle}>
                      <InputLabel id="descuento-label">Descuento</InputLabel>
                      <Select
                        labelId="descuento-label"
                        name="porcentaje_descuento"
                        value={formData.porcentaje_descuento}
                        label="Descuento"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        {[0, 10, 20, 25, 50, 75, 100].map(desc => (
                          <MenuItem key={desc} value={`${desc}%`} sx={{ fontFamily }}>
                            {desc}% Descuento
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Recargo (L.)"
                      name="recargo"
                      type="number"
                      value={formData.recargo}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">L.</InputAdornment>
                        ),
                        inputProps: { min: 0 }
                      }}
                      sx={textFieldStyle}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={formControlStyle}>
                      <InputLabel id="estado-label">Estado</InputLabel>
                      <Select
                        labelId="estado-label"
                        name="estado"
                        value={formData.estado}
                        label="Estado"
                        onChange={handleChange}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              "& .MuiMenuItem-root:hover": {
                                backgroundColor: "#e7f5e8",
                              },
                              borderRadius: "12px",
                              mt: 1,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="Pagado" sx={{ fontFamily }}>Pagado</MenuItem>
                        <MenuItem value="Pendiente" sx={{ fontFamily }}>Pendiente</MenuItem>
                        <MenuItem value="Atrasado" sx={{ fontFamily }}>Atrasado</MenuItem>
                      </Select>
                    </FormControl>
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
              onClick={handleOpenCancelDialog}
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

            <Box sx={{ display: "flex", gap: 2 }}>
              {isEditing && (
                <Button
                  variant="contained"
                  sx={{
                    fontFamily,
                    px: 4,
                    py: 1.2,
                    borderRadius: "12px",
                    bgcolor: "#F38223",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#e67615" },
                  }}
                  onClick={() => {
                    console.log("Registrar y Generar Factura");
                  }}
                >
                  Registrar y Generar Factura
                </Button>
              )}

              {isEditing && (
                <Button
                  variant="contained"
                  sx={{
                    fontFamily,
                    px: 4,
                    py: 1.2,
                    borderRadius: "12px",
                    bgcolor: "#1A1363",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#0f0c4f" },
                  }}
                  onClick={() => {
                    console.log("Efectuar Pago");
                  }}
                >
                  Efectuar Pago
                </Button>
              )}

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
          </Box>
        </form>
      </Paper>

      {/* Diálogo de confirmación para cancelar */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
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
            onClick={handleCloseCancelDialog} 
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
            onClick={handleConfirmCancel} 
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
    </Box>
  );
};

export default FormularioNivelado;