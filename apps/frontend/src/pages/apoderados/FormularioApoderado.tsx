import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetEstudiantes, useRegistrarApoderado } from "@/lib/queries";
import { TelefonoInput } from "@/components/TelefonoInput";
import FeedbackModal, { FeedbackStatus } from "@/components/FeedbackModal/FeedbackModal";

const fontFamily = "'Nunito', sans-serif";

interface Props {
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioApoderado: React.FC<Props> = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    identidad: "",
    genero: "Masculino",
    fecha_nacimiento: "",
    correo_electronico: "",
    telefono_personal: "",
    parentesco: "",
    es_encargado_principal: false,
    grado_estudiante: "",
    uuid_estudiante: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterEstudiante, setFilterEstudiante] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");

  const { data: estudiantesData } = useGetEstudiantes(1, 10000, {
    grado: formData.grado_estudiante,
  });

  const { mutate: registrarApoderado } = useRegistrarApoderado();

  const filteredEstudiantes =
    estudiantesData?.data?.filter((e: any) =>
      `${e.primer_nombre} ${e.primer_apellido}`.toLowerCase().includes(filterEstudiante.toLowerCase())
    ) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "grado_estudiante" ? { uuid_estudiante: "" } : {}),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTelefonoChange = (value: string) => {
    setFormData((prev) => ({ ...prev, telefono_personal: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.primer_nombre) newErrors.primer_nombre = "Requerido";
    if (!formData.primer_apellido) newErrors.primer_apellido = "Requerido";
    if (!formData.identidad) newErrors.identidad = "Requerido";
    if (!formData.telefono_personal) newErrors.telefono_personal = "Requerido";
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = "Requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = "Correo inválido";
    }
    if (!formData.parentesco) newErrors.parentesco = "Requerido";
    if (!formData.uuid_estudiante) newErrors.uuid_estudiante = "Seleccione un estudiante";
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalOpen(true);
    setModalStatus("loading");
    setModalTitle("Registrando apoderado...");
    setModalDesc("Por favor espere mientras se guarda la información.");

    registrarApoderado(
      {
        primer_nombre: formData.primer_nombre,
        segundo_nombre: formData.segundo_nombre || "",
        primer_apellido: formData.primer_apellido,
        segundo_apellido: formData.segundo_apellido || "",
        identidad: formData.identidad,
        genero: formData.genero as "Masculino" | "Femenino" | "Otro",
        fecha_nacimiento: formData.fecha_nacimiento,
        correo: formData.correo_electronico,
        telefono: formData.telefono_personal,
        es_principal: formData.es_encargado_principal,
        parentesco: formData.parentesco,
        uuid_estudiante: formData.uuid_estudiante,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setModalStatus("success");
            setModalTitle("¡Registro exitoso!");
            setModalDesc("El apoderado ha sido registrado correctamente.");
            setTimeout(() => {
              setModalOpen(false);
              if (onClose) onClose();
              else navigate("/apoderados");
            }, 2000);
          } else {
            setModalStatus("error");
            setModalTitle("Error");
            setModalDesc(res.message || "No se pudo registrar el apoderado.");
          }
        },
        onError: (err: any) => {
          setModalStatus("error");
          setModalTitle("Error");
          setModalDesc(err.message || "Error inesperado");
        },
      }
    );
  };

  const handleOpenCancelDialog = () => setOpenCancelDialog(true);
  const handleCloseCancelDialog = () => setOpenCancelDialog(false);
  const handleConfirmCancel = () => {
    if (onClose) onClose();
    else navigate("/apoderados");
  };

  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: "12px" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontFamily, mb: 3 }}>
            Registro de Apoderado
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primer Nombre"
                name="primer_nombre"
                value={formData.primer_nombre}
                onChange={handleChange}
                error={!!errors.primer_nombre}
                helperText={errors.primer_nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primer Apellido"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={handleChange}
                error={!!errors.primer_apellido}
                helperText={errors.primer_apellido}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identidad"
                name="identidad"
                value={formData.identidad}
                onChange={handleChange}
                error={!!errors.identidad}
                helperText={errors.identidad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TelefonoInput
                value={formData.telefono_personal}
                onChange={handleTelefonoChange}
                error={!!errors.telefono_personal}
                helperText={errors.telefono_personal}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                error={!!errors.correo_electronico}
                helperText={errors.correo_electronico}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.parentesco}>
                <InputLabel>Parentesco</InputLabel>
                <Select
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Padre">Padre</MenuItem>
                  <MenuItem value="Madre">Madre</MenuItem>
                  <MenuItem value="Tutor">Tutor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.uuid_estudiante}>
                <InputLabel>Estudiante</InputLabel>
                <Select
                  name="uuid_estudiante"
                  value={formData.uuid_estudiante}
                  onChange={handleSelectChange}
                >
                  {filteredEstudiantes.map((e: any) => (
                    <MenuItem key={e.uuid} value={e.uuid}>
                      {e.primer_nombre} {e.primer_apellido} - {e.grado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenCancelDialog}
              sx={{ mr: 2 }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle sx={{ fontFamily }}>¿Cancelar registro?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            Si cancelas, se perderán los datos ingresados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} sx={{ fontFamily }}>
            No
          </Button>
          <Button onClick={handleConfirmCancel} autoFocus sx={{ fontFamily }}>
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackModal
        open={modalOpen}
        status={modalStatus}
        title={modalTitle}
        description={modalDesc}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default FormularioApoderado;
