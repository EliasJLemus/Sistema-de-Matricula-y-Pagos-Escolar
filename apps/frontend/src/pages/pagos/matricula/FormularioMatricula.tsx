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
} from "@mui/material";

const fontFamily = "'Nunito', sans-serif";

// Estudiantes simulados
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
  estudianteId?: string | number;
  isModal?: boolean;
}

const FormularioMatricula: React.FC<FormularioMatriculaProps> = ({
  matriculaId,
  isEditing = false,
  onClose,
  estudianteId,
  isModal = false,
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
    if (isEditing && (matriculaId || estudianteId)) {
      setIsLoading(true);
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
          anno_academico: "2025",
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, matriculaId, estudianteId]);

  const calculateTotal = (tarifa: number, descuento: string) => {
    const porcentaje = parseInt(descuento) / 100;
    return tarifa - tarifa * porcentaje;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "numero_estudiante") {
      const estudianteSeleccionado = estudiantes.find(
        (est) => est.numero === value
      );
      setFormData((prev) => ({
        ...prev,
        numero_estudiante: value,
        nombre_estudiante: estudianteSeleccionado?.nombre || "",
      }));
    } else {
      setFormData((prev) => {
        let newData = { ...prev, [name]: value };

        if (name === "tarifa_base" || name === "descuento_aplicado") {
          const tarifa =
            name === "tarifa_base" ? Number(value) : prev.tarifa_base;
          const descuento =
            name === "descuento_aplicado"
              ? value
              : prev.descuento_aplicado;

          newData.total_pagar = calculateTotal(
            Number(tarifa),
            descuento.replace("%", "")
          );
        }

        return newData;
      });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.numero_estudiante)
      newErrors.numero_estudiante = "Seleccione un estudiante";
    if (!formData.grado) newErrors.grado = "Seleccione un grado";
    if (!formData.seccion) newErrors.seccion = "Seleccione sección";
    if (!formData.fecha_matricula)
      newErrors.fecha_matricula = "Fecha requerida";
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
        if (!isModal) navigate("/matriculas");
      }, 1500);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", p: 3 }}>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontFamily,
            color: "#1A1363",
            fontWeight: 700,
          }}
        >
          {isEditing ? "Editar Matrícula" : "Nueva Matrícula"}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#538A3E" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Selección estudiante */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.numero_estudiante}>
                  <InputLabel>Seleccionar Estudiante</InputLabel>
                  <Select
                    name="numero_estudiante"
                    value={formData.numero_estudiante}
                    onChange={handleChange}
                    label="Seleccionar Estudiante"
                  >
                    {estudiantes.map((est) => (
                      <MenuItem key={est.numero} value={est.numero}>
                        {est.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Código estudiante (readonly) */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código de Estudiante"
                  name="codigo_estudiante"
                  value={formData.numero_estudiante}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>

              {/* Nombre estudiante (readonly) */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Estudiante"
                  name="nombre_estudiante"
                  value={formData.nombre_estudiante}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>

              {/* Grado */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.grado}>
                  <InputLabel>Grado</InputLabel>
                  <Select
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    label="Grado"
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
                      <MenuItem key={grado} value={grado}>
                        {grado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sección */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.seccion}>
                  <InputLabel>Sección</InputLabel>
                  <Select
                    name="seccion"
                    value={formData.seccion}
                    onChange={handleChange}
                    label="Sección"
                  >
                    {["A", "B"].map((seccion) => (
                      <MenuItem key={seccion} value={seccion}>
                        Sección {seccion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Fecha de matrícula */}
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

              {/* Tarifa Base */}
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
                />
              </Grid>

              {/* Descuento */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Descuento</InputLabel>
                  <Select
                    name="descuento_aplicado"
                    value={formData.descuento_aplicado}
                    onChange={handleChange}
                    label="Descuento"
                  >
                    {[0, 10, 20, 30, 50, 100].map((p) => (
                      <MenuItem key={p} value={`${p}%`}>
                        {p}% Descuento
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Total a pagar (readonly) */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total a Pagar"
                  value={`L. ${formData.total_pagar.toFixed(2)}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Botones */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={onClose || (() => navigate("/matriculas"))}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isEditing ? "Guardar Cambios" : "Registrar Matrícula"}
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
