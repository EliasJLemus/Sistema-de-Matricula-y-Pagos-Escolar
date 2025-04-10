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
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetEstudiantes, useRegistrarApoderado } from "@/lib/queries";
import { TelefonoInput } from "@/components/TelefonoInput";

const fontFamily = "'Nunito', sans-serif";

const FormularioApoderado = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    identidad: "",
    genero: "",
    fecha_nacimiento: "",
    correo_electronico: "",
    telefono_personal: "",
    parentesco: "",
    es_encargado_principal: false,
    grado_estudiante: "",
    uuid: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "warning" | "error">("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterEstudiante, setFilterEstudiante] = useState("");

  const { data: estudiantesData } = useGetEstudiantes(1, 10000, {
    grado: formData.grado_estudiante,
  });

  const { mutate: registrarApoderado } = useRegistrarApoderado();

  const filteredEstudiantes =
    estudiantesData?.data?.filter((e: any) =>
      `${e.primer_nombre}`.toLowerCase().includes(filterEstudiante.toLowerCase())
    ) || [];

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
      ...(name === "grado_estudiante" ? { uuid: "" } : {}),
    }));
  };

  const handleTelefonoChange = (value: string) => {
    setFormData((prev) => ({ ...prev, telefono_personal: value }));
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
    if (!formData.genero) newErrors.genero = "Requerido";
    if (!formData.grado_estudiante) newErrors.grado_estudiante = "Requerido";
    if (!formData.uuid) newErrors.uuid = "Seleccione un estudiante";
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
        genero: formData.genero,
        fecha_nacimiento: formData.fecha_nacimiento,
        correo: formData.correo_electronico,
        telefono: formData.telefono_personal,
        es_principal: formData.es_encargado_principal,
        parentesco: formData.parentesco,
        uuid: formData.uuid,
      },
      {
        onSuccess: (res) => {
          setIsSubmitting(false);
          if (res.success) {
            setAlertSeverity("success");
            setAlertMessage("Apoderado registrado correctamente");
            setAlertOpen(true);
            navigate("/apoderados");
          } else {
            setAlertSeverity("warning");
            setAlertMessage(res.message || "No se pudo registrar");
            setAlertOpen(true);
          }
        },
        onError: (err: any) => {
          setIsSubmitting(false);
          setAlertSeverity("error");
          setAlertMessage(err.message || "Error inesperado");
          setAlertOpen(true);
        },
      }
    );
  };

  const handleOpenCancelDialog = () => setOpenCancelDialog(true);
  const handleCloseCancelDialog = () => setOpenCancelDialog(false);
  const handleConfirmCancel = () => navigate("/apoderados");

  return (
    <Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{
            fontFamily,
            "& .MuiAlert-icon": {
              color:
                alertSeverity === "success"
                  ? "#538A3E"
                  : alertSeverity === "warning"
                  ? "#F38223"
                  : "#f44336",
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 4, borderRadius: "12px" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontFamily, mb: 3 }}>
            Registro de Apoderado
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primer Nombre"
                name="primer_nombre"
                value={formData.primer_nombre}
                onChange={handleChange}
                error={!!errors.primer_nombre}
                helperText={errors.primer_nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primer Apellido"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={handleChange}
                error={!!errors.primer_apellido}
                helperText={errors.primer_apellido}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identidad"
                name="identidad"
                value={formData.identidad}
                onChange={handleChange}
                error={!!errors.identidad}
                helperText={errors.identidad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TelefonoInput
                value={formData.telefono_personal}
                onChange={handleTelefonoChange}
                error={!!errors.telefono_personal}
                helperText={errors.telefono_personal}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                error={!!errors.correo_electronico}
                helperText={errors.correo_electronico}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.parentesco}>
                <InputLabel>Parentesco</InputLabel>
                <Select
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Padre">Padre</MenuItem>
                  <MenuItem value="Madre">Madre</MenuItem>
                  <MenuItem value="Tutor">Tutor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.genero}>
                <InputLabel>Género</InputLabel>
                <Select
                  name="genero"
                  value={formData.genero}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_nacimiento}
                helperText={errors.fecha_nacimiento}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.grado_estudiante}>
                <InputLabel>Grado</InputLabel>
                <Select
                  name="grado_estudiante"
                  value={formData.grado_estudiante}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Primero">Primero</MenuItem>
                  <MenuItem value="Segundo">Segundo</MenuItem>
                  <MenuItem value="Tercero">Tercero</MenuItem>
                  <MenuItem value="Cuarto">Cuarto</MenuItem>
                  <MenuItem value="Quinto">Quinto</MenuItem>
                  <MenuItem value="Sexto">Sexto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.uuid}>
                <InputLabel>Estudiante</InputLabel>
                <Select
                  name="uuid"
                  value={formData.uuid}
                  onChange={handleSelectChange}
                >
                  {filteredEstudiantes.map((e: any) => (
                    <MenuItem key={e.uuid} value={e.uuid}>
                      {e.primer_nombre} - {e.grado_estudiante}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenCancelDialog}
              sx={{ mr: 2 }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} /> : "Guardar"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle sx={{ fontFamily }}>¿Cancelar registro?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            Si cancelas, se perderán los datos ingresados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} sx={{ fontFamily }}>
            No
          </Button>
          <Button onClick={handleConfirmCancel} autoFocus sx={{ fontFamily }}>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioApoderado;
