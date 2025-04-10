// FormularioMatricula.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  useGetMatriculaPagos,
  useCrearMatricula,
  useGetMatriculaByUuid,
  useGetVistaDetalleMatricula,
} from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";
import FeedbackModal, { FeedbackStatus } from "@/components/FeedbackModal/FeedbackModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const { data: dataMatricula, isLoading: isLoadingMatricula } = useGetMatriculaByUuid(
    typeof matriculaId === "string" ? matriculaId : ""
  );

  const {
    data: vistaDetalleMatricula,
  } = useGetVistaDetalleMatricula(uuidEstudianteSeleccionado);

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
    if (!isEditing && uuidEstudianteSeleccionado && vistaDetalleMatricula?.data) {
      const estudiante = estudiantesFiltrados?.find(
        (est) => est.uuid_estudiante === uuidEstudianteSeleccionado
      );

      if (estudiante) {
        setFormData({
          ...estudiante,
          fecha_matricula: new Date().toISOString().split("T")[0],
          uuid_matricula: estudiante.uuid_matricula,
          codigo_plan_detallado: vistaDetalleMatricula.data.codigo_plan_detallado,
          codigo_plan_matricula: vistaDetalleMatricula.data.codigo_plan_matricula,
          tarifa_plan_matricula: vistaDetalleMatricula.data.tarifa_plan_matricula,
          vencimiento: vistaDetalleMatricula.data.vencimiento,
          tipo_plan_matricula: vistaDetalleMatricula.data.tipo_plan_matricula,
          nivel_plan_matricula: vistaDetalleMatricula.data.nivel_plan_matricula,
          year_plan_matricula: vistaDetalleMatricula.data.year_plan_matricula,
          nombre_beca: vistaDetalleMatricula.data.nombre_beca,
          descuento: vistaDetalleMatricula.data.descuento,
          codigo_beca: vistaDetalleMatricula.data.codigo_beca,
          total_matricula: vistaDetalleMatricula.data.total_matricula,
        });
      }
    }
  }, [uuidEstudianteSeleccionado, vistaDetalleMatricula]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.uuid_estudiante) newErrors.uuid_estudiante = "Seleccione un estudiante.";
    if (!formData.fecha_matricula) newErrors.fecha_matricula = "Seleccione una fecha.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSnackbarClose = () => {
    setAlertOpen(false);
    if (alertSeverity === "success") {
      onClose?.();
      navigate("/pagos/matricula");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage("Faltan campos obligatorios.");
      setAlertOpen(true);
      return;
    }

    setIsSubmitting(true);
    setModalOpen(true);
    setModalStatus("loading");
    setModalTitle("Registrando...");
    setModalDescription("Estamos registrando la matrícula...");

    crearMatricula(
      {
        uuid_estudiante: formData.uuid_estudiante!,
        fecha_matricula: formData.fecha_matricula!,
      },
      {
        onSuccess: (res: any) => {
          setIsSubmitting(false);
          if (res.success) {
            setModalStatus("success");
            setModalTitle("¡Matrícula registrada!");
            setModalDescription(res.data);
            queryClient.invalidateQueries({ queryKey: ["getMatriculaPagos"] });
          } else {
            setModalStatus("error");
            setModalTitle("Error");
            setModalDescription(res.message);
          }
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          setModalStatus("error");
          setModalTitle("Error");
          setModalDescription(error.message || "Error al registrar la matrícula.");
        },
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", px: 2, py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6, bgcolor: "#FAFAFF" }}>
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

        {(isLoadingLista || (isEditing && isLoadingMatricula)) ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#538A3E" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Campos de selección y solo lectura */}
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

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Matrícula"
                  name="fecha_matricula"
                  type="date"
                  value={formData.fecha_matricula || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fecha_matricula}
                  helperText={errors.fecha_matricula}
                  sx={{ fontFamily }}
                />
              </Grid>

              {/* Campos de solo lectura */}
              {[
                ["Tipo de Pago", "tipo_pago"],
                ["Descripción", "descripcion"],
                ["Periodicidad", "periodicidad"],
                ["Código Plan Detallado", "codigo_plan_detallado"],
                ["Código Plan Matrícula", "codigo_plan_matricula"],
                ["Tarifa del Plan", "tarifa_plan_matricula"],
                ["Vencimiento", "vencimiento"],
                ["Tipo Plan Matrícula", "tipo_plan_matricula"],
                ["Nivel", "nivel_plan_matricula"],
                ["Año Académico", "year_plan_matricula"],
                ["Beca Aplicada", "nombre_beca"],
                ["Descuento", "descuento"],
                ["Código de Beca", "codigo_beca"],
              ].map(([label, key], i) => (
                <Grid item xs={12} md={6} key={key}>
                  <TextField
                    fullWidth
                    label={label}
                    value={
                      key === "descuento"
                        ? formData.descuento
                          ? `${formData.descuento}%`
                          : "0%"
                        : key === "vencimiento"
                        ? formData.vencimiento?.substring(0, 10) || ""
                        : formData[key as keyof MatriculaType] || ""
                    }
                    InputProps={{ readOnly: true }}
                    sx={{ fontFamily }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total a Pagar"
                  value={`L. ${formData.total_matricula || formData.tarifa_plan_matricula || "0.00"}`}
                  InputProps={{ readOnly: true }}
                  sx={{ fontFamily, fontWeight: 600 }}
                />
              </Grid>

              {/* Botones */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenCancelDialog(true)}
                    sx={{
                      fontFamily,
                      borderColor: "#1A1363",
                      color: "#1A1363",
                      px: 4,
                      fontWeight: 600,
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#538A3E",
                      fontFamily,
                      color: "white",
                      px: 4,
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#426E30" },
                    }}
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Actualizando..."
                        : "Guardando..."
                      : isEditing
                      ? "Actualizar Matrícula"
                      : "Registrar Matrícula"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      {/* Modales y alertas */}
      <FeedbackModal
        open={modalOpen}
        status={modalStatus}
        title={modalTitle}
        description={modalDescription}
        onClose={handleCloseModal}
      />

      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ fontFamily }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle sx={{ fontFamily, fontWeight: 700 }}>¿Cancelar Registro?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            ¿Estás seguro de que deseas cancelar el registro de esta matrícula? Los datos ingresados no se guardarán.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} sx={{ fontFamily }}>
            Continuar editando
          </Button>
          <Button onClick={() => { setOpenCancelDialog(false); onClose(); }} color="error" variant="contained" sx={{ fontFamily }}>
            Cancelar Registro
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioMatricula;
