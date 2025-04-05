{/*Falta arreglar Formulario lo del icono guardar y verificar validaciones y quitar los botones
   de navegacion y ponerlos diferente*/}

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormLabel,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Card,
  CardContent,
  Alert,
  Snackbar,
  useTheme,
  Checkbox,
} from "@mui/material";
import type { ApoderadoType } from "@/lib/queries/useGetApoderados";

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface FormularioApoderadoProps {
  apoderadoId?: string | number;
  isEditing?: boolean;
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioApoderado: React.FC<FormularioApoderadoProps> = ({
  apoderadoId,
  isEditing = false,
  isModal = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const actualId = apoderadoId || id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const theme = useTheme();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<ApoderadoType>>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    identidad: "",
    genero: "M",
    telefono_personal: "",
    correo_electronico: "",
    parentesco: "",
    es_encargado_principal: false,
    numero_estudiante: 0,
  });

  // Estado para controlar errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para obtener el grado del estudiante basado en el número de estudiante
  const getGradoEstudiante = (numeroEstudiante?: number) => {
    if (!numeroEstudiante) return "";
    
    const grados: Record<number, string> = {
      1001: "Sexto",
      1002: "Primero",
      1003: "Noveno",
      1004: "Segundo",
      1005: "Tercero"
    };

    return grados[numeroEstudiante] || "";
  };

  // Efecto para cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);

      // Simulación de datos de apoderado para edición
      setTimeout(() => {
        const mockApoderado: Partial<ApoderadoType> = {
          encargado_id: Number(actualId),
          numero_encargado: 2001,
          primer_nombre: "Juan",
          segundo_nombre: "Carlos",
          primer_apellido: "Pérez",
          segundo_apellido: "López",
          identidad: "0801198012345",
          genero: "M",
          telefono_personal: "98765432",
          correo_electronico: "juan.perez@example.com",
          parentesco: "Padre",
          es_encargado_principal: true,
          numero_estudiante: 1001,
          estudiante_primer_nombre: "Abigail",
          estudiante_primer_apellido: "Fajardo",
          grado_estudiante: "Sexto"
        };

        setFormData(mockApoderado);
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, actualId]);

  // Actualizar el valor del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores al modificar un campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar cambios en selects
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores al modificar un campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar checkbox de encargado principal
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones requeridas
    if (!formData.primer_nombre) newErrors.primer_nombre = "El primer nombre es requerido";
    if (!formData.primer_apellido) newErrors.primer_apellido = "El primer apellido es requerido";
    if (!formData.identidad) newErrors.identidad = "La identidad es requerida";
    if (!formData.telefono_personal) newErrors.telefono_personal = "El teléfono es requerido";
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = "El correo electrónico es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = "Correo electrónico inválido";
    }
    if (!formData.parentesco) newErrors.parentesco = "El parentesco es requerido";
    if (!formData.numero_estudiante) newErrors.numero_estudiante = "Debe seleccionar un estudiante";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simular envío a la API
      setTimeout(() => {
        console.log("Datos a enviar:", formData);
        setIsSubmitting(false);

        // Si estamos en un modal, cerrarlo
        if (isModal && onClose) {
          onClose();
        } else {
          navigate("/apoderados");
        }
      }, 1500);
    }
  };

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363 !important", // Color normal
      "&.Mui-focused": {
        color: "#1A1363 !important", // Color cuando está enfocado
      },
    },
    "& .MuiInputLabel-shrink": {
      color: "#1A1363 !important", // Esto es lo que cambia el color cuando flota arriba
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
      color: "#538A3E",
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress sx={{ color: "#538A3E" }} />
      </Box>
    );
  }

  // Función para generar el avatar del apoderado
  const getApoderadoAvatar = () => {
    if (isEditing && formData.primer_nombre && formData.primer_apellido) {
      const initials = `${formData.primer_nombre.charAt(0)}${formData.primer_apellido.charAt(0)}`;
      return (
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#538A3E",
            fontSize: "2rem",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(83, 138, 62, 0.3)",
          }}
        >
          {initials}
        </Avatar>
      );
    }
    return (
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: "#1A1363",
          fontSize: "2rem",
          boxShadow: "0 4px 10px rgba(26, 19, 99, 0.3)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </Avatar>
    );
  };

  return (
    <Box sx={{ height: isModal ? "auto" : "auto" }}>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="warning"
          sx={{
            width: "100%",
            fontFamily,
            "& .MuiAlert-icon": {
              color: "#F38223",
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Encabezado */}
      {!isModal && (
        <Box
          sx={{
            background: "linear-gradient(135deg, #1A1363 0%, #538A3E 100%)",
            borderRadius: "16px",
            p: 3,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 30px rgba(26, 19, 99, 0.15)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('/placeholder.svg?height=100&width=500') center/cover",
              opacity: 0.05,
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
            {getApoderadoAvatar()}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {isEditing ? "Editar Apoderado" : "Registrar Apoderado"}
              </Typography>
              {isEditing && formData.primer_nombre && formData.primer_apellido && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily,
                    color: "rgba(255,255,255,0.9)",
                    mt: 0.5,
                  }}
                >
                  {`${formData.primer_nombre} ${formData.primer_apellido}`}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, zIndex: 1 }}>
            {isEditing && (
              <Chip
                label={formData.es_encargado_principal ? "Principal" : "Secundario"}
                sx={{
                  bgcolor: formData.es_encargado_principal ? "#538A3E" : "#F38223",
                  color: "white",
                  fontFamily,
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 1,
                }}
              />
            )}
            <Tooltip title="Volver a la lista">
              <IconButton
                onClick={() => navigate("/apoderados")}
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(5px)",
                  "&:hover": {
                    bgcolor: "rgba(243, 130, 35, 0.2)",
                  },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 0,
          mb: isModal ? 0 : 3,
          borderRadius: isModal ? "0 0 16px 16px" : "16px",
          boxShadow: isModal ? "none" : "0 10px 30px rgba(0, 0, 0, 0.05)",
          maxWidth: "1200px",
          mx: "auto",
          bgcolor: "#ffffff",
          height: isModal ? "auto" : "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Datos personales del apoderado */}
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
                  Datos Personales del Apoderado
                </Typography>

                <Grid container spacing={3}>
                  {/* Primera fila */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Primer Nombre"
                      name="primer_nombre"
                      value={formData.primer_nombre || ""}
                      onChange={handleChange}
                      error={!!errors.primer_nombre}
                      helperText={errors.primer_nombre}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Segundo Nombre"
                      name="segundo_nombre"
                      value={formData.segundo_nombre || ""}
                      onChange={handleChange}
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Primer Apellido"
                      name="primer_apellido"
                      value={formData.primer_apellido || ""}
                      onChange={handleChange}
                      error={!!errors.primer_apellido}
                      helperText={errors.primer_apellido}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Segundo Apellido"
                      name="segundo_apellido"
                      value={formData.segundo_apellido || ""}
                      onChange={handleChange}
                      sx={textFieldStyle}
                    />
                  </Grid>

                  {/* Segunda fila */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Identidad"
                      name="identidad"
                      value={formData.identidad || ""}
                      onChange={handleChange}
                      error={!!errors.identidad}
                      helperText={errors.identidad}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={formControlStyle}>
                      <FormLabel id="genero-label">Género</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="genero-label"
                        name="genero"
                        value={formData.genero}
                        onChange={handleSelectChange}
                      >
                        <FormControlLabel
                          value="M"
                          control={
                            <Radio
                              sx={{
                                color: "#2196F3",
                                "&.Mui-checked": {
                                  color: "#2196F3",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: "#2196F3", fontFamily }}>
                              Masculino
                            </Typography>
                          }
                          sx={{
                            "& .MuiFormControlLabel-label": { fontFamily },
                            "& .MuiRadio-root": {
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            },
                          }}
                        />
                        <FormControlLabel
                          value="F"
                          control={
                            <Radio
                              sx={{
                                color: "#E91E63",
                                "&.Mui-checked": {
                                  color: "#E91E63",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: "#E91E63", fontFamily }}>
                              Femenino
                            </Typography>
                          }
                          sx={{
                            "& .MuiFormControlLabel-label": { fontFamily },
                            "& .MuiRadio-root": {
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            },
                          }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="telefono_personal"
                      value={formData.telefono_personal || ""}
                      onChange={handleChange}
                      error={!!errors.telefono_personal}
                      helperText={errors.telefono_personal}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>

                  {/* Tercera fila */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      name="correo_electronico"
                      type="email"
                      value={formData.correo_electronico || ""}
                      onChange={handleChange}
                      error={!!errors.correo_electronico}
                      helperText={errors.correo_electronico}
                      required
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.parentesco}
                      required
                      sx={formControlStyle}
                    >
                      <InputLabel id="parentesco-label">Parentesco</InputLabel>
                      <Select
                        labelId="parentesco-label"
                        name="parentesco"
                        value={formData.parentesco || ""}
                        label="Parentesco"
                        onChange={handleSelectChange}
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
                        <MenuItem value="Padre" sx={{ fontFamily }}>Padre</MenuItem>
                        <MenuItem value="Madre" sx={{ fontFamily }}>Madre</MenuItem>
                        <MenuItem value="Tutor" sx={{ fontFamily }}>Tutor</MenuItem>
                        <MenuItem value="Tío" sx={{ fontFamily }}>Tío</MenuItem>
                        <MenuItem value="Abuelo" sx={{ fontFamily }}>Abuelo</MenuItem>
                        <MenuItem value="Hermano" sx={{ fontFamily }}>Hermano</MenuItem>
                      </Select>
                      {errors.parentesco && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.parentesco}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Checkbox para encargado principal */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.es_encargado_principal || false}
                          onChange={handleCheckboxChange}
                          name="es_encargado_principal"
                          color="primary"
                          sx={{
                            "&.Mui-checked": {
                              color: "#538A3E",
                            },
                          }}
                        />
                      }
                      label="Es encargado principal"
                      sx={{ 
                        "& .MuiFormControlLabel-label": { 
                          fontFamily,
                          color: "#1A1363",
                          fontWeight: 500
                        } 
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Información del estudiante asociado */}
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
                  Estudiante Asociado
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.numero_estudiante}
                      required
                      sx={formControlStyle}
                    >
                      <InputLabel id="estudiante-label">Estudiante</InputLabel>
                      <Select
                        labelId="estudiante-label"
                        name="numero_estudiante"
                        value={formData.numero_estudiante || ""}
                        label="Estudiante"
                        onChange={handleSelectChange}
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
                        <MenuItem value={1001} sx={{ fontFamily }}>1001 - Abigail Fajardo</MenuItem>
                        <MenuItem value={1002} sx={{ fontFamily }}>1002 - Allan Fernández</MenuItem>
                        <MenuItem value={1003} sx={{ fontFamily }}>1003 - Ángel Velásquez</MenuItem>
                        <MenuItem value={1004} sx={{ fontFamily }}>1004 - María Rodríguez</MenuItem>
                        <MenuItem value={1005} sx={{ fontFamily }}>1005 - Carlos Mendoza</MenuItem>
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
                      label="Grado del Estudiante"
                      value={getGradoEstudiante(formData.numero_estudiante)}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        ...textFieldStyle,
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f0f0f0",
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
              onClick={() => isModal && onClose ? onClose() : navigate("/apoderados")}
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
              startIcon={  // Cambiado de endIcon a startIcon
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
    </Box>
  );
};

export default FormularioApoderado;