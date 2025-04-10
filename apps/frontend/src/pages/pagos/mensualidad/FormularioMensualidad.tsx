"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,

} from "@mui/material";

const fontFamily = "'Nunito', sans-serif";

const estudiantes = [
  { numero: "EST001", nombre: "Abigail López" },
  { numero: "EST002", nombre: "Carlos Martínez" },
  { numero: "EST003", nombre: "María Rodríguez" },
  { numero: "EST004", nombre: "Juan Pérez" },
  { numero: "EST005", nombre: "Ana Fernández" },
];

interface FormularioMensualidadProps {
  mensualidadId?: string | number;
  isEditing?: boolean;
  onClose?: () => void;
  comprobante?: string; // solo por compatibilidad
}

const FormularioMensualidad: React.FC<FormularioMensualidadProps> = ({
  mensualidadId,
  isEditing = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [formData, setFormData] = useState({
    numero_estudiante: "",
    nombre_estudiante: "",
    grado: "",
    seccion: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    monto_total: 5000,
    beneficio_aplicado: "",
    porcentaje_descuento: "0%",
    saldo_pagado: 0,
    recargo: 0,
    estado: "Pendiente",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && mensualidadId) {
      setIsLoading(true);
      setTimeout(() => {
        setFormData({
          numero_estudiante: "EST001",
          nombre_estudiante: "Abigail López",
          grado: "Sexto",
          seccion: "A",
          fecha_inicio: "2025-02-01",
          fecha_vencimiento: "2025-03-01",
          monto_total: 5000,
          beneficio_aplicado: "Descuento Hermanos",
          porcentaje_descuento: "25%",
          saldo_pagado: 3750,
          recargo: 0,
          estado: "Parcial",
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, mensualidadId]);

  const calculateSaldoPendiente = () => {
    const porcentaje = parseInt(formData.porcentaje_descuento.replace('%', ''));
    const descuento = formData.monto_total * (porcentaje / 100);
    const totalConDescuento = formData.monto_total - descuento;
    return totalConDescuento - formData.saldo_pagado + formData.recargo;
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
        [name]: name === "saldo_pagado" || name === "recargo" 
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
    if (!formData.fecha_inicio) newErrors.fecha_inicio = "Fecha inicio requerida";
    if (!formData.fecha_vencimiento) newErrors.fecha_vencimiento = "Fecha vencimiento requerida";
    if (formData.monto_total <= 0) newErrors.monto_total = "Monto inválido";
    if (formData.saldo_pagado < 0) newErrors.saldo_pagado = "Valor inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Datos guardados:", {
          ...formData,
          saldo_pendiente: calculateSaldoPendiente()
        });
        setIsSubmitting(false);
        setAlertMessage("Se guardó exitosamente la mensualidad");
        setAlertSeverity("success");
        setAlertOpen(true);
      }, 1500);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
    if (alertSeverity === "success") {
      onClose?.();
      navigate("/pagos/mensualidad");
    }
  };

   // Estilo para botón primario verde



  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
    <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>

      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle sx={{ fontFamily, color: '#1A1363' }}>
          Confirmar Cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            ¿Seguro que quieres cancelar el proceso?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenCancelDialog(false)}
            sx={{ fontFamily, color: '#1A1363' }}
          >
            No
          </Button>
          <Button
         onClick={() => {setOpenCancelDialog(false);  // Cerrar el diálogo
          onClose?.();                 // Ejecutar cierre del formulario si es necesario
       navigate("/pagos/mensualidad"); }}
       sx={{ fontFamily, color: '#1A1363' }}
       autoFocus
          >
              Sí
            </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontFamily, color: '#1A1363', textAlign: "center" }}>
          {isEditing ? "Editar Mensualidad" : "Nueva Mensualidad"}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#538A3E' }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.numero_estudiante}>
                  <InputLabel>Seleccionar Estudiante</InputLabel>
                  <Select
                    name="numero_estudiante"
                    value={formData.numero_estudiante}
                    onChange={handleChange}
                    label="Seleccionar Estudiante"
                  >
                    {estudiantes.map(est => (
                      <MenuItem key={est.numero} value={est.numero}>
                        {est.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código Estudiante"
                  value={formData.numero_estudiante}
                  InputProps={{ readOnly: true }}
                  sx={{ bgcolor: '#f5f5f5' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.grado}>
                  <InputLabel>Grado</InputLabel>
                  <Select
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    label="Grado"
                  >
                    {['Kinder', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'].map(grado => (
                      <MenuItem key={grado} value={grado}>{grado}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.seccion}>
                  <InputLabel>Sección</InputLabel>
                  <Select
                    name="seccion"
                    value={formData.seccion}
                    onChange={handleChange}
                    label="Sección"
                  >
                    {['A', 'B'].map(seccion => (
                      <MenuItem key={seccion} value={seccion}>{`Sección ${seccion}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Inicio"
                  name="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fecha_inicio}
                  helperText={errors.fecha_inicio}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Vencimiento"
                  name="fecha_vencimiento"
                  type="date"
                  value={formData.fecha_vencimiento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fecha_vencimiento}
                  helperText={errors.fecha_vencimiento}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monto Total"
                  name="monto_total"
                  type="number"
                  value={formData.monto_total}
                  onChange={handleChange}
                  error={!!errors.monto_total}
                  helperText={errors.monto_total}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Beneficio Aplicado</InputLabel>
                  <Select
                    name="beneficio_aplicado"
                    value={formData.beneficio_aplicado}
                    onChange={handleChange}
                    label="Beneficio Aplicado"
                  >
                    <MenuItem value="">Ninguno</MenuItem>
                    <MenuItem value="Beca Excelencia">Beca Excelencia</MenuItem>
                    <MenuItem value="Descuento Hermanos">Descuento Hermanos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="% Descuento"
                  name="porcentaje_descuento"
                  type="number"
                  value={formData.porcentaje_descuento}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Saldo Pagado"
                  name="saldo_pagado"
                  type="number"
                  value={formData.saldo_pagado}
                  onChange={handleChange}
                  error={!!errors.saldo_pagado}
                  helperText={errors.saldo_pagado}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Recargo"
                  name="recargo"
                  type="number"
                  value={formData.recargo}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Saldo Pendiente"
                  value={`L. ${calculateSaldoPendiente().toFixed(2)}`}
                  InputProps={{ readOnly: true }}
                  sx={{ bgcolor: "#f5f5f5", fontWeight: 600 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    label="Estado"
                  >
                    <MenuItem value="Pagado">Pagado</MenuItem>
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="Parcial">Parcial</MenuItem>
                    <MenuItem value="Moroso">Moroso</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
              <Button
            variant="outlined"
            onClick={() => setOpenCancelDialog(true)}  // Cambiado aquí
            sx={{
              fontFamily,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              borderColor: '#1A1363',
              color: '#1A1363',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#1A136310',
                borderColor: '#1A1363',
              },
            }}
          >
            Cancelar
          </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEditing ? "Guardar Cambios" : "Registrar Mensualidad"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default FormularioMensualidad;
