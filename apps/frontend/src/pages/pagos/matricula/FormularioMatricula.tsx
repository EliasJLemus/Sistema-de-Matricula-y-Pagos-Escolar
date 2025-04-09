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
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", px: 2, py: 4 }}>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>

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
