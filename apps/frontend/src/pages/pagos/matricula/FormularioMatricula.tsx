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
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { useGetMatriculaPagos, useCrearMatricula, useGetMatriculaByUuid } from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";
import FeedbackModal, { FeedbackStatus } from "@/components/FeedbackModal/FeedbackModal";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.uuid_estudiante) newErrors.uuid_estudiante = "Seleccione un estudiante.";
    if (!formData.fecha_matricula) newErrors.fecha_matricula = "Seleccione una fecha.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      onClose();
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", px: 2, py: 4 }}>
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle sx={{ fontFamily, color: "#1A1363" }}>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            ¿Seguro que quieres cancelar el proceso?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} sx={{ fontFamily, color: "#1A1363" }}>
            No
          </Button>
          <Button
            onClick={() => {
              setOpenCancelDialog(false);
              onClose?.();
              navigate("/pagos/matricula");
            }}
            sx={{ fontFamily, color: "#1A1363" }}
            autoFocus
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

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
                      <MenuItem
                        key={est.uuid_estudiante}
                        value={est.uuid_estudiante}
                        sx={{ fontFamily }}
                      >
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
            </Grid>

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
                disabled={isSubmitting}
                sx={{
                  bgcolor: "#538A3E",
                  fontFamily,
                  color: "white",
                  px: 4,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#426E30",
                  },
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