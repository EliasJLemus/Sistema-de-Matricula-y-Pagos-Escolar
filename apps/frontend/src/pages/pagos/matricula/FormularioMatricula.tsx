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
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Autocomplete,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  useGetMatriculaPagos,
  useCrearMatricula,
  useGetMatriculaByUuid,
  useGetVistaDetalleMatricula,
} from "@/lib/queries";
import type { MatriculaType } from "@shared/pagos";
import FeedbackModal, {
  FeedbackStatus,
} from "@/components/FeedbackModal/FeedbackModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface FormularioMatriculaProps {
  matriculaId?: string | number;
  isEditing?: boolean;
  isModal?: boolean;
  onClose: () => void;
}

const FormularioMatricula: React.FC<FormularioMatriculaProps> = ({
  matriculaId,
  isEditing = false,
  isModal = false,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [uuidEstudianteSeleccionado, setUuidEstudianteSeleccionado] =
    useState("");
  const [estudianteInputValue, setEstudianteInputValue] = useState("");
  const [formData, setFormData] = useState<Partial<MatriculaType>>({
    fecha_matricula: new Date().toISOString().split("T")[0], // Fecha actual predeterminada
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning"
  >("error");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [activeSection, setActiveSection] = useState<string>("seleccion");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<any[]>([]);
  const [mostrarAlertaSeleccion, setMostrarAlertaSeleccion] = useState(true);

  const { data: dataMatricula, isLoading: isLoadingMatricula } =
    useGetMatriculaByUuid(typeof matriculaId === "string" ? matriculaId : "");

  const {
    data: vistaDetalleMatricula,
    refetch: refetchDetalleMatricula,
    isLoading: isLoadingDetalle,
  } = useGetVistaDetalleMatricula(uuidEstudianteSeleccionado);

  const { data, isLoading: isLoadingLista } = useGetMatriculaPagos({
    page: 1,
    limit: 1000,
    grado: gradoSeleccionado,
    year: new Date().getFullYear(),
  });

  const { mutate: crearMatricula } = useCrearMatricula();

  const estudiantesFiltrados =
    data?.data?.filter(
      (e) =>
        e.uuid_estudiante &&
        e.nombre_estudiante &&
        e.grado === gradoSeleccionado
    ) || [];

  // Efecto para actualizar estudiantes filtrados cuando cambia el grado
  useEffect(() => {
    if (data?.data && gradoSeleccionado) {
      const filtrados = data.data.filter(
        (e) =>
          e.uuid_estudiante &&
          e.nombre_estudiante &&
          e.grado === gradoSeleccionado
      );
      setFilteredEstudiantes(filtrados);
    }
  }, [data?.data, gradoSeleccionado]);

  useEffect(() => {
    setIsLoading(true);

    setGradoSeleccionado(dataMatricula?.data?.grado || "");
    setUuidEstudianteSeleccionado(dataMatricula?.data?.uuid_estudiante || "");

    if (isEditing && dataMatricula?.data && vistaDetalleMatricula?.data) {
      const matricula = dataMatricula.data;
      const detalle = vistaDetalleMatricula.data;

      if (matricula.nombre_estudiante) {
        setEstudianteInputValue(matricula.nombre_estudiante);
      }

      setFormData({
        tipo_pago: detalle.tipo_pago,
        grado: matricula.grado,
        fecha_matricula: matricula.fecha_matricula?.substring(0, 10),
        descripcion: matricula.descripcion,
        periodicidad: matricula.periodicidad,
        codigo_encargado_principal: matricula.codigo_encargado_principal || "",
        nombre_estudiante: matricula.nombre_estudiante || "",
        tarifa_base: matricula.tarifa_base,
        codigo_plan_detallado: detalle.codigo_plan_detallado,
        codigo_plan_matricula: detalle.codigo_plan_matricula,
        tarifa_plan_matricula: detalle.tarifa_plan_matricula,
        vencimiento: detalle.vencimiento,
        tipo_plan_matricula: detalle.tipo_plan_matricula,
        nivel_plan_matricula: detalle.nivel_plan_matricula,
        year_plan_matricula: detalle.year_plan_matricula,
        nombre_beca: detalle.nombre_beca,
        descuento: detalle.descuento,
        codigo_beca: detalle.codigo_beca,
        total_matricula: detalle.total_matricula,
        uuid_estudiante: matricula.uuid_estudiante,
      });

      setActiveSection("revision");
      // Ocultar alerta cuando ya hay estudiante seleccionado
      setMostrarAlertaSeleccion(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isEditing, dataMatricula?.data, vistaDetalleMatricula?.data]);

  useEffect(() => {
    if (
      !isEditing &&
      uuidEstudianteSeleccionado &&
      vistaDetalleMatricula?.data
    ) {
      const estudiante = estudiantesFiltrados.find(
        (est) => est.uuid_estudiante === uuidEstudianteSeleccionado
      );

      if (estudiante) {
        setFormData((prev) => ({
          ...prev,
          ...estudiante,
          fecha_matricula:
            prev.fecha_matricula || new Date().toISOString().split("T")[0],
          uuid_matricula: estudiante.uuid_matricula,
          codigo_plan_detallado:
            vistaDetalleMatricula.data.codigo_plan_detallado,
          codigo_plan_matricula:
            vistaDetalleMatricula.data.codigo_plan_matricula,
          tarifa_plan_matricula:
            vistaDetalleMatricula.data.tarifa_plan_matricula,
          vencimiento: vistaDetalleMatricula.data.vencimiento,
          tipo_plan_matricula: vistaDetalleMatricula.data.tipo_plan_matricula,
          nivel_plan_matricula: vistaDetalleMatricula.data.nivel_plan_matricula,
          year_plan_matricula: vistaDetalleMatricula.data.year_plan_matricula,
          nombre_beca: vistaDetalleMatricula.data.nombre_beca,
          descuento: vistaDetalleMatricula.data.descuento,
          codigo_beca: vistaDetalleMatricula.data.codigo_beca,
          total_matricula: vistaDetalleMatricula.data.total_matricula,
        }));

        // Ocultar alerta cuando ya hay estudiante seleccionado
        setMostrarAlertaSeleccion(false);
      }
    }
  }, [
    uuidEstudianteSeleccionado,
    vistaDetalleMatricula,
    isEditing,
    estudiantesFiltrados,
  ]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "grado") {
      setGradoSeleccionado(value);
      // Conservar el grado seleccionado en formData
      setFormData((prev) => ({
        ...prev,
        grado: value,
      }));

      // Solo resetear estudiante al cambiar el grado
      if (value !== formData.grado) {
        setUuidEstudianteSeleccionado("");
        setEstudianteInputValue("");
        setFormData((prev) => ({
          ...prev,
          nombre_estudiante: "",
          uuid_estudiante: "",
        }));
        // Mostrar alerta cuando no hay estudiante seleccionado
        setMostrarAlertaSeleccion(true);
      }
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

  const handleEstudianteChange = (event: any, newValue: any) => {
    if (newValue) {
      setUuidEstudianteSeleccionado(newValue.uuid_estudiante);
      setFormData((prev) => ({
        ...prev,
        uuid_estudiante: newValue.uuid_estudiante,
        nombre_estudiante: newValue.nombre_estudiante,
        // Mantener el grado seleccionado
        grado: prev.grado || gradoSeleccionado,
      }));
      setErrors((prev) => ({ ...prev, uuid_estudiante: "" }));
      // Ocultar alerta cuando ya hay estudiante seleccionado
      setMostrarAlertaSeleccion(false);
    } else {
      setUuidEstudianteSeleccionado("");
      setFormData((prev) => ({
        ...prev,
        uuid_estudiante: "",
        nombre_estudiante: "",
        // Mantener el grado seleccionado
        grado: prev.grado || gradoSeleccionado,
      }));
      // Mostrar alerta cuando no hay estudiante seleccionado
      setMostrarAlertaSeleccion(true);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let sectionWithErrors = "";

    if (!formData.uuid_estudiante) {
      newErrors.uuid_estudiante = "Seleccione un estudiante.";
      sectionWithErrors = sectionWithErrors || "seleccion";
    }

    if (!formData.fecha_matricula) {
      newErrors.fecha_matricula = "Seleccione una fecha.";
      sectionWithErrors = sectionWithErrors || "detalles";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0 &&
      sectionWithErrors !== activeSection
    ) {
      setActiveSection(sectionWithErrors);
      setAlertMessage("Hay campos requeridos sin completar en otras pestañas");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return false;
    }

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

    if (isNavigating) {
      setIsNavigating(false);
      return;
    }

    if (!validateForm()) {
      setAlertMessage("Faltan campos obligatorios.");
      setAlertSeverity("error");
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
            queryClient.invalidateQueries({ queryKey: ["getMatriculas"] });
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
          setModalDescription(
            error.message || "Error al registrar la matrícula."
          );
        },
      }
    );
  };

  const handleSectionChange = (section: string) => {
    setIsNavigating(true);
    setActiveSection(section);
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  const hasErrorsInSection = (section: string) => {
    if (section === "seleccion") {
      return !!errors.uuid_estudiante;
    } else if (section === "detalles") {
      return !!errors.fecha_matricula;
    }
    return false;
  };

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
      "&.Mui-focused": {
        color: "#1A1363",
      },
    },
    "& .MuiInputBase-root": {
      fontFamily,
      borderRadius: "12px",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 10px rgba(26, 19, 99, 0.1)",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "#f44336",
      },
    },
    "& .MuiFormHelperText-root": {
      fontFamily,
      color: "#f44336",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336",
    },
  };

  // Estilos comunes para FormControl
  const formControlStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
      "&.Mui-focused": {
        color: "#1A1363",
      },
    },
    "& .MuiFormLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiSelect-select": {
      fontFamily,
      backgroundColor: "#f8f9fa",
    },
    "& .MuiInputBase-root": {
      borderRadius: "12px",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 10px rgba(26, 19, 99, 0.1)",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "#f44336",
      },
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#e7f5e8",
    },
  };

  // Estilo para botón naranja (Cancelar/Anterior)
  const secondaryButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    bgcolor: "#F38223",
    color: "white",
    px: 4,
    py: 1.2,
    minWidth: "140px",
    fontWeight: 600,
    fontSize: "15px",
    height: "40px",
    boxShadow: "0px 4px 10px rgba(243, 130, 35, 0.3)",
    "&:hover": {
      backgroundColor: "#e67615",
      transform: "translateY(-2px)",
      boxShadow: "0px 6px 12px rgba(243, 130, 35, 0.4)",
    },
    "&:active": {
      backgroundColor: "#d56a10",
      transform: "translateY(1px)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(243, 130, 35, 0.7)",
      color: "white",
    },
    transition: "all 0.2s ease-in-out",
  };

  // Estilo para botón verde (Siguiente/Guardar)
  const primaryButtonStyle = {
    bgcolor: "#538A3E",
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    color: "white",
    px: 4,
    py: 1.2,
    height: "40px",
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

  if (isLoading || isLoadingMatricula || isLoadingLista || isLoadingDetalle) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress sx={{ color: "#538A3E" }} />
      </Box>
    );
  }

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{
            width: "100%",
            fontFamily,
            "& .MuiAlert-icon": {
              color:
                alertSeverity === "success"
                  ? "#538A3E"
                  : alertSeverity === "warning"
                  ? "#F38223"
                  : "#f44336",
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle sx={{ fontFamily, color: "#1A1363" }}>
          Confirmar Cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily }}>
            ¿Seguro que quieres cancelar el proceso? Los cambios no guardados se
            perderán.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            sx={{ fontFamily, color: "#1A1363" }}
          >
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

      {/* Indicadores de paso mejorados */}
      <Box
        sx={{
          width: "100%",
          p: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          mb: 2,
        }}
      >
        {/* Contenedor principal con distribución equitativa */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            width: "100%",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Paso 1 - Selección Estudiante */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: hasErrorsInSection("seleccion")
                  ? "#f44336"
                  : activeSection === "seleccion"
                  ? "#538A3E"
                  : activeSection === "detalles" || activeSection === "revision"
                  ? "#538A3E"
                  : "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                mr: 1.5,
                zIndex: 2,
              }}
            >
              {hasErrorsInSection("seleccion") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              ) : (
                "1"
              )}
            </Box>
            <Typography
              sx={{
                fontFamily,
                fontWeight: activeSection === "seleccion" ? 600 : 400,
                color: hasErrorsInSection("seleccion") ? "#f44336" : "#000",
              }}
            >
              Selección Estudiante
            </Typography>
          </Box>

          {/* Línea conectora entre Selección Estudiante y Detalles Matrícula */}
          <Box
            sx={{
              position: "absolute",
              height: "2px",
              bgcolor: "#ddd",
              left: "16%",
              width: "22%",
              top: "50%",
              zIndex: 1,
            }}
          />

          {/* Paso 2 - Detalles Matrícula */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: hasErrorsInSection("detalles")
                  ? "#f44336"
                  : activeSection === "detalles"
                  ? "#538A3E"
                  : activeSection === "revision"
                  ? "#538A3E"
                  : "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                mr: 1.5,
                zIndex: 2,
              }}
            >
              {hasErrorsInSection("detalles") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              ) : (
                "2"
              )}
            </Box>
            <Typography
              sx={{
                fontFamily,
                fontWeight: activeSection === "detalles" ? 600 : 400,
                color: hasErrorsInSection("detalles") ? "#f44336" : "#000",
              }}
            >
              Detalles Matrícula
            </Typography>
          </Box>

          {/* Línea conectora entre Detalles Matrícula y Revisión */}
          <Box
            sx={{
              position: "absolute",
              height: "2px",
              bgcolor: "#ddd",
              left: "64%",
              width: "30%",
              top: "50%",
              zIndex: 1,
            }}
          />

          {/* Paso 3 - Revisión */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: activeSection === "revision" ? "#538A3E" : "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                mr: 1.5,
                zIndex: 2,
              }}
            >
              {hasErrorsInSection("revision") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              ) : (
                "3"
              )}
            </Box>
            <Typography
              sx={{
                fontFamily,
                fontWeight: activeSection === "revision" ? 600 : 400,
                color: hasErrorsInSection("revision") ? "#f44336" : "#000",
              }}
            >
              Revisión
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navegación de secciones */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          bgcolor: "#f8f9fa",
          px: 2,
          mt: 0,
        }}
      >
        {/* Tab Selección Estudiante */}
        <Button
          onClick={() => handleSectionChange("seleccion")}
          sx={{
            fontFamily,
            textTransform: "none",
            py: 2,
            px: 3,
            color: activeSection === "seleccion" ? "#1A1363" : "#666",
            fontWeight: activeSection === "seleccion" ? 600 : 400,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgcolor:
                activeSection === "seleccion" ? "#538A3E" : "transparent",
              borderRadius: "3px 3px 0 0",
              transition: "all 0.2s ease",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: "#1A1363",
              "&::after": {
                bgcolor:
                  activeSection === "seleccion"
                    ? "#538A3E"
                    : "rgba(83, 138, 62, 0.3)",
              },
            },
          }}
          startIcon={
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          }
        >
          Selección Estudiante
          {hasErrorsInSection("seleccion") && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#f44336",
                ml: 1,
              }}
            />
          )}
        </Button>

        {/* Tab Detalles Matrícula */}
        <Button
          onClick={() => handleSectionChange("detalles")}
          sx={{
            fontFamily,
            textTransform: "none",
            py: 2,
            px: 3,
            color: activeSection === "detalles" ? "#1A1363" : "#666",
            fontWeight: activeSection === "detalles" ? 600 : 400,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgcolor: activeSection === "detalles" ? "#538A3E" : "transparent",
              borderRadius: "3px 3px 0 0",
              transition: "all 0.2s ease",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: "#1A1363",
              "&::after": {
                bgcolor:
                  activeSection === "detalles"
                    ? "#538A3E"
                    : "rgba(83, 138, 62, 0.3)",
              },
            },
          }}
          startIcon={
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          }
        >
          Detalles Matrícula
          {hasErrorsInSection("detalles") && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#f44336",
                ml: 1,
              }}
            />
          )}
        </Button>

        {/* Tab Revisión */}
        <Button
          onClick={() => handleSectionChange("revision")}
          sx={{
            fontFamily,
            textTransform: "none",
            py: 2,
            px: 3,
            color: activeSection === "revision" ? "#1A1363" : "#666",
            fontWeight: activeSection === "revision" ? 600 : 400,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgcolor: activeSection === "revision" ? "#538A3E" : "transparent",
              borderRadius: "3px 3px 0 0",
              transition: "all 0.2s ease",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: "#1A1363",
              "&::after": {
                bgcolor:
                  activeSection === "revision"
                    ? "#538A3E"
                    : "rgba(83, 138, 62, 0.3)",
              },
            },
          }}
          startIcon={
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          }
        >
          Revisión
        </Button>
      </Box>

      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 4,
            height: "auto",
          }}
        >
          {/* Sección Selección de Estudiante */}
          <Box
            sx={{
              display: activeSection === "seleccion" ? "block" : "none",
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "#f9f9f9",
                borderRadius: "16px",
                mb: 4,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#1A1363",
                  fontFamily,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  mb: 3,
                  "&::before": {
                    content: '""',
                    display: "inline-block",
                    width: "5px",
                    height: "24px",
                    backgroundColor: "#538A3E",
                    marginRight: "10px",
                    borderRadius: "3px",
                  },
                }}
              >
                Selección de Estudiante
              </Typography>

              <Grid container spacing={3}>
                {/* Grado */}
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.grado}
                    sx={formControlStyle}
                  >
                    <InputLabel>Grado</InputLabel>
                    <Select
                      name="grado"
                      value={gradoSeleccionado}
                      onChange={handleChange}
                      label="Grado"
                      disabled={isEditing}
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

                {/* Estudiante - Autocomplete */}
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    id="estudiante-autocomplete"
                    options={filteredEstudiantes}
                    getOptionLabel={(option) => option.nombre_estudiante || ""}
                    value={
                      filteredEstudiantes.find(
                        (est) =>
                          est.uuid_estudiante === uuidEstudianteSeleccionado
                      ) || null
                    }
                    onChange={handleEstudianteChange}
                    inputValue={estudianteInputValue}
                    onInputChange={(event, newInputValue) => {
                      setEstudianteInputValue(newInputValue);
                    }}
                    disabled={isEditing || !gradoSeleccionado}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estudiante"
                        error={!!errors.uuid_estudiante}
                        helperText={errors.uuid_estudiante}
                        sx={textFieldStyle}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <ListItemText
                          primary={option.nombre_estudiante}
                          sx={{ fontFamily }}
                        />
                      </li>
                    )}
                    noOptionsText="No hay estudiantes disponibles"
                    loadingText="Cargando estudiantes..."
                    fullWidth
                  />
                </Grid>

                {/* Mensaje de alerta solo cuando no hay grado seleccionado */}
                {gradoSeleccionado &&
                  !formData.nombre_estudiante &&
                  mostrarAlertaSeleccion && (
                    <Grid item xs={12}>
                      <Alert
                        severity="info"
                        sx={{
                          fontFamily,
                          mt: 1,
                          "& .MuiAlert-icon": {
                            color: "#1A1363",
                          },
                        }}
                      >
                        Seleccione un estudiante para continuar.
                      </Alert>
                    </Grid>
                  )}

                {!gradoSeleccionado && mostrarAlertaSeleccion && (
                  <Grid item xs={12}>
                    <Alert
                      severity="info"
                      sx={{
                        fontFamily,
                        mt: 1,
                        "& .MuiAlert-icon": {
                          color: "#1A1363",
                        },
                      }}
                    >
                      Seleccione un grado para ver los estudiantes disponibles.
                    </Alert>
                  </Grid>
                )}

                {/* Información del estudiante seleccionado */}
                {formData.nombre_estudiante && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f5f9ff",
                        borderRadius: "10px",
                        border: "1px solid rgba(26, 19, 99, 0.1)",
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#538A3E",
                          width: 46,
                          height: 46,
                          fontWeight: "bold",
                        }}
                      >
                        {formData.nombre_estudiante
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#1A1363",
                          }}
                        >
                          {formData.nombre_estudiante}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily, color: "#666" }}
                        >
                          Grado: {formData.grado || gradoSeleccionado}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>

          {/* Sección Detalles de Matrícula */}
          <Box
            sx={{
              display: activeSection === "detalles" ? "block" : "none",
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "#f9f9f9",
                borderRadius: "16px",
                mb: 4,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#1A1363",
                  fontFamily,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  mb: 3,
                  "&::before": {
                    content: '""',
                    display: "inline-block",
                    width: "5px",
                    height: "24px",
                    backgroundColor: "#538A3E",
                    marginRight: "10px",
                    borderRadius: "3px",
                  },
                }}
              >
                Detalles de Matrícula
              </Typography>

              <Grid container spacing={3}>
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
                    error={!!errors.fecha_matricula}
                    helperText={errors.fecha_matricula}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tipo de Pago"
                    value={formData.tipo_pago || "Normal"}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={
                      formData.descripcion ||
                      "Plan de pago asignado automáticamente al registrar estudiante."
                    }
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Periodicidad"
                    value={formData.periodicidad || "Mensual"}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Código Plan Detallado"
                    value={
                      formData.codigo_plan_detallado ||
                      "DET-NOR-2025-EST-2025-0020"
                    }
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Sección de revisión */}
          <Box
            sx={{
              display: activeSection === "revision" ? "block" : "none",
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "#f9f9f9",
                borderRadius: "16px",
                mb: 4,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#1A1363",
                  fontFamily,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  mb: 3,
                  "&::before": {
                    content: '""',
                    display: "inline-block",
                    width: "5px",
                    height: "24px",
                    backgroundColor: "#538A3E",
                    marginRight: "10px",
                    borderRadius: "3px",
                  },
                }}
              >
                Información de Matrícula
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid rgba(0,0,0,0.05)",
                      borderRadius: "12px",
                      bgcolor: "#fff",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily,
                        fontWeight: 600,
                        color: "#1A1363",
                        mb: 2,
                      }}
                    >
                      Datos del Estudiante
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Estudiante:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.nombre_estudiante || "No seleccionado"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Grado:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.grado ||
                            gradoSeleccionado ||
                            "No seleccionado"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Fecha de Matrícula:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.fecha_matricula || "No definida"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Encargado Principal:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.codigo_encargado_principal || "No definido"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid rgba(0,0,0,0.05)",
                      borderRadius: "12px",
                      bgcolor: "#fff",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily,
                        fontWeight: 600,
                        color: "#1A1363",
                        mb: 2,
                      }}
                    >
                      Datos del Plan
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Tipo Plan:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.tipo_plan_matricula || "Pago Único"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Nivel:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.nivel_plan_matricula || "Básica"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Año Académico:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.year_plan_matricula || 2025}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Vencimiento:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {formData.vencimiento?.substring(0, 10) ||
                            "2025-02-15"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid rgba(0,0,0,0.05)",
                      borderRadius: "12px",
                      bgcolor: "#f8f9fa", // Fondo gris claro
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily,
                        fontWeight: 600,
                        color: "#1A1363",
                        mb: 2,
                      }}
                    >
                      Información de Pago
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Tarifa Base:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          L. {formData.tarifa_base || "0.00"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Tarifa Plan:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          L. {formData.tarifa_plan_matricula || "1200.00"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Beca Aplicada:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily,
                            fontWeight: 600,
                            color: formData.nombre_beca ? "#538A3E" : "#666",
                          }}
                        >
                          {formData.nombre_beca || "Sin beca"}{" "}
                          {formData.descuento ? `(${formData.descuento}%)` : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily,
                            color: "#666",
                            mb: 0.5,
                          }}
                        >
                          Total a Pagar:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily,
                            fontWeight: 700,
                            color: "#538A3E",
                          }}
                        >
                          L.{" "}
                          {formData.total_matricula ||
                            formData.tarifa_plan_matricula ||
                            "1200.00"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Botones de acción */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            p: 3,
            borderTop: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "#f8f9fa",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          {/* Botón Cancelar/Anterior */}
          <Button
            variant="contained"
            onClick={() => {
              if (activeSection === "seleccion") {
                setOpenCancelDialog(true);
              } else if (activeSection === "detalles") {
                setActiveSection("seleccion");
              } else if (activeSection === "revision") {
                setActiveSection("detalles");
              }
            }}
            sx={secondaryButtonStyle}
            startIcon={
              activeSection === "seleccion" ? (
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              )
            }
          >
            {activeSection === "seleccion" ? "Cancelar" : "Anterior"}
          </Button>

          {/* Botón Siguiente/Guardar */}
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              setIsNavigating(true);
              if (activeSection === "seleccion") {
                // Validar selección de estudiante
                if (!formData.uuid_estudiante) {
                  setErrors((prev) => ({
                    ...prev,
                    uuid_estudiante: "Seleccione un estudiante.",
                  }));
                  setAlertMessage(
                    "Debe seleccionar un estudiante para continuar."
                  );
                  setAlertSeverity("error");
                  setAlertOpen(true);
                  setIsNavigating(false);
                  return;
                }
                setActiveSection("detalles");
              } else if (activeSection === "detalles") {
                // Validar fecha de matrícula
                if (!formData.fecha_matricula) {
                  setErrors((prev) => ({
                    ...prev,
                    fecha_matricula: "Seleccione una fecha.",
                  }));
                  setAlertMessage(
                    "Debe seleccionar una fecha de matrícula para continuar."
                  );
                  setAlertSeverity("error");
                  setAlertOpen(true);
                  setIsNavigating(false);
                  return;
                }
                setActiveSection("revision");
              } else {
                // Enviar el formulario
                setIsNavigating(false);
                handleSubmit(e as React.FormEvent);
              }
              setTimeout(() => {
                setIsNavigating(false);
              }, 100);
            }}
            disabled={isSubmitting}
            type="button"
            sx={primaryButtonStyle}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : activeSection !== "revision" ? (
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
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
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
              : activeSection !== "revision"
              ? "Siguiente"
              : isEditing
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </Box>
      </form>

      <FeedbackModal
        open={modalOpen}
        status={modalStatus}
        title={modalTitle}
        description={modalDescription}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FormularioMatricula;
