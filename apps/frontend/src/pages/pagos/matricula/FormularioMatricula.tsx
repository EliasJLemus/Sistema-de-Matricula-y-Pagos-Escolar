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
import { useNavigate } from "react-router-dom";
import { useGetMatriculaPagos, useCrearMatricula } from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";

const fontFamily = "'Nunito', sans-serif";

const FormularioMatricula = () => {
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { data, isLoading } = useGetMatriculaPagos({
    page: 1,
    limit: 100,
    grado: gradoSeleccionado,
  });

  const { mutate: crearMatricula } = useCrearMatricula();

  const estudiantesFiltrados = data?.data.filter(
    (e) => e.uuid_estudiante && e.nombre_estudiante
  );

  useEffect(() => {
    if (uuidEstudianteSeleccionado) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.uuid_estudiante ||
      !formData.uuid_matricula ||
      !formData.fecha_matricula
    ) {
      setAlertMessage("Faltan campos obligatorios: estudiante, plan o fecha.");
      setAlertOpen(true);
      return;
    }

    crearMatricula(
      {
        uuid_estudiante: formData.uuid_estudiante,
        uuid_matricula: formData.uuid_matricula,
        fecha_matricula: formData.fecha_matricula,
      },
      {
        onSuccess: () => {
          navigate("/matriculas");
        },
        onError: (error: any) => {
          setAlertMessage(error.message);
          setAlertOpen(true);
        },
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", px: 2, py: 4 }}>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
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
          Registro de Matrícula
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#538A3E" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Grado */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.grado}>
                  <InputLabel>Grado</InputLabel>
                  <Select
                    name="grado"
                    value={gradoSeleccionado}
                    onChange={handleChange}
                    label="Grado"
                    sx={{ fontFamily }}
                  >
                    {[
                      "Kinder",
                      "Primero",
                      "Segundo",
                      "Tercero",
                      "Cuarto",
                      "Quinto",
                      "Sexto",
                      "Séptimo",
                      "Octavo",
                      "Noveno",
                    ].map((grado) => (
                      <MenuItem key={grado} value={grado} sx={{ fontFamily }}>
                        {grado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Estudiante */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.uuid_estudiante}>
                  <InputLabel>Estudiante</InputLabel>
                  <Select
                    name="uuid_estudiante"
                    value={uuidEstudianteSeleccionado}
                    onChange={handleChange}
                    label="Estudiante"
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

              {/* Campos autocompletados */}
              {[
                { label: "Código Estudiante", value: formData.codigo_estudiante },
                { label: "Nombre Estudiante", value: formData.nombre_estudiante },
                { label: "Sección", value: formData.seccion },
                { label: "Tarifa Base", value: formData.tarifa_base },
                { label: "Beneficio Aplicado", value: formData.beneficio_aplicado },
                { label: "Descuento", value: formData.descuento_aplicado },
                { label: "Total a Pagar", value: `L. ${formData.total_pagar || "0.00"}` },
                { label: "Estado", value: formData.estado },
                { label: "Comprobante", value: formData.comprobante },
                { label: "Año Académico", value: formData.year_academico },
                {
                  label: "Encargado Principal",
                  value: formData.nombre_encargado_principal?.trim() || "No asignado",
                },
                {
                  label: "Código Encargado Principal",
                  value: formData.codigo_encargado_principal || "No disponible",
                },
                {
                  label: "Encargado Secundario",
                  value: formData.nombre_encargado_secundario?.trim() || "No asignado",
                },
                {
                  label: "Código Encargado Secundario",
                  value: formData.codigo_encargado_secundario || "No disponible",
                },
              ].map(({ label, value }) => (
                <Grid item xs={12} md={6} key={label}>
                  <TextField
                    fullWidth
                    label={label}
                    value={value || ""}
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

              {/* Fecha matrícula */}
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

              {/* Botones */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/matriculas")}
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
                    Registrar Matrícula
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

export default FormularioMatricula;
