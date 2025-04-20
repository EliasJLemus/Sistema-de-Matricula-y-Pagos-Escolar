import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from "@mui/material";
import { BecaType } from "@/lib/queries/useGetBecas";


const fontFamily = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface FormularioBecasProps {
  becaId?: string;
  isEditing?: boolean;
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioBecas: React.FC<FormularioBecasProps> = ({
  becaId,
  isEditing = false,
  isModal = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const actualId = becaId || id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "warning" | "error">("warning");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Partial<BecaType>>({
    nombre_beca: "",
    descuento: 0,
    estado: 'ACTIVO',
    uuid_autorizado_por: "admin-001" // Valor por defecto o obtener del usuario actual
  });

  // Estado para controlar errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: registroBeca } = useRegistrarBeca();

  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);

      // Simulación de datos de beca para edición
      setTimeout(() => {
        const mockBeca: Partial<BecaType> = {
          uuid: actualId,
          nombre_beca: "Beca Excelencia",
          descuento: 50,
          estado: 'ACTIVO',
          uuid_autorizado_por: 'admin-001'
        };

        setFormData(mockBeca);
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, actualId]);

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_beca?.trim()) {
      newErrors.nombre_beca = "El nombre de la beca es requerido";
    }

    if (formData.descuento === undefined || formData.descuento < 0 || formData.descuento > 100) {
      newErrors.descuento = "El descuento debe ser entre 0 y 100%";
    }

    if (!formData.estado) {
      newErrors.estado = "Debe seleccionar un estado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Manejar cambios en los campos
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

    // Manejar cambios numéricos
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value)));
        
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      };

      // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const payload = {
        nombre: formData.nombre_beca || "",
        descuento: formData.descuento || 0,
        estado: formData.estado || 'ACTIVO',
        uuid_autorizado_por: formData.uuid_autorizado_por || ""
      };

      registroBeca(payload, {
        onSuccess: () => {
          setAlertSeverity("success");
          setAlertMessage(isEditing ? "Beca actualizada correctamente" : "Beca creada correctamente");
          setAlertOpen(true);
          if (!isModal) navigate("/becas");
        },
        onError: () => {
          setAlertSeverity("error");
          setAlertMessage("Error al procesar la solicitud");
          setAlertOpen(true);
        },
        onSettled: () => setIsSubmitting(false)
      });
    } else {
      setAlertSeverity("warning");
      setAlertMessage("Por favor complete todos los campos requeridos correctamente");
      setAlertOpen(true);
    }
  };

  const handleConfirmCancel = () => {
    setOpenCancelDialog(false);
    if (isModal && onClose) onClose();
    else navigate("/becas");
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
    if (isLoading) {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
            <CircularProgress sx={{ color: "#538A3E" }} />
          </Box>
        );
      }
      return (
        <Box sx={{ height: isModal ? "auto" : "auto" }}>
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
              {alertMessage}
            </Alert>
          </Snackbar>
    
          {/* Encabezado */}
          {!isModal && (
            <Box sx={{ 
              background: "linear-gradient(135deg, #1A1363 0%, #538A3E 100%)",
              borderRadius: "16px",
              p: 3,
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#fff", width: 60, height: 60 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#538A3E">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                  </svg>
                </Avatar>
                <Typography variant="h5" sx={{ color: "white", fontFamily, fontWeight: 700 }}>
                  {isEditing ? "Editar Beca" : "Crear Nueva Beca"}
                </Typography>
              </Box>
            </Box>
          )}
    
          <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Nombre de la beca */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre de la Beca"
                    name="nombre_beca"
                    value={formData.nombre_beca || ""}
                    onChange={handleChange}
                    error={!!errors.nombre_beca}
                    helperText={errors.nombre_beca}
                    required
                    sx={textFieldStyle}
                  />
                </Grid>
    
                {/* Descuento */}
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Descuento (%)"
                    name="descuento"
                    type="number"
                    value={formData.descuento}
                    onChange={handleNumberChange}
                    error={!!errors.descuento}
                    helperText={errors.descuento}
                    required
                    inputProps={{ min: 0, max: 100 }}
                    sx={textFieldStyle}
                  />
                </Grid>
    
                {/* Estado */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Estado *</InputLabel>
                    <Select
                      name="estado"
                      value={formData.estado}
                      label="Estado"
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'ACTIVO' | 'INACTIVO' }))}
                      error={!!errors.estado}
                    >
                      <MenuItem value="ACTIVO">Activo</MenuItem>
                      <MenuItem value="INACTIVO">Inactivo</MenuItem>
                    </Select>
                    {errors.estado && (
                      <Typography variant="caption" color="error">{errors.estado}</Typography>
                    )}
                  </FormControl>
                </Grid>
    
                {/* Botones de acción */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenCancelDialog(true)}
                    sx={secondaryButtonStyle}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={primaryButtonStyle}
                  >
                    {isSubmitting ? (isEditing ? "Actualizando..." : "Guardando...") : (isEditing ? "Actualizar" : "Guardar")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
    
          {/* Diálogo de confirmación de cancelación (mantener misma implementación) */}
          <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
            <DialogTitle>Confirmar cancelación</DialogTitle>
            <DialogContent>
              <DialogContentText>¿Está seguro que desea cancelar?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCancelDialog(false)}>No</Button>
              <Button onClick={handleConfirmCancel} autoFocus color="error">
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    };
    
    export default FormularioBecas;