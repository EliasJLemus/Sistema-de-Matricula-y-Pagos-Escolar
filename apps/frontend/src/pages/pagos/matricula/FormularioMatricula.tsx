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

// Lista mock de estudiantes
const estudiantes = [
  { numero: "EST001", nombre: "Abigail López" },
  { numero: "EST002", nombre: "Carlos Martínez" },
  { numero: "EST003", nombre: "María Rodríguez" },
  { numero: "EST004", nombre: "Juan Pérez" },
  { numero: "EST005", nombre: "Ana Fernández" },
];

interface FormularioMatriculaProps {
  matriculaId?: string | number;
  isEditing?: boolean;
  onClose?: () => void;
}

const FormularioMatricula: React.FC<FormularioMatriculaProps> = ({
  matriculaId,
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
    fecha_matricula: "",
    tarifa_base: 5000,
    beneficio_aplicado: "",
    descuento_aplicado: "0%",
    total_pagar: 5000,
    estado: "Pendiente",
    comprobante: "Pendiente",
    anno_academico: new Date().getFullYear().toString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && matriculaId) {
      setIsLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        setFormData({
          numero_estudiante: "EST001",
          nombre_estudiante: "Abigail López",
          grado: "Sexto",
          seccion: "A",
          fecha_matricula: "2025-01-05",
          tarifa_base: 5000,
          beneficio_aplicado: "Beca Excelencia",
          descuento_aplicado: "50%",
          total_pagar: 2500,
          estado: "Pagado",
          comprobante: "Enviado",
          anno_academico: "2025"
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, matriculaId]);

  const calculateTotal = (tarifa: number, descuento: string) => {
    const porcentaje = parseInt(descuento) / 100;
    return tarifa - tarifa * porcentaje;
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
      setFormData(prev => {
        let newData = { ...prev, [name]: value };
        
        if (name === "tarifa_base" || name === "descuento_aplicado") {
          const tarifa = name === "tarifa_base" ? Number(value) : prev.tarifa_base;
          const descuento = name === "descuento_aplicado" ? value : prev.descuento_aplicado;
          
          newData.total_pagar = calculateTotal(
            Number(tarifa),
            descuento.replace('%', '')
          );
        }
        
        return newData;
      });
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.numero_estudiante) newErrors.numero_estudiante = "Seleccione un estudiante";
    if (!formData.grado) newErrors.grado = "Seleccione un grado";
    if (!formData.seccion) newErrors.seccion = "Seleccione sección";
    if (!formData.fecha_matricula) newErrors.fecha_matricula = "Fecha requerida";
    if (formData.tarifa_base <= 0) newErrors.tarifa_base = "Tarifa inválida";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Datos guardados:", formData);
        setIsSubmitting(false);
        onClose?.();
        navigate("/matriculas");
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
          {isEditing ? "Editar Matrícula" : "Nueva Matrícula"}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#538A3E' }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Columna izquierda: Formulario principal */}
              <Grid item xs={12} md={isEditing ? 12 : 12}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: "#1A1363",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#1A1363"
                      >
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                      </svg>
                      Información de Matrícula
                    </Typography>

                    <Grid container spacing={2}>
                      {/* Campos del formulario */}
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
                              <MenuItem 
                                key={estudiante.numero} 
                                value={estudiante.numero}
                                sx={{ fontFamily }}
                              >
                                {estudiante.nombre}
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

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Código de Estudiante"
                          value={formData.numero_estudiante}
                          InputProps={{ readOnly: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontWeight: 600,
                              backgroundColor: '#f5f5f5'
                            }
                          }}
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
                              <MenuItem key={grado} value={grado} sx={{ fontFamily }}>
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
                              <MenuItem key={seccion} value={seccion} sx={{ fontFamily }}>
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
             

              {/* Sección Detalles de Pago */}
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      mb: 3, 
                      color: '#1A1363',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1A1363">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      Detalles de Pago
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Fecha Matrícula"
                          name="fecha_matricula"
                          type="date"
                          value={formData.fecha_matricula}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.fecha_matricula}
                          helperText={errors.fecha_matricula}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Tarifa Base"
                          name="tarifa_base"
                          type="number"
                          value={formData.tarifa_base}
                          onChange={handleChange}
                          error={!!errors.tarifa_base}
                          helperText={errors.tarifa_base}
                          InputProps={{ 
                            startAdornment: 'L. ',
                            inputProps: { min: 0 }
                          }}
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
                        <FormControl fullWidth>
                          <InputLabel>Descuento</InputLabel>
                          <Select
                            name="descuento_aplicado"
                            value={formData.descuento_aplicado}
                            onChange={handleChange}
                            label="Descuento"
                          >
                            {[0, 10, 20, 25, 30, 50, 100].map(desc => (
                              <MenuItem key={desc} value={`${desc}%`}>
                                {desc}% Descuento
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Total a Pagar"
                          value={`L. ${formData.total_pagar.toFixed(2)}`}
                          InputProps={{ readOnly: true }}
                          sx={{ 
                            bgcolor: '#f5f5f5',
                            '& .MuiInputBase-input': { fontWeight: 600 }
                          }}
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
                            <MenuItem value="Moroso">Moroso</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Comprobante</InputLabel>
                          <Select
                            name="comprobante"
                            value={formData.comprobante}
                            onChange={handleChange}
                            label="Comprobante"
                          >
                            <MenuItem value="Enviado">Enviado</MenuItem>
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Botones de Acción */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  {/* Botón Cancelar */}
                  <Button
                    variant="outlined"
                    onClick={onClose || (() => navigate("/matriculas"))}
                    sx={{
                      fontFamily,
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      borderColor: "#1A1363",
                      color: "#1A1363",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#1A136310",
                        borderColor: "#1A1363",
                      },
                    }}
                  >
                    Cancelar
                  </Button>

                  {/* Botón Registrar y Generar Factura */}
                  {!isEditing && (
                    <Button
                      variant="contained"
                      sx={{
                        fontFamily,
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#F38223",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#d96d1c" },
                      }}
                      onClick={() => {
                        console.log("Registrar y Generar Factura");
                        // Aquí puedes agregar la lógica para registrar y generar factura
                      }}
                    >
                      Registrar y Generar Factura
                    </Button>
                  )}

                  {/* Botón Efectuar Pago */}
                  {!isEditing && (
                    <Button
                      variant="contained"
                      sx={{
                        fontFamily,
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#538A3E",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#3e682e" },
                      }}
                      onClick={() => {
                        console.log("Efectuar Pago");
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

export default FormularioMatricula;