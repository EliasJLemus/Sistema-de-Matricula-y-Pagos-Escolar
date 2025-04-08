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

// Lista mock de estudiantes con datos realistas de nivelados
const estudiantes = [
  { numero: "EST001", nombre: "Abigail López", grado: "Kinder", seccion: "A" },
  { numero: "EST002", nombre: "Anna Mejía", grado: "Primero", seccion: "A" },
  { numero: "EST003", nombre: "Berenice Corrales", grado: "Tercero", seccion: "B" },
  { numero: "EST004", nombre: "Carlos López", grado: "Cuarto", seccion: "A" },
  { numero: "EST005", nombre: "Axel López", grado: "Sexto", seccion: "B" },
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
          estado: "Pendiente"
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, niveladoId]);

  const calculateSaldoRestante = () => {
    return formData.saldo_restante - formData.monto_pagado + formData.recargo;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === "numero_estudiante") {
      const estudianteSeleccionado = estudiantes.find(est => est.numero === value);
      setFormData(prev => ({
        ...prev,
        numero_estudiante: value,
        nombre_estudiante: estudianteSeleccionado?.nombre || "",
        grado: estudianteSeleccionado?.grado || "",
        seccion: estudianteSeleccionado?.seccion || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "monto_pagado" || name === "recargo" 
          ? Number(value) 
          : value
      }));
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.numero_estudiante) newErrors.numero_estudiante = "Seleccione un estudiante";
    if (!formData.fecha_pago) newErrors.fecha_pago = "Fecha de pago requerida";
    if (formData.monto_pagado <= 0) newErrors.monto_pagado = "Monto inválido";
    if (formData.saldo_restante < 0) newErrors.saldo_restante = "Valor inválido";
    
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
          saldo_restante: calculateSaldoRestante()
        });
        setIsSubmitting(false);
        onClose?.();
        navigate("/nivelados");
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
          {isEditing ? "Editar Nivelado" : "Nuevo Pago Nivelado"}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#538A3E' }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Sección Información del Estudiante */}
              <Grid item xs={12}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1A1363', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A1363">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                      </svg>
                      Información del Estudiante
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
                                {estudiante.nombre} - {estudiante.grado} {estudiante.seccion}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Grado y Sección"
                          value={`${formData.grado} ${formData.seccion}`}
                          InputProps={{ readOnly: true }}
                          sx={{ '& .MuiInputBase-input': { fontWeight: 600, backgroundColor: '#f5f5f5' }}}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sección Detalles del Nivelado */}
              <Grid item xs={12}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1A1363', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A1363">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      Detalles del Nivelado
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Fecha de Pago"
                          name="fecha_pago"
                          type="date"
                          value={formData.fecha_pago}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.fecha_pago}
                          helperText={errors.fecha_pago}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Monto Pagado"
                          name="monto_pagado"
                          type="number"
                          value={formData.monto_pagado}
                          onChange={handleChange}
                          error={!!errors.monto_pagado}
                          helperText={errors.monto_pagado}
                          InputProps={{ startAdornment: 'L. ', inputProps: { min: 0 } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Saldo Restante"
                          name="saldo_restante"
                          type="number"
                          value={formData.saldo_restante}
                          onChange={handleChange}
                          error={!!errors.saldo_restante}
                          helperText={errors.saldo_restante}
                          InputProps={{ startAdornment: 'L. ', inputProps: { min: 0 } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Beca Aplicada</InputLabel>
                          <Select
                            name="beca_aplicada"
                            value={formData.beca_aplicada}
                            onChange={handleChange}
                            label="Beca Aplicada"
                          >
                            <MenuItem value="Ninguna">Ninguna</MenuItem>
                            <MenuItem value="Excelencia Académica">Excelencia Académica</MenuItem>
                            <MenuItem value="Descuento Hermanos">Descuento Hermanos</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="% Descuento"
                          name="porcentaje_descuento"
                          value={formData.porcentaje_descuento}
                          onChange={handleChange}
                          InputProps={{ readOnly: true }}
                          sx={{ bgcolor: '#f5f5f5' }}
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
                            <MenuItem value="Atrasado">Atrasado</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Botones de Acción */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={onClose || (() => navigate('/nivelados'))}
                    sx={{
                      fontFamily,
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      borderColor: '#1A1363',
                      color: '#1A1363',
                      '&:hover': {
                        bgcolor: '#1A136310',
                        borderColor: '#1A1363'
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      fontFamily,
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      bgcolor: '#538A3E',
                      '&:hover': { bgcolor: '#3e682e' },
                      '&.Mui-disabled': { bgcolor: '#538A3E80' }
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : isEditing ? (
                      'Actualizar Nivelado'
                    ) : (
                      'Registrar Pago'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default FormularioNivelado;