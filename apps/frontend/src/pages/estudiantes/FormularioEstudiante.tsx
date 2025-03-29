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
  Divider,
  TextareaAutosize,
} from "@mui/material";
import { format, parse } from "date-fns";
import { EstudianteType } from "@/lib/queries/useGetEstudiantes";

// Font family constant to match sidebar and topbar
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface FormularioEstudianteProps {
  estudianteId?: string | number;
  isEditing?: boolean;
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioEstudiante: React.FC<FormularioEstudianteProps> = ({
  estudianteId,
  isEditing = false,
  isModal = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const actualId = estudianteId || id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<EstudianteType>>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    nacionalidad: "",
    identidad: "",
    genero: "M",
    fecha_nacimiento: format(new Date(), "yyyy-MM-dd"),
    edad: 0,
    direccion: "",
    nombre_grado: "",
    seccion: "",
    es_zurdo: false,
    dif_educacion_fisica: false,
    reaccion_alergica: false,
    descripcion_alergica: "",
    fecha_admision: format(new Date(), "yyyy-MM-dd"),
    estado: "Activo",
  });

  // Estado para controlar errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efecto para cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);

      // Aquí simularemos la obtención de datos del estudiante
      setTimeout(() => {
        // Datos de ejemplo para el modo edición
        const mockStudent: Partial<EstudianteType> = {
          id: Number(actualId),
          numero_estudiante: 1001,
          primer_nombre: "Abigail",
          segundo_nombre: "",
          primer_apellido: "Fajardo",
          segundo_apellido: "",
          nacionalidad: "Hondureña",
          identidad: "0801199912345",
          genero: "F",
          fecha_nacimiento: "1999-05-15",
          edad: 25,
          direccion: "Col. Kennedy",
          nombre_grado: "Sexto",
          seccion: "A",
          es_zurdo: true,
          dif_educacion_fisica: false,
          reaccion_alergica: false,
          descripcion_alergica: "",
          fecha_admision: "2025-01-02",
          estado: "Activo",
        };

        setFormData(mockStudent);
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

  // Manejar cambios en los radios buttons
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  // Funciones para manejar las fechas de forma manual
  const handleFechaNacimientoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: value,
    }));

    // Calcular edad
    if (value) {
      try {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        setFormData((prev) => ({
          ...prev,
          edad: age,
        }));
      } catch (error) {
        console.error("Error al calcular la edad:", error);
      }
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones requeridas
    if (!formData.primer_nombre)
      newErrors.primer_nombre = "El primer nombre es requerido";
    if (!formData.primer_apellido)
      newErrors.primer_apellido = "El primer apellido es requerido";
    if (!formData.nacionalidad)
      newErrors.nacionalidad = "La nacionalidad es requerida";

    // Validar formato de identidad (13 dígitos)
    if (!formData.identidad) {
      newErrors.identidad = "La identidad es requerida";
    } else if (!/^\d{13}$/.test(formData.identidad)) {
      newErrors.identidad = "La identidad debe contener 13 dígitos";
    }

    // Validar fechas
    if (!formData.fecha_nacimiento)
      newErrors.fecha_nacimiento = "La fecha de nacimiento es requerida";
    if (!formData.fecha_admision)
      newErrors.fecha_admision = "La fecha de admisión es requerida";

    // Validar campos de selección
    if (!formData.nombre_grado)
      newErrors.nombre_grado = "El grado es requerido";
    if (!formData.seccion) newErrors.seccion = "La sección es requerida";

    // Validar descripción alérgica si tiene reacción alérgica
    if (formData.reaccion_alergica && !formData.descripcion_alergica) {
      newErrors.descripcion_alergica =
        "La descripción de la alergia es requerida";
    }

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

        // Aquí iría la lógica para enviar los datos al servidor

        setIsSubmitting(false);

        // Si estamos en un modal, cerrarlo
        if (isModal && onClose) {
          onClose();
        } else {
          // Redirigir a la lista de estudiantes
          navigate("/estudiantes");
        }
      }, 1500);
    }
  };

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
    },
    "& .MuiInputBase-root": {
      fontFamily,
      borderRadius: "8px",
    },
    "& .MuiFormHelperText-root": {
      fontFamily,
    },
  };

  // Estilos comunes para FormControl
  const formControlStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
    },
    "& .MuiFormLabel-root": {
      fontFamily,
      fontSize: "14px",
    },
    "& .MuiSelect-select": {
      fontFamily,
    },
    "& .MuiRadio-root": {
      color: "#538A3E",
    },
    "& .Mui-checked": {
      color: "#538A3E",
    },
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
    // Color verde menta al hacer hover en opciones desplegables
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#e7f5e8",
    },
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress sx={{ color: "#538A3E" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: isModal ? 0 : 3,
          borderRadius: isModal ? 0 : "8px",
          boxShadow: isModal ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "1200px",
          mx: "auto",
          bgcolor: "#f9f9f9",
        }}
      >
        {/* Título con fondo degradado como el sidebar */}
        <Box
          sx={{
            background: "linear-gradient(180deg, #1A1363 0%, #538A3E 100%)",
            borderRadius: "8px",
            p: 2,
            mb: 3,
            display: isModal ? "none" : "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{
              fontFamily,
              fontWeight: 700,
              color: "#FFFFFF", // Texto en blanco
              m: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isEditing ? (
              <>
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
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                  </svg>
                </Box>
                Registro de Estudiante
              </>
            ) : (
              <>
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                </Box>
                Registro de Estudiante
              </>
            )}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Datos personales */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#538A3E",
                fontFamily,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: "#538A3E",
                  marginRight: "8px",
                  borderRadius: "2px",
                },
              }}
            >
              Datos Personales
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
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
                <TextField
                  fullWidth
                  label="Nacionalidad"
                  name="nacionalidad"
                  value={formData.nacionalidad || ""}
                  onChange={handleChange}
                  error={!!errors.nacionalidad}
                  helperText={errors.nacionalidad}
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
                      control={<Radio />}
                      label="Masculino"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="Femenino"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Tercera fila */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento || ""}
                  onChange={handleFechaNacimientoChange}
                  error={!!errors.fecha_nacimiento}
                  helperText={errors.fecha_nacimiento}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Edad"
                  name="edad"
                  type="number"
                  value={formData.edad || ""}
                  InputProps={{ readOnly: true }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion || ""}
                  onChange={handleChange}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Información académica */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#538A3E",
                fontFamily,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: "#538A3E",
                  marginRight: "8px",
                  borderRadius: "2px",
                },
              }}
            >
              Información Académica
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl
                  fullWidth
                  error={!!errors.nombre_grado}
                  required
                  sx={formControlStyle}
                >
                  <InputLabel id="grado-label">Grado</InputLabel>
                  <Select
                    labelId="grado-label"
                    name="nombre_grado"
                    value={formData.nombre_grado || ""}
                    label="Grado"
                    onChange={handleSelectChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#e7f5e8",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="Primero" sx={{ fontFamily }}>
                      Primero
                    </MenuItem>
                    <MenuItem value="Segundo" sx={{ fontFamily }}>
                      Segundo
                    </MenuItem>
                    <MenuItem value="Tercero" sx={{ fontFamily }}>
                      Tercero
                    </MenuItem>
                    <MenuItem value="Cuarto" sx={{ fontFamily }}>
                      Cuarto
                    </MenuItem>
                    <MenuItem value="Quinto" sx={{ fontFamily }}>
                      Quinto
                    </MenuItem>
                    <MenuItem value="Sexto" sx={{ fontFamily }}>
                      Sexto
                    </MenuItem>
                    <MenuItem value="Séptimo" sx={{ fontFamily }}>
                      Séptimo
                    </MenuItem>
                    <MenuItem value="Octavo" sx={{ fontFamily }}>
                      Octavo
                    </MenuItem>
                    <MenuItem value="Noveno" sx={{ fontFamily }}>
                      Noveno
                    </MenuItem>
                  </Select>
                  {errors.nombre_grado && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ fontFamily, mt: 0.5, ml: 1.5 }}
                    >
                      {errors.nombre_grado}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
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
                    value={formData.seccion || ""}
                    label="Sección"
                    onChange={handleSelectChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#e7f5e8",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="A" sx={{ fontFamily }}>
                      A
                    </MenuItem>
                    <MenuItem value="B" sx={{ fontFamily }}>
                      B
                    </MenuItem>
                    <MenuItem value="C" sx={{ fontFamily }}>
                      C
                    </MenuItem>
                  </Select>
                  {errors.seccion && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ fontFamily, mt: 0.5, ml: 1.5 }}
                    >
                      {errors.seccion}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha de Admisión"
                  name="fecha_admision"
                  type="date"
                  value={formData.fecha_admision || ""}
                  onChange={handleChange}
                  error={!!errors.fecha_admision}
                  helperText={errors.fecha_admision}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={textFieldStyle}
                />
              </Grid>

              {isEditing && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                      labelId="estado-label"
                      name="estado"
                      value={formData.estado || "Activo"}
                      label="Estado"
                      onChange={handleSelectChange}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            "& .MuiMenuItem-root:hover": {
                              backgroundColor: "#e7f5e8",
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Activo" sx={{ fontFamily }}>
                        Activo
                      </MenuItem>
                      <MenuItem value="Inactivo" sx={{ fontFamily }}>
                        Inactivo
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Información adicional */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#538A3E",
                fontFamily,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: "#538A3E",
                  marginRight: "8px",
                  borderRadius: "2px",
                },
              }}
            >
              Información Adicional
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl component="fieldset" sx={formControlStyle}>
                  <FormLabel component="legend">Es zurdo</FormLabel>
                  <RadioGroup
                    row
                    name="es_zurdo"
                    value={formData.es_zurdo?.toString()}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Sí"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl component="fieldset" sx={formControlStyle}>
                  <FormLabel component="legend">
                    Dificultad en Educación Física
                  </FormLabel>
                  <RadioGroup
                    row
                    name="dif_educacion_fisica"
                    value={formData.dif_educacion_fisica?.toString()}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Sí"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl component="fieldset" sx={formControlStyle}>
                  <FormLabel component="legend">Reacción Alérgica</FormLabel>
                  <RadioGroup
                    row
                    name="reaccion_alergica"
                    value={formData.reaccion_alergica?.toString()}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Sí"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                      sx={{ "& .MuiFormControlLabel-label": { fontFamily } }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {formData.reaccion_alergica && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción de la Alergia"
                    name="descripcion_alergica"
                    value={formData.descripcion_alergica || ""}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    error={!!errors.descripcion_alergica}
                    helperText={errors.descripcion_alergica}
                    required
                    sx={textFieldStyle}
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                isModal && onClose ? onClose() : navigate("/estudiantes")
              }
              disabled={isSubmitting}
              sx={{
                ml: 1,
                fontFamily,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: "#F38223",
                color: "white",
                px: 3,
                minWidth: "120px",
                fontWeight: 600,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#e67615",
                  transform: "scale(1.05) translateZ(10px)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                  filter: "brightness(1.2)",
                },
                "&:active": {
                  backgroundColor: "#d56a10",
                  transform: "scale(0.98) translateZ(5px)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(243, 130, 35, 0.7)",
                  color: "white",
                },
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                bgcolor: "#538A3E",
                fontFamily,
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                minWidth: "120px",
                fontWeight: 600,
                color: "white", // Texto blanco como solicitado
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#3e682e",
                  transform: "scale(1.05) translateZ(10px)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                  filter: "brightness(1.2)",
                },
                "&:active": {
                  backgroundColor: "#2e5022",
                  transform: "scale(0.98) translateZ(5px)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(83, 138, 62, 0.7)",
                  color: "white",
                },
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                  <span>{isEditing ? "Actualizando..." : "Guardando..."}</span>
                </>
              ) : isEditing ? (
                "Actualizar"
              ) : (
                "Guardar"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FormularioEstudiante;
