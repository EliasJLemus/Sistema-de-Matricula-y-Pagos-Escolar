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
} from "@mui/material";

const fontFamily = "'Nunito', sans-serif";

// Lista mock de estudiantes (puedes reutilizar la misma)
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

  const [formData, setFormData] = useState({
    numero_estudiante: "",
    nombre_estudiante: "",
    grado: "",
    seccion: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    monto_total: 5000,
    beneficio_aplicado: "",
    porcentaje_descuento: 0,
    saldo_pagado: 0,
    recargo: 0,
    estado: "Pendiente",
    comprobante: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && mensualidadId) {
      setIsLoading(true);
      // Simular carga de datos de mensualidad
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
          porcentaje_descuento: 25,
          saldo_pagado: 3750,
          recargo: 0,
          estado: "Parcial",
          comprobante: "",
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, mensualidadId]);

  const calculateSaldoPendiente = () => {
    const descuento = formData.monto_total * (formData.porcentaje_descuento / 100);
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
        [name]: name === "porcentaje_descuento" || name === "saldo_pagado" || name === "recargo" 
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
        onClose?.();
        navigate("/mensualidades");
      }, 1500);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ 
          mb: 4, 
          fontFamily, 
          color: '#1A1363',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1A1363">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0l5.59-5.59a.996.996 0 1 0-1.41-1.41z"/>
          </svg>
          {isEditing ? "Editar Mensualidad" : "Nueva Mensualidad"}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#538A3E' }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Columna izquierda: Formulario */}
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1A1363', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A1363">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                      </svg>
                      Información de la Mensualidad
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.numero_estudiante}>
                          <InputLabel>Seleccionar Estudiante</InputLabel>
                          <Select
                            name="numero_estudiante"
                            value={formData.numero_estudiante}
                            onChange={handleChange}
                            label="Seleccionar Estudiante"
                          >
                            {estudiantes.map(estudiante => (
                              <MenuItem key={estudiante.numero} value={estudiante.numero}>
                                {estudiante.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Código de Estudiante"
                          value={formData.numero_estudiante}
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { fontWeight: 600, backgroundColor: '#f5f5f5' }}}
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
                            {['Kinder', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 
                              'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno'].map(grado => (
                              <MenuItem key={grado} value={grado}>
                                {grado}
                              </MenuItem>
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
                              <MenuItem key={seccion} value={seccion}>
                                Sección {seccion}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Columna derecha: Imagen del comprobante */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: '#1A1363', fontFamily }}>
                    Comprobante de Pago
                  </Typography>

                  {/* Espacio para cargar la imagen */}
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

                  {/* Botón para cargar la imagen */}
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
                </Paper>
              </Grid>

              {/* Sección Detalles de Pago */}
              <Grid item xs={12}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1A1363', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A1363">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      Detalles de Pago
                    </Typography>

                    <Grid container spacing={2}>
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
                          InputProps={{ startAdornment: 'L. ', inputProps: { min: 0 } }}
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
                            <MenuItem value="Beca Deportiva">Beca Deportiva</MenuItem>
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
                          InputProps={{ startAdornment: 'L. ', inputProps: { min: 0 } }}
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
                          InputProps={{ startAdornment: 'L. ', inputProps: { min: 0 } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Saldo Pendiente"
                          value={`L. ${calculateSaldoPendiente().toFixed(2)}`}
                          InputProps={{ readOnly: true }}
                          sx={{ bgcolor: '#f5f5f5', '& .MuiInputBase-input': { fontWeight: 600 } }}
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Botones de Acción */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  {/* Botón Cancelar */}
                  <Button
                    variant="outlined"
                    onClick={onClose || (() => navigate('/mensualidades'))}
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

                  {/* Botón Registrar y Generar Factura */}
                  {isEditing && (
                    <Button
                      variant="contained"
                      sx={{
                        fontFamily,
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        bgcolor: '#F38223',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#d96d1c' },
                      }}
                      onClick={() => {
                        console.log('Registrar y Generar Factura');
                        // Aquí puedes agregar la lógica para registrar y generar factura
                      }}
                    >
                      Registrar y Generar Factura
                    </Button>
                  )}

                  {/* Botón Efectuar Pago */}
                  {isEditing && (
                    <Button
                      variant="contained"
                      sx={{
                        fontFamily,
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        bgcolor: '#538A3E',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#3e682e' },
                      }}
                      onClick={() => {
                        console.log('Efectuar Pago');
                        // Aquí puedes agregar la lógica para efectuar el pago
                      }}
                    >
                      Efectuar Pago
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default FormularioMensualidad;