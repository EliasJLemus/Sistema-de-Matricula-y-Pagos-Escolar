import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEstudiantes } from "@/lib/queries";
import { useRegistrarApoderado } from "@/lib/queries";

const fontFamily = "'Nunito', sans-serif";

interface FormularioApoderadoProps {
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioApoderado: React.FC<FormularioApoderadoProps> = ({
  
}) => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    identidad: "",
    genero: "Masculino",
    fecha_nacimiento: "",
    correo_electronico: "",
    telefono_personal: "",
    parentesco: "",
    es_encargado_principal: false,
    grado_estudiante: "",
    uuid_estudiante: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: estudiantesData } = useGetEstudiantes(1, 10000, {
    grado: formData.grado_estudiante,
  });

  const { mutate: registrarApoderado } = useRegistrarApoderado();

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
      ...(name === "grado_estudiante" ? { uuid_estudiante: "" } : {}),
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
    if (!formData.uuid_estudiante) newErrors.uuid_estudiante = "Seleccione estudiante";
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    registrarApoderado(
      {
        primer_nombre: formData.primer_nombre,
        segundo_nombre: formData.segundo_nombre || "",
        primer_apellido: formData.primer_apellido,
        segundo_apellido: formData.segundo_apellido || "",
        identidad: formData.identidad,
        genero: formData.genero as "Masculino" | "Femenino" | "Otro",
        fecha_nacimiento: formData.fecha_nacimiento,
        correo: formData.correo_electronico,
        telefono: formData.telefono_personal,
        es_principal: formData.es_encargado_principal,
        parentesco: formData.parentesco,
        uuid_estudiante: formData.uuid_estudiante,
      },
      {
        onSuccess: (res) => {
          setIsSubmitting(false);
          if (res.success) {
            navigate("/apoderados");
          } else {
            setAlertMessage(res.message || "No se pudo registrar");
            setAlertOpen(true);
          }
        },
        onError: (err: any) => {
          setIsSubmitting(false);
          setAlertMessage(err.message || "Error inesperado");
          setAlertOpen(true);
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={4}>
      <Typography variant="h4" sx={{ fontFamily, fontWeight: "bold", color: "#1A1363", mb: 4 }}>
        Registrar Apoderado
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
            <TextField label="Segundo Nombre" name="segundo_nombre" value={formData.segundo_nombre} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Primer Apellido" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} fullWidth error={!!errors.primer_apellido} helperText={errors.primer_apellido} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Segundo Apellido" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} fullWidth />
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
            <InputLabel shrink>Fecha de Nacimiento</InputLabel>
            <TextField type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} fullWidth error={!!errors.fecha_nacimiento} helperText={errors.fecha_nacimiento} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Género</InputLabel>
              <Select name="genero" value={formData.genero} onChange={handleSelectChange}>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.parentesco}>
              <InputLabel>Parentesco</InputLabel>
              <Select name="parentesco" value={formData.parentesco} onChange={handleSelectChange}>
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
              <Select name="grado_estudiante" value={formData.grado_estudiante} onChange={handleSelectChange}>
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
            <FormControl fullWidth error={!!errors.uuid_estudiante}>
              <InputLabel>Estudiante</InputLabel>
              <Select name="uuid_estudiante" value={formData.uuid_estudiante} onChange={handleSelectChange} disabled={!formData.grado_estudiante}>
                {estudiantesData?.data?.map((est) => (
                  <MenuItem key={est.uuid} value={est.uuid}>
                    {est.codigo_estudiante} - {est.primer_nombre} {est.primer_apellido}
                  </MenuItem>
                ))}
              </Select>
              {errors.uuid_estudiante && (
                <Typography variant="caption" color="error">
                  {errors.uuid_estudiante}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <FormControlLabel
        control={<Checkbox checked={formData.es_encargado_principal} onChange={handleCheckboxChange} name="es_encargado_principal" />}
        label="Es encargado principal"
        sx={{ mb: 3 }}
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : undefined}>
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
