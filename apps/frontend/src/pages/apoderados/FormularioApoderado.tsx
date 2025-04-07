import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEstudiantes } from "@/lib/queries";
import type { ApoderadoType } from "@/lib/queries/useGetApoderados";

const fontFamily = "'Nunito', sans-serif";

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
    grado_estudiante: "",
  });

  const { data: estudiantesData } = useGetEstudiantes(1, 10000, { grado: formData.grado_estudiante });


  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);
      setTimeout(() => {
        const mock: Partial<ApoderadoType> = {
          encargado_id: Number(actualId),
          numero_encargado: 123,
          primer_nombre: "Mario",
          segundo_nombre: "",
          primer_apellido: "Ramos",
          segundo_apellido: "López",
          identidad: "0801198012345",
          genero: "M",
          telefono_personal: "99998888",
          correo_electronico: "mario@test.com",
          parentesco: "Padre",
          es_encargado_principal: true,
          numero_estudiante: 1001,
          grado_estudiante: "Sexto",
        };
        setFormData(mock);
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, actualId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "grado_estudiante" ? { numero_estudiante: 0 } : {}),
    }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.primer_nombre) newErrors.primer_nombre = "Requerido";
    if (!formData.primer_apellido) newErrors.primer_apellido = "Requerido";
    if (!formData.identidad) newErrors.identidad = "Requerido";
    if (!formData.telefono_personal) newErrors.telefono_personal = "Requerido";
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = "Requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = "Correo inválido";
    }
    if (!formData.parentesco) newErrors.parentesco = "Requerido";
    if (!formData.numero_estudiante) newErrors.numero_estudiante = "Seleccione estudiante";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Datos enviados:", formData);
      setIsSubmitting(false);
      if (isModal && onClose) {
        onClose();
      } else {
        navigate("/apoderados");
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} p={4}>
      <Typography variant="h4" sx={{ fontFamily, fontWeight: "bold", color: "#1A1363", mb: 4 }}>
        {isEditing ? "Editar Apoderado" : "Registrar Apoderado"}
      </Typography>

      <Card variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontFamily, color: "#1A1363", mb: 2 }}>
          Datos Personales
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Primer Nombre" name="primer_nombre" value={formData.primer_nombre} onChange={handleChange} fullWidth error={!!errors.primer_nombre} helperText={errors.primer_nombre} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Primer Apellido" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} fullWidth error={!!errors.primer_apellido} helperText={errors.primer_apellido} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Identidad" name="identidad" value={formData.identidad} onChange={handleChange} fullWidth error={!!errors.identidad} helperText={errors.identidad} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Teléfono" name="telefono_personal" value={formData.telefono_personal} onChange={handleChange} fullWidth error={!!errors.telefono_personal} helperText={errors.telefono_personal} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Correo Electrónico" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} fullWidth error={!!errors.correo_electronico} helperText={errors.correo_electronico} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.parentesco}>
              <InputLabel>Parentesco</InputLabel>
              <Select name="parentesco" value={formData.parentesco || ""} onChange={handleSelectChange}>
                <MenuItem value="Padre">Padre</MenuItem>
                <MenuItem value="Madre">Madre</MenuItem>
                <MenuItem value="Tutor">Tutor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontFamily, color: "#1A1363", mb: 2 }}>
          Estudiante Asociado
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Grado</InputLabel>
              <Select name="grado_estudiante" value={formData.grado_estudiante || ""} onChange={handleSelectChange} MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}>
                {[
                  "Jardín", "Preparatoria", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto",
                  "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo"
                ].map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.numero_estudiante}>
              <InputLabel>Estudiante</InputLabel>
              <Select name="numero_estudiante" value={formData.numero_estudiante || ""} onChange={handleSelectChange} disabled={!formData.grado_estudiante} MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}>
                {estudiantesData?.data?.map((est) => (
                  <MenuItem key={est.uuid} value={est.uuid}>
                    {est.codigo_estudiante} - {est.primer_nombre} {est.primer_apellido}
                  </MenuItem>
                ))}
              </Select>
              {errors.numero_estudiante && (
                <Typography variant="caption" color="error">
                  {errors.numero_estudiante}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <FormControlLabel
        control={<Checkbox checked={formData.es_encargado_principal || false} onChange={handleCheckboxChange} name="es_encargado_principal" />}
        label="Es encargado principal"
        sx={{ mb: 3 }}
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            )
          }
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </Box>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioApoderado;
