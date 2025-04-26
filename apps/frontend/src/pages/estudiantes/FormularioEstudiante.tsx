"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import {
  useGetEstudianteByUuid,
  useRegistrarEstudiante,
  useUpdateEstudiante,
} from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import FeedbackModal, {
  type FeedbackStatus,
} from "@/components/FeedbackModal/FeedbackModal";
import {
  getErrorMessage,
  validateInput,
} from "@/utils/validacionesEstudiantes";
import { fontFamily } from "@/styles/common-styles";

// Import sub-components
// Import sub-components
import { DatosPersonales } from "@/components/estudiantes/formulario/datos-personales";
import { InformacionAcademica } from "@/components/estudiantes/formulario/informacion-academica";
import { InformacionAdicional } from "@/components/estudiantes/formulario/informacion-adicional";
import { ProgresoFormulario } from "@/components/estudiantes/formulario/progreso-formulario";
import { NavegacionSecciones } from "@/components/estudiantes/formulario/navegacion-secciones";
import { NavegacionFormulario } from "@/components/estudiantes/formulario/navegacion-formulario";

interface FormularioEstudianteProps {
  estudianteId?: string | number;
  isEditing?: boolean;
  isModal?: boolean;
  onClose?: () => void;
}

const FormularioEstudiante: React.FC<FormularioEstudianteProps> = ({
  estudianteId,
  isEditing = false,
  isModal = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const actualId = estudianteId || id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const formatearFechaParaInput = (fechaString: string | undefined): string => {
    if (!fechaString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      return fechaString;
    }

    const partes = fechaString.split(/[-/]/);
    if (partes.length !== 3) return "";

    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");
    const año = partes[2];

    return `${año}-${mes}-${dia}`;
  };

  const [formData, setFormData] = useState<Partial<any>>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    nacionalidad: "",
    identidad: "",
    genero: "Masculino",
    fecha_nacimiento: "",
    edad: 0,
    direccion: "",
    nombre_grado: "",
    seccion: "",
    es_zurdo: false,
    dif_educacion_fisica: false,
    reaccion_alergica: false,
    descripcion_alergica: null,
    fecha_admision: new Date().toISOString().split("T")[0], // Fecha actual predeterminada
    estado: "Activo",
    tipo_persona: "Estudiante",
    plan_pago: "",
  });

  const queryClient = useQueryClient();
  const { data } = useGetEstudianteByUuid(actualId?.toString() || "");
  const datos = data?.data;
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);

      setTimeout(() => {
        // Formatear las fechas para que funcionen correctamente con el input type="date"
        setFormData({
          primer_nombre: datos?.primer_nombre || "",
          segundo_nombre: datos?.segundo_nombre || "",
          primer_apellido: datos?.primer_apellido || "",
          segundo_apellido: datos?.segundo_apellido || "",
          nacionalidad: datos?.nacionalidad || "",
          identidad: datos?.identidad,
          genero: datos?.genero === "F" ? "Femenino" : "Masculino",
          fecha_nacimiento: formatearFechaParaInput(datos?.fecha_nacimiento),
          edad: datos?.edad || 0,
          direccion: datos?.direccion,
          nombre_grado: datos?.grado,
          seccion: datos?.seccion,
          dif_educacion_fisica: datos?.dif_educacion === "Sí",
          reaccion_alergica: datos?.alergia === "Sí",
          es_zurdo: datos?.es_zurdo === "Sí",
          descripcion_alergica: datos?.desc_alergia,
          desc_alergia: datos?.desc_alergia,
          fecha_admision: formatearFechaParaInput(datos?.fecha_admision),
          estado: datos?.estado || "Activo",
          tipo_persona: "Estudiante",
          plan_pago: datos?.plan_pago || "Normal",
        });

        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, actualId, datos]);

  const handleCloseFeedback = () => {
    if (modalStatus === "success") {
      setModalOpen(false);
      if (isModal && onClose) {
        onClose();
      }
    } else {
      setModalOpen(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validar la entrada según el campo
    if (validateInput(name, value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: getErrorMessage(name, value),
      }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name } = target;
    const pastedText = e.clipboardData.getData("text");

    // Validar el texto pegado
    if (!validateInput(name, pastedText)) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { name } = e.target as HTMLInputElement | HTMLTextAreaElement;
    const char = e.key;

    // No validar teclas de navegación
    if (
      e.ctrlKey ||
      e.altKey ||
      e.metaKey ||
      [
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Delete",
        "Home",
        "End",
      ].includes(char)
    ) {
      return;
    }

    // Prevent Enter key in descripcion_alergica field
    if (name === "descripcion_alergica" && char === "Enter") {
      e.preventDefault();
      return;
    }

    // Validar la nueva cadena que resultaría
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const newValue = target.value + char;
    if (!validateInput(name, newValue)) {
      e.preventDefault();

      // Add this code to show error message immediately
      let errorMessage = "";

      if (
        [
          "primer_nombre",
          "segundo_nombre",
          "primer_apellido",
          "segundo_apellido",
        ].includes(name)
      ) {
        if (newValue.startsWith(" ")) {
          errorMessage = "No se permiten espacios al inicio";
        } else {
          errorMessage = "Solo se permiten letras, acentos y diéresis";
        }
      } else if (name === "nacionalidad") {
        errorMessage =
          "Solo se permiten letras, acentos y diéresis, sin espacios";
      } else if (name === "identidad") {
        errorMessage = "Solo se permiten números";
      } else if (name === "descripcion_alergica") {
        if (newValue.startsWith(" ")) {
          errorMessage = "No se permiten espacios al inicio";
        } else {
          errorMessage = "Caracteres no permitidos";
        }
      } else if (name === "direccion" && newValue.startsWith(" ")) {
        errorMessage = "No se permiten espacios al inicio";
      }

      if (errorMessage) {
        setErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      }
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores al modificar un campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Just update the state without any side effects
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      genero: value as "Masculino" | "Femenino",
    }));
  };

  const handleFechaNacimientoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    // Validar que el año tenga 4 dígitos
    if (value) {
      const dateParts = value.split("-");
      if (dateParts.length === 3) {
        const year = dateParts[0];
        // Si el año tiene más de 4 dígitos, no actualizar el estado
        if (year.length > 4) {
          return;
        }
      }
    }

    // Actualizar la fecha en el estado
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: value,
    }));

    // Calcular edad
    if (value) {
      try {
        const birthDate = new Date(value);
        const today = new Date();

        // Verificar que la fecha sea válida y el año tenga 4 dígitos
        if (
          birthDate.toString() !== "Invalid Date" &&
          birthDate.getFullYear() < 10000
        ) {
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          setFormData((prev) => ({
            ...prev,
            edad: age < 0 ? 0 : age, // Prevenir edades negativas
          }));
        } else {
          // Si la fecha no es válida, establecer la edad a 0
          setFormData((prev) => ({
            ...prev,
            edad: 0,
          }));
        }
      } catch (error) {
        console.error("Error al calcular la edad:", error);
        // En caso de error, establecer la edad a 0
        setFormData((prev) => ({
          ...prev,
          edad: 0,
        }));
      }
    } else {
      // Si no hay fecha, establecer la edad a 0
      setFormData((prev) => ({
        ...prev,
        edad: 0,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let sectionWithErrors = "";

    // Validaciones de datos personales
    if (!formData.primer_nombre) {
      newErrors.primer_nombre = "El primer nombre es requerido";
      sectionWithErrors = sectionWithErrors || "personal";
    }

    if (!formData.primer_apellido) {
      newErrors.primer_apellido = "El primer apellido es requerido";
      sectionWithErrors = sectionWithErrors || "personal";
    }

    if (!formData.nacionalidad) {
      newErrors.nacionalidad = "La nacionalidad es requerida";
      sectionWithErrors = sectionWithErrors || "personal";
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "La fecha de nacimiento es requerida";
      sectionWithErrors = sectionWithErrors || "personal";
    }

    // Validar identidad (debe tener números)
    if (!formData.identidad) {
      newErrors.identidad = "La identidad es requerida";
      sectionWithErrors = sectionWithErrors || "personal";
    }

    // Validaciones de información académica
    if (!formData.nombre_grado) {
      newErrors.nombre_grado = "El grado es requerido";
      sectionWithErrors = sectionWithErrors || "academico";
    }
    if (!formData.seccion) {
      newErrors.seccion = "La sección es requerida";
      sectionWithErrors = sectionWithErrors || "academico";
    }
    if (!formData.fecha_admision) {
      newErrors.fecha_admision = "La fecha de admisión es requerida";
      sectionWithErrors = sectionWithErrors || "academico";
    }
    if (!formData.plan_pago) {
      newErrors.plan_pago = "El plan de pago es requerido";
      sectionWithErrors = sectionWithErrors || "academico";
    }

    // Validar descripción alérgica si tiene reacción alérgica
    if (formData.reaccion_alergica) {
      if (!formData.descripcion_alergica) {
        newErrors.descripcion_alergica =
          "La descripción de la alergia es requerida";
        sectionWithErrors = sectionWithErrors || "adicional";
      } else if (formData.descripcion_alergica.trim() === "") {
        newErrors.descripcion_alergica = "La descripción no puede estar vacía";
        sectionWithErrors = sectionWithErrors || "adicional";
      }
    }

    setErrors(newErrors);

    // Si hay errores, cambiar a la pestaña con errores y mostrar mensaje
    if (
      Object.keys(newErrors).length > 0 &&
      sectionWithErrors !== activeSection
    ) {
      setActiveSection(sectionWithErrors);
      setAlertMessage("Hay campos requeridos sin completar en otras pestañas");
      setAlertOpen(true);
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const { mutate: registrarEstudiante } = useRegistrarEstudiante();
  const { mutate: actualizarEstudiante } = useUpdateEstudiante();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNavigating) {
      setIsNavigating(false);
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);

      const payload = {
        primer_nombre: formData.primer_nombre,
        segundo_nombre: formData.segundo_nombre,
        primer_apellido: formData.primer_apellido,
        segundo_apellido: formData.segundo_apellido,
        identidad: formData.identidad,
        nacionalidad: formData.nacionalidad,
        genero: formData.genero,
        fecha_nacimiento: formData.fecha_nacimiento,
        edad: formData.edad,
        direccion: formData.direccion,
        nombre_grado: formData.nombre_grado,
        seccion: formData.seccion,
        es_zurdo: formData.es_zurdo,
        dif_educacion_fisica: formData.dif_educacion_fisica,
        reaccion_alergica: formData.reaccion_alergica,
        descripcion_alergica: formData.descripcion_alergica,
        tipo_persona: formData.tipo_persona,
        fecha_admision: formData.fecha_admision,
        estado: formData.estado,
        plan_pago: formData.plan_pago,
      };

      setModalOpen(true);
      setModalStatus("loading");
      setModalTitle("Enviando...");
      setModalDescription("Guardando datos del estudiante...");

      if (!isEditing) {
        registrarEstudiante(payload, {
          onSuccess: (response: any) => {
            if (response.success) {
              setModalStatus("success");
              setModalTitle("Éxito");
              setModalDescription(`${response.data}`);
            } else {
              setModalStatus("error");
              setModalTitle("Error");
              setModalDescription(
                response.message || "Hubo un problema al guardar el estudiante."
              );
            }
            queryClient.invalidateQueries({
              queryKey: ["getEstudiantes"],
              exact: false,
            });

            setAlertOpen(true);
            setIsSubmitting(false);
            navigate("/estudiantes");
          },
          onError: () => {
            setModalStatus("error");
            setModalTitle("Error");
            setModalDescription("Hubo un problema al guardar el estudiante.");
            setTimeout(() => setModalOpen(false), 2500);
            setIsSubmitting(false);
          },
        });
      } else {
        actualizarEstudiante(
          {
            uuid: actualId?.toString() || "",
            data: payload,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["getEstudiantes"],
                exact: false,
              });
              setModalStatus("success");
              setModalTitle("Éxito");
              setModalDescription(`Se actualizo el estudiante exitosamente.`);

              setIsSubmitting(false);
              navigate("/estudiantes");
            },
            onError: () => {
              setModalStatus("error");
              setModalTitle("Error");
              setModalDescription("Hubo un problema al guardar el estudiante.");
              setTimeout(() => setModalOpen(false), 2500);
              setIsSubmitting(false);
            },
          }
        );
      }
    }
  };

  const handleSectionChange = (section: string) => {
    setIsNavigating(true);
    setActiveSection(section);
    // Reset the navigation flag after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  const handleNextSection = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    if (activeSection === "personal") {
      setActiveSection("academico");
    } else if (activeSection === "academico") {
      setActiveSection("adicional");
    } else {
      setIsNavigating(false);
      handleSubmit(e as unknown as React.FormEvent);
    }
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  // Función para verificar si hay errores en una sección específica
  const hasErrorsInSection = (section: string) => {
    if (section === "personal") {
      return !!(
        errors.primer_nombre ||
        errors.segundo_nombre ||
        errors.primer_apellido ||
        errors.segundo_apellido ||
        errors.nacionalidad ||
        errors.identidad ||
        errors.fecha_nacimiento ||
        errors.direccion
      );
    } else if (section === "academico") {
      return !!(
        errors.nombre_grado ||
        errors.seccion ||
        errors.fecha_admision ||
        errors.plan_pago
      );
    } else if (section === "adicional") {
      return !!(formData.reaccion_alergica && errors.descripcion_alergica);
    }
    return false;
  };

  // Función para generar el avatar del estudiante
  const getStudentAvatar = () => {
    if (isEditing && formData.primer_nombre && formData.primer_apellido) {
      const initials = `${formData.primer_nombre.charAt(
        0
      )}${formData.primer_apellido.charAt(0)}`;
      return (
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#538A3E",
            fontSize: "2rem",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(83, 138, 62, 0.3)",
          }}
        >
          {initials}
        </Avatar>
      );
    }
    return (
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: "#1A1363",
          fontSize: "2rem",
          boxShadow: "0 4px 10px rgba(26, 19, 99, 0.3)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </Avatar>
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress sx={{ color: "#538A3E" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: isModal ? "auto" : "auto",
        maxHeight: isModal ? "calc(100vh - 80px)" : "none",
      }}
    >
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="warning"
          sx={{
            width: "100%",
            fontFamily,
            "& .MuiAlert-icon": {
              color: "#F38223",
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
              if (isModal && onClose) {
                onClose();
              } else {
                navigate("/estudiantes");
              }
            }}
            sx={{ fontFamily, color: "#1A1363" }}
            autoFocus
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      {/* No mostramos el encabezado aquí si estamos en un modal, ya que se muestra en el componente padre */}
      {!isModal && (
        <Box
          sx={{
            background: "linear-gradient(135deg, #1A1363 0%, #538A3E 100%)",
            borderRadius: "16px",
            p: 3,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 30px rgba(26, 19, 99, 0.15)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url('/placeholder.svg?height=100&width=500') center/cover",
              opacity: 0.05,
              zIndex: 0,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              zIndex: 1,
            }}
          >
            {getStudentAvatar()}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {isEditing ? "Editar Estudiante" : "Registrar Estudiante"}
              </Typography>
              {isEditing &&
                formData.primer_nombre &&
                formData.primer_apellido && (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily,
                      color: "rgba(255,255,255,0.9)",
                      mt: 0.5,
                    }}
                  >
                    {`${formData.primer_nombre} ${formData.primer_apellido}`}
                  </Typography>
                )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, zIndex: 1 }}>
            {isEditing && (
              <Chip
                label={formData.estado === "Activo" ? "Activo" : "Inactivo"}
                sx={{
                  bgcolor: formData.estado === "Activo" ? "#538A3E" : "#F38223",
                  color: "white",
                  fontFamily,
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 1,
                }}
              />
            )}
            <Tooltip title="Volver a la lista">
              <IconButton
                onClick={() => navigate("/estudiantes")}
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(5px)",
                  "&:hover": {
                    bgcolor: "rgba(243, 130, 35, 0.2)",
                  },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 0,
          mb: isModal ? 0 : 3,
          borderRadius: isModal ? "0 0 16px 16px" : "16px",
          boxShadow: isModal ? "none" : "0 10px 30px rgba(0, 0, 0, 0.05)",
          maxWidth: "1200px",
          mx: "auto",
          bgcolor: "#ffffff",
          height: isModal ? "auto" : "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Progreso del formulario */}
        <ProgresoFormulario
          activeSection={activeSection}
          hasErrorsInSection={hasErrorsInSection}
        />

        {/* Navegación de secciones */}
        <NavegacionSecciones
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
          hasErrorsInSection={hasErrorsInSection}
        />

        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: 4,
              overflowY: "auto",
              height: "auto",
            }}
          >
            {/* Datos personales */}
            <Box
              sx={{ display: activeSection === "personal" ? "block" : "none" }}
            >
              <DatosPersonales
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                handleGenderChange={handleGenderChange}
                handleFechaNacimientoChange={handleFechaNacimientoChange}
              />
            </Box>

            {/* Información académica */}
            <Box
              sx={{ display: activeSection === "academico" ? "block" : "none" }}
            >
              <InformacionAcademica
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                isEditing={isEditing}
              />
            </Box>

            {/* Información adicional */}
            <Box
              sx={{ display: activeSection === "adicional" ? "block" : "none" }}
            >
              <InformacionAdicional
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                handleRadioChange={handleRadioChange}
              />
            </Box>
          </Box>

          {/* Botones de acción */}
          <NavegacionFormulario
            activeSection={activeSection}
            setOpenCancelDialog={setOpenCancelDialog}
            handleNextSection={handleNextSection}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </form>
      </Paper>

      <FeedbackModal
        open={modalOpen}
        status={modalStatus}
        title={modalTitle}
        description={modalDescription}
        onClose={handleCloseFeedback}
      />
    </Box>
  );
};

export default FormularioEstudiante;
