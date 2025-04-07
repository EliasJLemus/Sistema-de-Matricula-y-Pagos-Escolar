import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetMatriculaById, useUpdateMatricula, useRegistrarMatricula } from "@/lib/queries"; // ajustá estos hooks si tienen nombres distintos

const fontFamily = "'Nunito', sans-serif";

export interface MatriculaModalProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  matriculaId?: string;
}

const MatriculaModal: React.FC<MatriculaModalProps> = ({
  open,
  onClose,
  isEditing,
  matriculaId,
}) => {
  const [formData, setFormData] = useState({
    codigo_estudiante: "",
    nombre_estudiante: "",
    grado: "",
    seccion: "",
    tarifa_base: "",
    beneficio_aplicado: "",
    descuento_aplicado: "",
    total_pagar: "",
    estado: "",
    comprobante: "",
    fecha_matricula: "",
  });

  const { data, isLoading } = useGetMatriculaById(matriculaId!, { enabled: isEditing && !!matriculaId });
  const updateMutation = useUpdateMatricula(); // ajustá si el hook se llama distinto
  const createMutation = useRegistrarMatricula(); // ajustá si el hook se llama distinto

  useEffect(() => {
    if (isEditing && data?.data) {
      const m = data.data;
      setFormData({
        codigo_estudiante: m.codigo_estudiante || "",
        nombre_estudiante: m.nombre_estudiante || "",
        grado: m.grado || "",
        seccion: m.seccion || "",
        tarifa_base: m.tarifa_base || "",
        beneficio_aplicado: m.beneficio_aplicado || "",
        descuento_aplicado: m.descuento_aplicado || "",
        total_pagar: m.total_pagar || "",
        estado: m.estado || "",
        comprobante: m.comprobante || "",
        fecha_matricula: m.fecha_matricula || "",
      });
    } else {
      setFormData({
        codigo_estudiante: "",
        nombre_estudiante: "",
        grado: "",
        seccion: "",
        tarifa_base: "",
        beneficio_aplicado: "",
        descuento_aplicado: "",
        total_pagar: "",
        estado: "",
        comprobante: "",
        fecha_matricula: "",
      });
    }
  }, [isEditing, data]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && matriculaId) {
        await updateMutation.mutateAsync({ uuid: matriculaId, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err) {
      console.error("Error al guardar matrícula:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontFamily }}>
        {isEditing ? "Editar Matrícula" : "Nueva Matrícula"}
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {[
              { label: "Código", key: "codigo_estudiante" },
              { label: "Nombre del Estudiante", key: "nombre_estudiante" },
              { label: "Grado", key: "grado" },
              { label: "Sección", key: "seccion" },
              { label: "Tarifa Base", key: "tarifa_base" },
              { label: "Beneficio Aplicado", key: "beneficio_aplicado" },
              { label: "Descuento Aplicado", key: "descuento_aplicado" },
              { label: "Total a Pagar", key: "total_pagar" },
              { label: "Estado", key: "estado" },
              { label: "Comprobante", key: "comprobante" },
              { label: "Fecha Matrícula", key: "fecha_matricula" },
            ].map((field) => (
              <Grid item xs={6} key={field.key}>
                <TextField
                  label={field.label}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ fontFamily }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#538A3E",
            color: "white",
            fontFamily,
            "&:hover": { backgroundColor: "#3e682e" },
          }}
          disabled={updateMutation.isLoading || createMutation.isLoading}
        >
          {isEditing ? "Actualizar" : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatriculaModal;
