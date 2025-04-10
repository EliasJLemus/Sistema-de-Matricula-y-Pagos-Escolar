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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const fontFamily = "'Nunito', sans-serif";

// Lista mock de estudiantes con datos realistas de nivelados
const estudiantes = [
  { numero: "EST001", nombre: "Abigail López" },
  { numero: "EST002", nombre: "Anna Mejía" },
  { numero: "EST003", nombre: "Berenice Corrales" },
  { numero: "EST004", nombre: "Carlos López" },
  { numero: "EST005", nombre: "Axel López" },
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
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");
const [openCancelDialog, setOpenCancelDialog] = useState(false);

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
    comprobante: ""
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
          estado: "Pendiente",
          comprobante: "",
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
        nombre_estudiante: estudianteSeleccionado?.nombre || ""
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
    if (!formData.grado) newErrors.grado = "Seleccione un grado";
    if (!formData.seccion) newErrors.seccion = "Seleccione sección";
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
        setAlertMessage("Se guardó exitosamente el plan nivelado");
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
      navigate("/pagos/nivelados");
    }
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
            onClick={() => {
              setOpenCancelDialog(false);
              onClose?.();
              navigate("/pagos/nivelados");
            }}
            sx={{ fontFamily, color: '#1A1363' }}
            autoFocus
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>


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
              <Grid item xs={12} md={8}>
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
         <Select name="numero_estudiante" value={formData.numero_estudiante} onChange={handleChange}label="Seleccionar Estudiante" >
     {estudiantes.map(estudiante => ( <MenuItem key={estudiante.numero} value={estudiante.numero} sx={{ fontFamily }} >
    {estudiante.nombre} </MenuItem>))}</Select>
{errors.numero_estudiante && (<Typography variant="caption" color="error"> {errors.numero_estudiante} </Typography>)}
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
                        <FormControl fullWidth>
                          <InputLabel>Descuento</InputLabel>
                          <Select
                            name="descuento_aplicado"
                            value={formData.porcentaje_descuento}
                            onChange={handleChange}
                            label="Descuento"
                          >
                            {[0, 10, 20, 25, 50, 75, 100].map(desc => (
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
                  onClick={() => setOpenCancelDialog(true)}
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
  {/* Botón Registrar y Generar Factura */}
  {isEditing && (
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
                  {isEditing && (
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

export default FormularioNivelado;