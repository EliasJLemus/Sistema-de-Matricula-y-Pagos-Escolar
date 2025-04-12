import React, { useState, useEffect, use } from "react";
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
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import type { ApoderadoType } from "@/lib/queries/useGetApoderados";
import { TelefonoInput } from "@/components/TelefonoInput";
import { useGetEstudiantes } from "@/lib/queries";
import { EstudianteType } from "@/lib/queries/useGetEstudiantes";
import { EstudiantesTablaType } from "@shared/estudiantesType";

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
  const [alertSeverity, setAlertSeverity] = useState<"success" | "warning" | "error">("warning");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [filterEstudiante, setFilterEstudiante] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [getGrado, setFilterGrado] = useState("")
  const theme = useTheme();
  const {data: estudianteFiltered} = useGetEstudiantes(
    1, 10000, {
      estado: "",
      grado: getGrado,
      nombre: ""
    }
  )

  const grados = [
    "Prekínder", "Kínder", "Primero", "Segundo", "Tercero",
    "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno"
  ];

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<ApoderadoType>>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    identidad: "",
    genero: undefined,
    telefono_personal: "",
    correo_electronico: "",
    parentesco: "",
    es_encargado_principal: false,
    numero_estudiante: 0,
    grado_estudiante: "",
  });

  // Estado para controlar errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para filtrar estudiantes
  const filteredEstudiantes = (estudianteFiltered?.data ?? []).filter(est =>
    `${est.primer_nombre} ${est.primer_apellido}`.toLowerCase().includes(filterEstudiante.toLowerCase())
  );
  

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
          telefono_personal: "+50498765432",
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

  // Validar la entrada según el campo
  const validateInput = (name: string, value: string): { isValid: boolean; error?: string } => {
    // Solo letras con acentos y diéresis para nombres y apellidos (sin espacios al inicio)
    if (
      [
        "primer_nombre",
        "segundo_nombre",
        "primer_apellido",
        "segundo_apellido",
      ].includes(name)
    ) {
      if (value.startsWith(" ")) {
        return { isValid: false, error: "No se permiten espacios al inicio" };
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s]*$/.test(value)) {
        return { isValid: false, error: "Solo se permiten letras, acentos y diéresis" };
      }
      return { isValid: true };
    }

    // Solo números para identidad
    if (name === "identidad") {
      if (!/^\d*$/.test(value)) {
        return { isValid: false, error: "Solo se permiten números" };
      }
      return { isValid: true };
    }

    // Permitir siempre la escritura en el campo de correo
    if (name === "correo_electronico") return { isValid: true };

    return { isValid: true };
  };

  // Manejar blur de los campos
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  // Actualizar el valor del formulario con validación en tiempo real
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validar la entrada según el campo
    const validation = validateInput(name, value);

    if (validation.isValid) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Limpiar errores si existen
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      // Si la entrada no es válida, establecer el mensaje de error
      setErrors((prev) => ({
        ...prev,
        [name]: validation.error || "",
      }));
      
      // Marcar el campo como tocado para mostrar el error inmediatamente
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };

  // Manejar cambios en el teléfono
  const handleTelefonoChange = (telefonoCompleto: string) => {
    setFormData(prev => ({
      ...prev,
      telefono_personal: telefonoCompleto
    }));

    // Limpiar errores si existen
    if (errors.telefono_personal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.telefono_personal;
        return newErrors;
      });
    }
  };

  // Manejar cambios en selects y radio buttons
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
  
    if (name === "numero_estudiante") {
      const estudianteSeleccionado = estudianteFiltered?.data.find(est => est.uuid === value);
      setFormData((prev) => ({
        ...prev,
        uuid_estudiante: value,
        grado_estudiante: estudianteSeleccionado?.grado || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  
    // Limpiar errores
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

  // Validar formulario completo
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones requeridas
    if (!formData.primer_nombre?.trim()) {
      newErrors.primer_nombre = "El primer nombre es requerido";
    } else if (formData.primer_nombre.startsWith(" ")) {
      newErrors.primer_nombre = "No se permiten espacios al inicio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s]+$/.test(formData.primer_nombre)) {
      newErrors.primer_nombre = "Solo se permiten letras, acentos y diéresis";
    }

    if (!formData.primer_apellido?.trim()) {
      newErrors.primer_apellido = "El primer apellido es requerido";
    } else if (formData.primer_apellido.startsWith(" ")) {
      newErrors.primer_apellido = "No se permiten espacios al inicio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s]+$/.test(formData.primer_apellido)) {
      newErrors.primer_apellido = "Solo se permiten letras, acentos y diéresis";
    }

    if (!formData.identidad?.trim()) {
      newErrors.identidad = "La identidad es requerida";
    } else if (!/^\d+$/.test(formData.identidad)) {
      newErrors.identidad = "Solo se permiten números";
    } else if (formData.identidad.length < 13) {
      newErrors.identidad = "La identidad debe tener al menos 13 dígitos";
    }

    if (!formData.genero) {
      newErrors.genero = "Debe seleccionar un género";
    }

    if (!formData.telefono_personal?.trim()) {
      newErrors.telefono_personal = "El teléfono es requerido";
    }

    // Validación de correo electrónico
    if (!formData.correo_electronico?.trim()) {
      newErrors.correo_electronico = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = "Correo electrónico inválido";
    }

    if (!formData.parentesco) {
      newErrors.parentesco = "El parentesco es requerido";
    }

    if (!formData.numero_estudiante) {
      newErrors.numero_estudiante = "Debes seleccionar un estudiante";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados antes de validar
    const allFields = {
      primer_nombre: true,
      segundo_nombre: true,
      primer_apellido: true,
      segundo_apellido: true,
      identidad: true,
      genero: true,
      telefono_personal: true,
      correo_electronico: true,
      parentesco: true,
      numero_estudiante: true,
    };
    setTouchedFields(allFields);

    if (validateForm()) {
      setIsSubmitting(true);

      // Simular envío a la API
      setTimeout(() => {
        console.log("Datos a enviar:", formData);
        setIsSubmitting(false);

        // Mostrar mensaje de éxito
        setAlertSeverity("success");
        setAlertMessage("¡El apoderado se guardó exitosamente!");
        setAlertOpen(true);

        // Si estamos en un modal, cerrarlo después de un tiempo
        if (isModal && onClose) {
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          // Navegar después de mostrar el mensaje
          setTimeout(() => {
            navigate("/apoderados");
          }, 2000);
        }
      }, 1500);
    } else {
      setAlertSeverity("warning");
      setAlertMessage("Por favor complete todos los campos requeridos correctamente");
      setAlertOpen(true);
    }
  };

  // Funciones para manejar el diálogo de cancelación
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleConfirmCancel = () => {
    setOpenCancelDialog(false);
    if (isModal && onClose) {
      onClose();
    } else {
      navigate("/apoderados");
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
                      error={!!errors.segundo_nombre}
                      helperText={errors.segundo_nombre}
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
                      error={!!errors.segundo_apellido}
                      helperText={errors.segundo_apellido}
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
                      onBlur={handleBlur}
                      error={!!errors.identidad}
                      helperText={errors.identidad}
                      required
                      inputProps={{
                        maxLength: 13
                      }}
                      sx={textFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      component="fieldset" 
                      sx={{
                        ...formControlStyle,
                        "& .MuiFormLabel-root": {
                          color: "#1A1363", 
                        },
                      }}
                      error={!!errors.genero}
                    >
                      <FormLabel id="genero-label">Género *</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="genero-label"
                        name="genero"
                        value={formData.genero || ""}
                        onChange={handleSelectChange}
                      >
                        <FormControlLabel
                          value="M"
                          control={
                            <Radio
                              sx={{
                                color: "#4d4d4d",
                                "&.Mui-checked": {
                                  color: "#538A3E",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ 
                              color: formData.genero === "M" ? "#538A3E" : "#4d4d4d", 
                              fontFamily,
                              fontWeight: formData.genero === "M" ? 600 : 400
                            }}>
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
                                color: "#4d4d4d",
                                "&.Mui-checked": {
                                  color: "#538A3E",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ 
                              color: formData.genero === "F" ? "#538A3E" : "#4d4d4d", 
                              fontFamily,
                              fontWeight: formData.genero === "F" ? 600 : 400
                            }}>
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
                      {errors.genero && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.genero}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TelefonoInput
                      value={formData.telefono_personal || ""}
                      onChange={handleTelefonoChange}
                      error={!!errors.telefono_personal}
                      helperText={errors.telefono_personal}
                    />
                  </Grid>

                  {/* Tercera fila */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={formData.correo_electronico || document.activeElement === document.querySelector('[name="correo_electronico"]') ? "Correo Electrónico" : ""}
                      name="correo_electronico"
                      type="email"
                      value={formData.correo_electronico || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.correo_electronico}
                      helperText={errors.correo_electronico}
                      required
                      sx={textFieldStyle}
                      placeholder="ejemplo: nombre@dominio.com"
                      InputLabelProps={{
                        shrink: !!formData.correo_electronico || document.activeElement === document.querySelector('[name="correo_electronico"]'),
                      }}
                      InputProps={{
                        startAdornment: !formData.correo_electronico && document.activeElement !== document.querySelector('[name="correo_electronico"]') ? (
                          <InputAdornment position="start" sx={{ color: "#999", mr: 1 }}>
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
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </InputAdornment>
                        ) : null,
                      }}
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
                    required
                    sx={formControlStyle}
                  >
                    <InputLabel id="grado-label">Grado del Estudiante</InputLabel>
                    <Select
                      labelId="grado-label"
                      name="grado_estudiante"
                      value={getGrado}
                      label="Grado del Estudiante"
                      onChange={(e) => setFilterGrado(e.target.value)}
                    >
                      {grados.map((grado) => (
                        <MenuItem key={grado} value={grado} sx={{ fontFamily }}>
                          {grado}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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
                        value={formData.uuid_estudiante || ""}
                        label="Estudiante Asociado"
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
                        {/* Opción Ninguno */}
                        <MenuItem value="" sx={{ fontFamily, color: "#999" }}>
                          <em>Ninguno</em>
                        </MenuItem>
          

                        {/* Lista filtrada de estudiantes */}
                        {(estudianteFiltered?.data ?? []).length > 0 ? (
                          filteredEstudiantes.map((est: EstudiantesTablaType) => (
                            <MenuItem 
                            key={est.uuid} 
                            value={est.uuid}
                            sx={{ fontFamily }}
                          >
                            {est.codigo_estudiante} - {est.primer_nombre} {est.primer_apellido}
                          </MenuItem>
                          
                          ))
                        ) : (
                          <MenuItem disabled sx={{ fontFamily }}>
                            No se encontraron estudiantes
                          </MenuItem>
                        )}
                      </Select>
                      {errors.numero_estudiante && (
                        <Typography variant="caption" color="error" sx={{ fontFamily, mt: 0.5, ml: 1.5 }}>
                          {errors.numero_estudiante}
                        </Typography>
                      )}
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

export default FormularioApoderado;