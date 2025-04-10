"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
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
import { useGetMatriculaPagos, useCrearMatricula, useGetMatriculaByUuid } from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";
import FeedbackModal, { FeedbackStatus } from "@/components/FeedbackModal/FeedbackModal";

const fontFamily = "'Nunito', sans-serif";

interface FormularioMatriculaProps {
  matriculaId?: string | number;
  isEditing?: boolean;
  onClose: () => void;
}

const FormularioMatricula: React.FC<FormularioMatriculaProps> = ({
  matriculaId,
  isEditing = false,
  onClose,
}) => {
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const { data: dataMatricula, isLoading: isLoadingMatricula } = useGetMatriculaByUuid(
    typeof matriculaId === "string" ? matriculaId : ""
  );

  const { data, isLoading: isLoadingLista } = useGetMatriculaPagos({
    page: 1,
    limit: 100,
    grado: gradoSeleccionado,
    year: new Date().getFullYear(),
  });

  const { mutate: crearMatricula } = useCrearMatricula();

  const estudiantesFiltrados = data?.data.filter(
    (e) => e.uuid_estudiante && e.nombre_estudiante
  );

  useEffect(() => {
    if (isEditing && dataMatricula?.data) {
      const matricula = dataMatricula.data;
      setGradoSeleccionado(matricula.grado || "");
      setUuidEstudianteSeleccionado(matricula.uuid_estudiante || "");
      setFormData(matricula);
    }
  }, [isEditing, dataMatricula]);

  useEffect(() => {
    if (!isEditing && uuidEstudianteSeleccionado) {
      const estudiante = estudiantesFiltrados?.find(
        (est) => est.uuid_estudiante === uuidEstudianteSeleccionado
      );
      if (estudiante) {
        setFormData({
          ...estudiante,
          fecha_matricula: new Date().toISOString().split("T")[0],
          uuid_matricula: estudiante.uuid_matricula,
        });
      }
    }
  }, [uuidEstudianteSeleccionado]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "grado") {
      setGradoSeleccionado(value);
      setUuidEstudianteSeleccionado("");
      setFormData({});
    } else if (name === "uuid_estudiante") {
      setUuidEstudianteSeleccionado(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      onClose();
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.uuid_estudiante || !formData.fecha_matricula) {
      setAlertMessage("Faltan campos obligatorios: estudiante o fecha.");
      setAlertOpen(true);
      return;
    }

    setModalOpen(true);
    setModalStatus("loading");
    setModalTitle("Registrando...");
    setModalDescription("Estamos registrando la matrícula...");

    crearMatricula(
      {
        uuid_estudiante: formData.uuid_estudiante,
        fecha_matricula: formData.fecha_matricula,
      },
      {
        onSuccess: (res: any) => {
          if (res.success) {
            setModalStatus("success");
            setModalTitle("¡Matrícula registrada!");
            setModalDescription(res.data);
          } else {
            setModalStatus("error");
            setModalTitle("Error");
            setModalDescription(res.message);
          }
        },
        onError: (error: any) => {
          setModalStatus("error");
          setModalTitle("Error");
          setModalDescription(error.message || "Error al registrar la matrícula.");
        },
      }
    );
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Datos guardados:",formData);
        setIsSubmitting(false);
        setAlertMessage("Se guardó exitosamente la matricula");
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
      navigate("/pagos/matricula");
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
    <Box sx={{ maxWidth: 1000, margin: "auto", px: 2, py: 4 }}>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert severity="error">{alertMessage}</Alert>
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
              navigate("/pagos/matricula");
            }}
            sx={{ fontFamily, color: '#1A1363' }}
            autoFocus
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 6,
          bgcolor: "#FAFAFF",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontFamily,
            color: "#1A1363",
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {isEditing ? "Edición de Matrícula" : "Registro de Matrícula"}
        </Typography>

        {isLoadingLista || (isEditing && isLoadingMatricula) ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#538A3E" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.grado}>
                  <InputLabel>Grado</InputLabel>
                  <Select
                    name="grado"
                    value={gradoSeleccionado}
                    onChange={handleChange}
                    label="Grado"
                    disabled={isEditing}
                    sx={{ fontFamily }}
                  >
                    {["Kinder", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno"].map((grado) => (
                      <MenuItem key={grado} value={grado} sx={{ fontFamily }}>
                        {grado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.uuid_estudiante}>
                  <InputLabel>Estudiante</InputLabel>
                  <Select
                    name="uuid_estudiante"
                    value={uuidEstudianteSeleccionado}
                    onChange={handleChange}
                    label="Estudiante"
                    disabled={isEditing}
                    sx={{ fontFamily }}
                  >
                    {estudiantesFiltrados?.map((est) => (
                      <MenuItem key={est.uuid_estudiante} value={est.uuid_estudiante} sx={{ fontFamily }}>
                        {est.nombre_estudiante}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {[["codigo_estudiante", "Código Estudiante"], ["nombre_estudiante", "Nombre Estudiante"], ["seccion", "Sección"], ["tarifa_base", "Tarifa Base"], ["beneficio_aplicado", "Beneficio Aplicado"], ["descuento_aplicado", "Descuento"], ["total_pagar", "Total a Pagar"], ["estado", "Estado"], ["estado_comprobante", "Comprobante"], ["year_academico", "Año Académico"], ["nombre_encargado_principal", "Encargado Principal"], ["codigo_encargado_principal", "Código Encargado Principal"]].map(([field, label]) => (
                <Grid item xs={12} md={6} key={field}>
                  <TextField
                    fullWidth
                    label={label}
                    value={formData[field as keyof MatriculaType] || ""}
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontWeight: 600,
                        backgroundColor: "#F3F4F6",
                        fontFamily,
                      },
                      fontFamily,
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Matrícula"
                  name="fecha_matricula"
                  type="date"
                  value={formData.fecha_matricula || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ fontFamily }}
                />
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

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                      fontFamily,
                      borderColor: "#1A1363",
                      color: "#1A1363",
                      px: 4,
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#1A1363",
                        backgroundColor: "#F0F0FF",
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      fontFamily,
                      bgcolor: "#538A3E",
                      color: "#fff",
                      px: 4,
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#426E30",
                      },
                    }}
                  >
                    {isEditing ? "Actualizar Matrícula" : "Registrar Matrícula"}
                  </Button>
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
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={primaryButtonStyle}
              startIcon={  // Cambiado de endIcon a startIcon
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

      <FeedbackModal
        open={modalOpen}
        status={modalStatus}
        title={modalTitle}
        description={modalDescription}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default FormularioMatricula;
