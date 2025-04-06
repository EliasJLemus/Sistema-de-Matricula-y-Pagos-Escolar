"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormLabel,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Card,
  CardContent,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import type { EstudianteType } from "@/lib/queries/useGetEstudiantes";
import { EstudiantesTablaType } from "@shared/estudiantesType";
import {
  useGetEstudianteByUuid,
  useRegistrarEstudiante,
  useUpdateEstudiante,
} from "@/lib/queries";
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

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
  const theme = useTheme();
  const [isNavigating, setIsNavigating] = useState(false);

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

  const [formData, setFormData] = useState<Partial<EstudiantesTablaType>>({
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
    fecha_admision: "",
    estado: "Activo",
    tipo_persona: "Estudiante",
    plan_pago: "",
  });

  const [estudianteUUID, setEstudianteUUID] = useState<string | null>(null);

  const { data } = useGetEstudianteByUuid(actualId?.toString() || "");

  const datos = data?.data;

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && actualId) {
      setIsLoading(true);

      setTimeout(() => {
        // Datos de ejemplo para el modo edición
        const mockStudent = {
          id: Number(actualId),
          numero_estudiante: 1001,
          primer_nombre: "Abigail",
          segundo_nombre: "",
          primer_apellido: "Fajardo",
          segundo_apellido: "",
          nacionalidad: "Hondureña",
          identidad: "0801199912345",
          genero: "F" as "M" | "F",
          fecha_nacimiento: "15-05-1999",
          edad: 25,
          direccion: "Col. Kennedy",
          nombre_grado: "Sexto",
          seccion: "A",
          es_zurdo: true,
          dif_educacion: false,
          reaccion_alergica: true,
          descripcion_alergica: "Mariscos",
          fecha_admision: "02-01-2025",
          estado: "Activo" as "Activo" | "Inactivo",
          plan_pago: "Normal" as "Normal" | "Nivelado",
        };
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

  const validateInput = (name: string, value: string): boolean => {
    // Solo letras con acentos y diéresis para nombres y apellidos (sin espacios al inicio)
    if (
      [
        "primer_nombre",
        "segundo_nombre",
        "primer_apellido",
        "segundo_apellido",
      ].includes(name)
    ) {
      if (value.startsWith(" ")) return false;
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s]*$/.test(value);
    }

    // Solo letras con acentos y diéresis para nacionalidad (sin espacios en ninguna parte)
    if (name === "nacionalidad") {
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]*$/.test(value);
    }

    // Solo números para identidad
    if (name === "identidad") {
      return /^\d*$/.test(value);
    }

    // Descripción sin caracteres especiales excepto puntuación básica y sin espacios al inicio
    if (name === "descripcion_alergica") {
      // Allow empty value for descripcion_alergica
      if (value === "") return true;
      if (value.startsWith(" ")) return false;
      return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s.,;:¿?¡!()]+$/.test(value);
    }

    // No espacios al inicio para dirección
    if (name === "direccion") {
      if (value.startsWith(" ")) return false;
      return true;
    }

    return true;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validar la entrada según el campo
    if (validateInput(name, value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Limpiar errores si existen
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      // Si la entrada no es válida, establecer un mensaje de error específico
      let errorMessage = "";

      if (
        [
          "primer_nombre",
          "segundo_nombre",
          "primer_apellido",
          "segundo_apellido",
        ].includes(name)
      ) {
        if (value.startsWith(" ")) {
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
        if (value.startsWith(" ")) {
          errorMessage = "No se permiten espacios al inicio";
        } else {
          errorMessage = "Caracteres no permitidos";
        }
      } else if (name === "direccion" && value.startsWith(" ")) {
        errorMessage = "No se permiten espacios al inicio";
      }

      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
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
        nombre_grado: formData.nombre_grado, // ✅
        seccion: formData.seccion,
        es_zurdo: formData.es_zurdo,
        dif_educacion_fisica: formData.dif_educacion_fisica, // ✅
        reaccion_alergica: formData.reaccion_alergica,
        descripcion_alergica: formData.descripcion_alergica, // ✅
        tipo_persona: formData.tipo_persona,
        fecha_admision: formData.fecha_admision,
        estado: formData.estado,
        plan_pago: formData.plan_pago,
      };

      if (!isEditing) {
        registrarEstudiante(payload, {
          onSuccess: () => {
            setAlertMessage("🎉 Estudiante registrado exitosamente");
            setAlertOpen(true);
            setIsSubmitting(false);
            if (isModal && onClose) onClose();
            else navigate("/estudiantes");
          },
          onError: () => {
            setAlertMessage("❌ Ocurrió un error al registrar al estudiante");
            setAlertOpen(true);
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
              setAlertMessage("🎉 Estudiante actualizado exitosamente");
              setAlertOpen(true);
              setIsSubmitting(false);
              if (isModal && onClose) onClose();
              else navigate("/estudiantes");
            },
            onError: () => {
              setAlertMessage(
                "❌ Ocurrió un error al actualizar al estudiante"
              );
              setAlertOpen(true);
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

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363", // Color azul cuando está inactivo
      "&.Mui-focused": {
        color: "#1A1363", // Mismo color azul cuando está enfocado
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
      "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
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

  // Estilos comunes para FormControl - Modificación para el label flotante
  const formControlStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363", // Color azul cuando está inactivo
      "&.Mui-focused": {
        color: "#1A1363", // Mismo color azul cuando está enfocado
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
    "& .MuiRadio-root": {
      color: "#538A3E",
    },
    "& .Mui-checked": {
      color: "#538A3E",
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
      "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#f44336",
      },
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#e7f5e8",
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#f44336",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336",
    },
  };

  // Estilo para botón secundario naranja (para Cancelar/Anterior)
  const secondaryButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    bgcolor: "#F38223",
    color: "white",
    px: 4,
    py: 1.2,
    height: "40px",
    fontWeight: 600,
    fontSize: "15px",
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

  return (
    <Box
      sx={{
        height: isModal ? "auto" : "auto",
        maxHeight: isModal ? "calc(100vh - 80px)" : "none", // Limitar la altura máxima en modal
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
        {/* Stepper personalizado para mostrar el progreso con iconos de alerta más evidentes */}
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
            {/* Primer paso - Datos Personales */}
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
                  bgcolor: hasErrorsInSection("personal")
                    ? "#f44336"
                    : activeSection === "personal"
                    ? "#538A3E"
                    : activeSection === "academico" ||
                      activeSection === "adicional"
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
                {hasErrorsInSection("personal") ? (
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
                  fontWeight: activeSection === "personal" ? 600 : 400,
                  color: hasErrorsInSection("personal") ? "#f44336" : "#000",
                }}
              >
                Datos Personales
              </Typography>
            </Box>

            {/* Línea conectora entre Datos Personales e Información Académica */}
            <Box
              sx={{
                position: "absolute",
                height: "2px",
                bgcolor: "#ddd",
                left: "14%", // Comienza en el borde derecho del primer círculo
                width: "22%", // Llega hasta el borde izquierdo del segundo círculo
                top: "50%",
                zIndex: 1,
              }}
            />

            {/* Segundo paso - Información Académica (centrado) */}
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
                  bgcolor: hasErrorsInSection("academico")
                    ? "#f44336"
                    : activeSection === "academico"
                    ? "#538A3E"
                    : activeSection === "adicional"
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
                {hasErrorsInSection("academico") ? (
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
                  fontWeight: activeSection === "academico" ? 600 : 400,
                  color: hasErrorsInSection("academico") ? "#f44336" : "#000",
                }}
              >
                Información Académica
              </Typography>
            </Box>

            {/* Línea conectora entre Información Académica e Información Adicional */}
            <Box
              sx={{
                position: "absolute",
                height: "2px",
                bgcolor: "#ddd",
                left: "64%", // Comienza en el borde derecho del segundo círculo
                width: "22%", // Llega hasta el borde izquierdo del tercer círculo
                top: "50%",
                zIndex: 1,
              }}
            />

            {/* Tercer paso - Información Adicional (alineado a la derecha) */}
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
                  bgcolor: hasErrorsInSection("adicional")
                    ? "#f44336"
                    : activeSection === "adicional"
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
                {hasErrorsInSection("adicional") ? (
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
                  fontWeight: activeSection === "adicional" ? 600 : 400,
                  color: hasErrorsInSection("adicional") ? "#f44336" : "#000",
                }}
              >
                Información Adicional
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
          {["personal", "academico", "adicional"].map((section) => (
            <Button
              key={section}
              onClick={() => handleSectionChange(section)}
              sx={{
                fontFamily,
                textTransform: "none",
                py: 2,
                px: 3,
                color: activeSection === section ? "#1A1363" : "#666",
                fontWeight: activeSection === section ? 600 : 400,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  bgcolor:
                    activeSection === section ? "#538A3E" : "transparent",
                  borderRadius: "3px 3px 0 0",
                  transition: "all 0.2s ease",
                },
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#1A1363",
                  "&::after": {
                    bgcolor:
                      activeSection === section
                        ? "#538A3E"
                        : "rgba(83, 138, 62, 0.3)",
                  },
                },
              }}
            >
              {section === "personal" && (
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
                  style={{ marginRight: "8px" }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
              {section === "academico" && (
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
                  style={{ marginRight: "8px" }}
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              )}
              {section === "adicional" && (
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
                  style={{ marginRight: "8px" }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              )}
              {section === "personal" && "Datos Personales"}
              {section === "academico" && "Información Académica"}
              {section === "adicional" && "Información Adicional"}

              {/* Indicador de error */}
              {hasErrorsInSection(section) && (
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
          ))}
        </Box>

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
              // Evitar scrollbar innecesario
              height: "auto",
            }}
          >
            {/* Datos personales */}
            <Box
              sx={{ display: activeSection === "personal" ? "block" : "none" }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  overflow: "visible",
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
                    Datos Personales
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Primera fila */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Primer Nombre"
                        name="primer_nombre"
                        value={formData.primer_nombre || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.primer_nombre}
                        helperText={errors.primer_nombre}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Segundo Nombre"
                        name="segundo_nombre"
                        value={formData.segundo_nombre || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.segundo_nombre}
                        helperText={errors.segundo_nombre}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Primer Apellido"
                        name="primer_apellido"
                        value={formData.primer_apellido || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.primer_apellido}
                        helperText={errors.primer_apellido}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Segundo Apellido"
                        name="segundo_apellido"
                        value={formData.segundo_apellido || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.segundo_apellido}
                        helperText={errors.segundo_apellido}
                        sx={textFieldStyle}
                      />
                    </Grid>

                    {/* Segunda fila */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Identidad"
                        name="identidad"
                        value={formData.identidad || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.identidad}
                        helperText={errors.identidad}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Nacionalidad"
                        name="nacionalidad"
                        value={formData.nacionalidad || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.nacionalidad}
                        helperText={errors.nacionalidad}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl component="fieldset" sx={formControlStyle}>
                        <FormLabel id="genero-label">Género</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="genero-label"
                          name="genero"
                          value={formData.genero}
                          onChange={handleGenderChange}
                        >
                          <FormControlLabel
                            value="Masculino"
                            control={
                              <Radio
                                sx={{
                                  color: "#2196F3", // Color azul para masculino
                                  "&.Mui-checked": {
                                    color: "#2196F3",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ color: "#2196F3", fontFamily }}>
                                Masculino
                              </Typography>
                            }
                            sx={{
                              "& .MuiFormControlLabel-label": { fontFamily },
                              "& .MuiRadio-root": {
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              },
                            }}
                          />
                          <FormControlLabel
                            value="Femenino"
                            control={
                              <Radio
                                sx={{
                                  color: "#E91E63", // Color rosa para femenino
                                  "&.Mui-checked": {
                                    color: "#E91E63",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ color: "#E91E63", fontFamily }}>
                                Femenino
                              </Typography>
                            }
                            sx={{
                              "& .MuiFormControlLabel-label": { fontFamily },
                              "& .MuiRadio-root": {
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {/* Tercera fila */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Fecha de Nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento || ""}
                        onChange={handleFechaNacimientoChange}
                        error={!!errors.fecha_nacimiento}
                        helperText={errors.fecha_nacimiento || ""}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // Restricción para fecha máxima (hoy)
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                        }}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Edad"
                        name="edad"
                        type="number"
                        value={formData.edad || ""}
                        InputProps={{
                          readOnly: true,
                          sx: {
                            bgcolor: "rgba(0,0,0,0.02)",
                          },
                        }}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={formData.direccion || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>

            {/* Información académica */}
            <Box
              sx={{ display: activeSection === "academico" ? "block" : "none" }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  overflow: "visible",
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
                    Información Académica
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <FormControl
                        fullWidth
                        error={!!errors.nombre_grado}
                        required
                        sx={formControlStyle}
                      >
                        <InputLabel
                          id="grado-label"
                          error={!!errors.nombre_grado}
                        >
                          Grado
                        </InputLabel>
                        <Select
                          labelId="grado-label"
                          name="nombre_grado"
                          value={formData.nombre_grado || ""}
                          label="Grado"
                          onChange={handleSelectChange}
                          error={!!errors.nombre_grado}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root:hover": {
                                  backgroundColor: "#e7f5e8",
                                },
                                borderRadius: "12px",
                                mt: 1,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        >
                          <MenuItem value="Primero" sx={{ fontFamily }}>
                            Primero
                          </MenuItem>
                          <MenuItem value="Segundo" sx={{ fontFamily }}>
                            Segundo
                          </MenuItem>
                          <MenuItem value="Tercero" sx={{ fontFamily }}>
                            Tercero
                          </MenuItem>
                          <MenuItem value="Cuarto" sx={{ fontFamily }}>
                            Cuarto
                          </MenuItem>
                          <MenuItem value="Quinto" sx={{ fontFamily }}>
                            Quinto
                          </MenuItem>
                          <MenuItem value="Sexto" sx={{ fontFamily }}>
                            Sexto
                          </MenuItem>
                          <MenuItem value="Séptimo" sx={{ fontFamily }}>
                            Séptimo
                          </MenuItem>
                          <MenuItem value="Octavo" sx={{ fontFamily }}>
                            Octavo
                          </MenuItem>
                          <MenuItem value="Noveno" sx={{ fontFamily }}>
                            Noveno
                          </MenuItem>
                        </Select>
                        {errors.nombre_grado && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontFamily, mt: 0.5, ml: 1.5 }}
                          >
                            {errors.nombre_grado}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl
                        fullWidth
                        error={!!errors.seccion}
                        required
                        sx={formControlStyle}
                      >
                        <InputLabel id="seccion-label" error={!!errors.seccion}>
                          Sección
                        </InputLabel>
                        <Select
                          labelId="seccion-label"
                          name="seccion"
                          value={formData.seccion || ""}
                          label="Sección"
                          onChange={handleSelectChange}
                          error={!!errors.seccion}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root:hover": {
                                  backgroundColor: "#e7f5e8",
                                },
                                borderRadius: "12px",
                                mt: 1,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        >
                          <MenuItem value="A" sx={{ fontFamily }}>
                            A
                          </MenuItem>
                          <MenuItem value="B" sx={{ fontFamily }}>
                            B
                          </MenuItem>
                          <MenuItem value="C" sx={{ fontFamily }}>
                            C
                          </MenuItem>
                        </Select>
                        {errors.seccion && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontFamily, mt: 0.5, ml: 1.5 }}
                          >
                            {errors.seccion}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha de Admisión"
                        name="fecha_admision"
                        type="date"
                        value={formData.fecha_admision || ""}
                        onChange={handleChange}
                        error={!!errors.fecha_admision}
                        helperText={errors.fecha_admision || ""}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // Restricción para fecha máxima (hoy)
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                        }}
                        required
                        sx={textFieldStyle}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl
                        fullWidth
                        error={!!errors.plan_pago}
                        required
                        sx={formControlStyle}
                      >
                        <InputLabel
                          id="plan-pago-label"
                          error={!!errors.plan_pago}
                        >
                          Plan de Pago
                        </InputLabel>
                        <Select
                          labelId="plan-pago-label"
                          name="plan_pago"
                          value={formData.plan_pago || ""}
                          label="Plan de Pago"
                          onChange={handleSelectChange}
                          error={!!errors.plan_pago}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root:hover": {
                                  backgroundColor: "#e7f5e8",
                                },
                                borderRadius: "12px",
                                mt: 1,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        >
                          <MenuItem value="Normal" sx={{ fontFamily }}>
                            Normal
                          </MenuItem>
                          <MenuItem value="Nivelado" sx={{ fontFamily }}>
                            Nivelado
                          </MenuItem>
                        </Select>
                        {errors.plan_pago && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontFamily, mt: 0.5, ml: 1.5 }}
                          >
                            {errors.plan_pago}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    {isEditing && (
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth sx={formControlStyle}>
                          <InputLabel id="estado-label">Estado</InputLabel>
                          <Select
                            labelId="estado-label"
                            name="estado"
                            value={formData.estado || "Activo"}
                            label="Estado"
                            onChange={handleSelectChange}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  "& .MuiMenuItem-root:hover": {
                                    backgroundColor: "#e7f5e8",
                                  },
                                  borderRadius: "12px",
                                  mt: 1,
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                },
                              },
                            }}
                          >
                            <MenuItem value="Activo" sx={{ fontFamily }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: "#538A3E",
                                  }}
                                />
                                Activo
                              </Box>
                            </MenuItem>
                            <MenuItem value="Inactivo" sx={{ fontFamily }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: "#F38223",
                                  }}
                                />
                                Inactivo
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Box>

            {/* Información adicional */}
            <Box
              sx={{ display: activeSection === "adicional" ? "block" : "none" }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  overflow: "visible",
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
                    Información Adicional
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2,
                          border: "1px solid rgba(0,0,0,0.05)",
                          borderRadius: "12px",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <FormControl component="fieldset" sx={formControlStyle}>
                          <FormLabel component="legend">¿Es Zurdo?</FormLabel>
                          <RadioGroup
                            row
                            name="es_zurdo"
                            value={formData.es_zurdo?.toString()}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Sí"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="No"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2,
                          border: "1px solid rgba(0,0,0,0.05)",
                          borderRadius: "12px",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <FormControl component="fieldset" sx={formControlStyle}>
                          <FormLabel component="legend">
                            ¿Dificultad en Educación Física?
                          </FormLabel>
                          <RadioGroup
                            row
                            name="dif_educacion_fisica"
                            value={formData.dif_educacion_fisica?.toString()}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Sí"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="No"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2,
                          border: "1px solid rgba(0,0,0,0.05)",
                          borderRadius: "12px",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <FormControl component="fieldset" sx={formControlStyle}>
                          <FormLabel component="legend">
                            ¿Reacción Alérgica?
                          </FormLabel>
                          <RadioGroup
                            row
                            name="reaccion_alergica"
                            value={formData.reaccion_alergica?.toString()}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Sí"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="No"
                              sx={{
                                "& .MuiFormControlLabel-label": { fontFamily },
                                "& .MuiRadio-root": {
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Card>
                    </Grid>

                    {formData.reaccion_alergica && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Descripción de la Alergia"
                          name="descripcion_alergica"
                          value={formData.descripcion_alergica || ""}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          multiline
                          rows={3}
                          error={!!errors.descripcion_alergica}
                          helperText={errors.descripcion_alergica}
                          required
                          sx={{
                            ...textFieldStyle,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#538A3E",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#1A1363",
                                  borderWidth: "2px",
                                },
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
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
            <Button
              variant="contained"
              onClick={() => {
                setIsNavigating(true);
                if (activeSection === "personal") {
                  if (isModal && onClose) onClose();
                  else navigate("/estudiantes");
                } else if (activeSection === "academico") {
                  setActiveSection("personal");
                } else {
                  setActiveSection("academico");
                }
                setTimeout(() => {
                  setIsNavigating(false);
                }, 100);

                setEstudianteUUID(formData?.uuid ?? null);
              }}
              sx={secondaryButtonStyle}
              startIcon={
                activeSection === "personal" ? (
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
              {activeSection === "personal" ? "Cancelar" : "Anterior"}
            </Button>

            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setIsNavigating(true);
                if (activeSection === "personal") {
                  setActiveSection("academico");
                } else if (activeSection === "academico") {
                  setActiveSection("adicional");
                } else {
                  setIsNavigating(false);
                  handleSubmit(e as React.FormEvent);
                }
                setTimeout(() => {
                  setIsNavigating(false);
                }, 100);
              }}
              disabled={isSubmitting}
              type="button"
              sx={{
                bgcolor: "#538A3E",
                fontFamily,
                textTransform: "none",
                borderRadius: "12px",
                px: 4,
                py: 1.2,
                minWidth: "140px",
                fontWeight: 600,
                fontSize: "15px",
                color: "white",
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
              }}
              startIcon={
                // Cambiado de endIcon a startIcon
                isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : activeSection !== "adicional" ? (
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
                : activeSection !== "adicional"
                ? "Siguiente"
                : isEditing
                ? "Actualizar"
                : "Guardar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FormularioEstudiante;
