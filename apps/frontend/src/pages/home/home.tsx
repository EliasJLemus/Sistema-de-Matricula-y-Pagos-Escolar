"use client";

import { useEffect, useState, useRef, JSX } from "react";
import { useNavigate, useLocation, To } from "react-router-dom";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PaymentIcon from "@mui/icons-material/Payment";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Contadores individuales para cada estadística
  type StatKey = "estudiantes" | "apoderados" | "secciones";

  const [counters, setCounters] = useState<Record<StatKey, number>>({
    estudiantes: 0,
    apoderados: 0,
    secciones: 0,
  });

  // Referencias para temporizadores correctamente tipadas
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef<number | null>(null);

  // Estado para controlar si la animación actual ha terminado
  const [animationComplete, setAnimationComplete] = useState(false);
  const statsData: { label: string; value: number; key: StatKey; icon: JSX.Element; color: string; bgColor: string }[] = [
    {
      label: "Estudiantes",
      value: +600,
      key: "estudiantes",
      icon: <SchoolOutlinedIcon style={{ fontSize: 28, color: "#538A3E" }} />,
      color: "#538A3E",
      bgColor: "#e7f5e8",
    },
    {
      label: "Apoderados",
      value: +600,
      key: "apoderados",
      icon: <FamilyRestroomIcon style={{ fontSize: 28, color: "#1B1263" }} />,
      color: "#1B1263",
      bgColor: "rgba(27, 18, 99, 0.1)",
    },
    {
      label: "Secciones",
      value: 18,
      key: "secciones",
      icon: <InventoryIcon style={{ fontSize: 28, color: "#F38223" }} />,
      color: "#F38223",
      bgColor: "rgba(243, 130, 35, 0.1)",
    },
  ];

  // Verificar si estamos en la ruta Home
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Mostrar elementos después de cargar
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Actualizar la fecha y hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Limpiar temporizadores cuando el componente se desmonta o la ruta cambia
  useEffect(() => {
    // Solo iniciar las animaciones si estamos en la página principal
    if (isHomePage) {
      // Iniciar la animación para el contador actual
      startCounterAnimation();
    } else {
      // Limpiar temporizadores si no estamos en la página principal
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
      if (rotationRef.current !== null) {
        window.clearTimeout(rotationRef.current);
        rotationRef.current = null;
      }
    }

    return () => {
      // Limpiar temporizadores cuando el componente se desmonta
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
      }
      if (rotationRef.current !== null) {
        window.clearTimeout(rotationRef.current);
        rotationRef.current = null;
      }

      // Resetear contadores
      setCounters({
        estudiantes: 0,
        apoderados: 0,
        secciones: 0,
      });
    };
  }, [isHomePage, currentStatIndex]); // Dependencia en isHomePage y currentStatIndex

  // Efecto para cambiar a la siguiente estadística después de la pausa
  useEffect(() => {
    if (animationComplete && isHomePage) {
      rotationRef.current = window.setTimeout(() => {
        // Avanzar al siguiente índice (con ciclo)
        setCurrentStatIndex((prevIndex) => (prevIndex + 1) % statsData.length);
        setAnimationComplete(false);
      }, 3000); // 3 segundos de pausa
    }

    return () => {
      if (rotationRef.current !== null) {
        window.clearTimeout(rotationRef.current);
        rotationRef.current = null;
      }
    };
  }, [animationComplete, statsData.length, isHomePage]);

  // Función para iniciar la animación del contador actual
  const startCounterAnimation = () => {
    // Limpiar cualquier animación anterior
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }

    // Datos de la estadística actual
    const statData = statsData[currentStatIndex];
    const statKey = statData.key;
    const targetValue = statData.value;

    // Resetear el contador para comenzar desde 0
    setCounters((prev) => ({
      ...prev,
      [statKey]: 0,
    }));

    setAnimationComplete(false);

    // Variables para la animación
    let currentValue = 0;
    const step = Math.max(1, Math.floor(targetValue / 30));

    // Crear el intervalo
    animationRef.current = window.setInterval(() => {
      if (currentValue < targetValue) {
        // Incrementar el contador
        currentValue = Math.min(currentValue + step, targetValue);
        setCounters((prev) => ({
          ...prev,
          [statKey]: currentValue,
        }));

        // Cuando llega al valor objetivo, detener la animación
        if (currentValue >= targetValue) {
          if (animationRef.current !== null) {
            window.clearInterval(animationRef.current);
            animationRef.current = null;
          }
          setAnimationComplete(true);
        }
      }
    }, 30);
  };

  // Formato de fecha
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  // Formato de hora
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString("es-ES", options);
  };

  // Función para navegación
  const handleNavigation = (route: To) => {
    navigate(route);
  };

  // Si no estamos en la página Home, no renderizar el componente
  if (!isHomePage) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily:
          "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(#f0f4f8 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Usando exactamente la misma estructura que TablaEstudiantes */}
      <Box id="tabla-estudiantes-container" sx={{ position: "relative" }}>
        {/* Banner de bienvenida con fecha y hora dinámicas */}
        <div
          className="bg-[#1B1263] rounded-xl mb-6 text-white overflow-hidden relative"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(27, 18, 99, 0.3), 0 8px 10px -6px rgba(27, 18, 99, 0.2)",
            background:
              "linear-gradient(135deg, #2a1e8f 0%, #1B1263 50%, #120c40 100%)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          {/* Decoraciones */}
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-[#ffffff15] rounded-full transform translate-x-1/4 -translate-y-1/4 blur-md"
            style={{
              animation: "pulse 2.5s ease-in-out infinite alternate",
            }}
          ></div>

          <div
            className="absolute bottom-0 left-0 w-32 h-32 bg-[#ffffff10] rounded-full transform -translate-x-1/4 translate-y-1/4 blur-md"
            style={{
              animation: "pulse 2.5s ease-in-out 1s infinite alternate",
            }}
          ></div>

          {/* Patrones sutiles superpuestos */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fillOpacity="0.4" fillRule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E\')',
            }}
          ></div>

          <div className="p-6 flex justify-between items-center relative z-10">
            <div>
              <h1
                className="text-3xl font-bold mb-1 text-white"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                  transition:
                    "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
                }}
              >
                ¡Bienvenido al Sistema!
              </h1>
              <p
                className="text-lg text-white/90"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                  transition:
                    "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
                }}
              >
                Sistema de Matrícula y Pagos Escolar
              </p>
            </div>
            <div
              className="text-right"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.9)",
                transition:
                  "opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s",
              }}
            >
              <p className="text-sm font-medium mb-1 text-white/80">
                {formatDate(currentDateTime)}
              </p>
              <p className="text-2xl font-bold text-white">
                {formatTime(currentDateTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tarjetas */}
          {[
            {
              title: "Estudiantes",
              description:
                "Gestión de alumnos, expedientes y registros académicos",
              badge: "+600 Activos",
              icon: (
                <SchoolOutlinedIcon
                  style={{ fontSize: 32, color: "#538A3E" }}
                  className="relative z-10"
                />
              ),
              color: "#538A3E",
              bgColor: "#e7f5e8",
              borderColor: "rgba(83, 138, 62, 0.1)",
              route: "/estudiantes",
              delay: 0.2,
            },
            {
              title: "Apoderados",
              description: "Información de padres, madres y tutores legales",
              badge: "+600 Contactos",
              icon: (
                <FamilyRestroomIcon
                  style={{ fontSize: 32, color: "#1B1263" }}
                  className="relative z-10"
                />
              ),
              color: "#1B1263",
              bgColor: "rgba(27, 18, 99, 0.1)",
              borderColor: "rgba(27, 18, 99, 0.1)",
              route: "/apoderados",
              delay: 0.3,
            },
            {
              title: "Pagos",
              description: "Control de matrículas, mensualidades y otros pagos",
              badge: " Este mes",
              icon: (
                <PaymentIcon
                  style={{ fontSize: 32, color: "#F38223" }}
                  className="relative z-10"
                />
              ),
              color: "#F38223",
              bgColor: "rgba(243, 130, 35, 0.1)",
              borderColor: "rgba(243, 130, 35, 0.1)",
              route: "/pagos",
              delay: 0.4,
            },
            {
              title: "Reportes",
              description: "Estadísticas, informes y análisis de datos",
              badge: "8 Reportes",
              icon: (
                <AnalyticsIcon
                  style={{ fontSize: 32, color: "#edad4c" }}
                  className="relative z-10"
                />
              ),
              color: "#edad4c",
              bgColor: "#fff9db",
              borderColor: "rgba(237, 173, 76, 0.1)",
              route: "/reportes",
              delay: 0.5,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl overflow-hidden cursor-pointer relative transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${card.borderColor}`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out ${card.delay}s, transform 0.5s ease-out ${card.delay}s, box-shadow 0.3s ease, transform 0.3s ease`,
              }}
              onClick={() => handleNavigation(card.route)}
            >
              {/* Borde superior con efecto brillante */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${card.color}, ${card.color}aa, ${card.color})`,
                  backgroundSize: "200% 100%",
                  animation: "gradientMove 2s ease infinite",
                }}
              ></div>

              {/* Efecto de brillo sutil en hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `inset 0 0 0 2px ${card.color}30`,
                  borderRadius: "0.75rem",
                }}
              ></div>

              <div className="p-5 flex items-center">
                <div
                  className="p-4 rounded-lg mr-4 flex items-center justify-center transition-colors relative"
                  style={{ backgroundColor: card.bgColor }}
                >
                  {/* Efecto de brillo detrás del icono */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle at center, ${card.color}30 0%, ${card.color}00 70%)`,
                      filter: "blur(5px)",
                      animation: "pulse 2s infinite",
                    }}
                  ></div>
                  {card.icon}
                </div>

                <div className="flex-1">
                  <h2
                    className={`text-xl font-bold text-gray-800 mb-1 group-hover:text-[${card.color}] transition-colors`}
                  >
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {card.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className="font-medium text-xs py-1 px-2 rounded-full"
                      style={{
                        color: card.color,
                        backgroundColor: card.bgColor,
                        border: `1px solid ${card.color}20`,
                      }}
                    >
                      {card.badge}
                    </span>
                    <span
                      className="flex items-center text-sm font-bold group-hover:translate-x-1 transition-transform"
                      style={{ color: card.color }}
                    >
                      Gestionar
                      <ArrowForwardIcon fontSize="small" className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Acciones Rápidas */}
          <div
            className="bg-white rounded-xl overflow-hidden col-span-1 relative"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(83, 138, 62, 0.1)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition:
                "opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23538A3E" fillOpacity="0.5"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>

            <div className="relative">
              <div
                className="bg-gradient-to-r from-[#538A3E] to-[#6baa50] text-white p-4"
                style={{
                  boxShadow: "0 4px 10px rgba(83, 138, 62, 0.2)",
                }}
              >
                <h2 className="text-lg font-bold flex items-center relative z-10">
                  <AddCircleOutlineIcon
                    style={{ fontSize: 22, marginRight: 8 }}
                  />
                  Acciones Rápidas
                </h2>
              </div>

              <div className="px-4 pt-4 pb-4 space-y-3">
                {[
                  {
                    title: "Nuevo Estudiante",
                    icon: <PersonAddAltIcon />,
                    from: "#538A3E",
                    to: "#6baa50",
                    shadow: "rgba(83, 138, 62, 0.3)",
                    action: () => handleNavigation("/estudiantes/nuevo"),
                  },
                  {
                    title: "Nuevo Apoderado",
                    icon: <PersonAddAltIcon />,
                    from: "#1B1263",
                    to: "#2a1e8f",
                    shadow: "rgba(27, 18, 99, 0.3)",
                    action: () => handleNavigation("/apoderados/nuevo"),
                  },
                  {
                    title: "Registrar Pago",
                    icon: <CreditScoreIcon />,
                    from: "#F38223",
                    to: "#ff993f",
                    shadow: "rgba(243, 130, 35, 0.3)",
                    action: () => handleNavigation("/pagos/nuevo"),
                  },
                  {
                    title: "Generar Reporte",
                    icon: <AssessmentIcon />,
                    from: "#edad4c",
                    to: "#ffbe5c",
                    shadow: "rgba(237, 173, 76, 0.3)",
                    action: () => handleNavigation("/reportes/generar"),
                  },
                ].map((button, index) => (
                  <button
                    key={index}
                    className="w-full relative overflow-hidden text-white p-3 rounded-lg flex items-center justify-between group"
                    style={{
                      background: `linear-gradient(to right, ${button.from}, ${button.to})`,
                      boxShadow: `0 4px 8px -2px ${button.shadow}`,
                    }}
                    onClick={button.action}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute top-0 bottom-0 w-20 opacity-0 group-hover:opacity-100 bg-white/30 blur-md transform -skew-x-12 -translate-x-32 group-hover:translate-x-64 transition-all duration-1000"></div>

                    <div className="flex items-center relative z-10">
                      <div className="bg-white/20 p-2 rounded-lg mr-3">
                        {button.icon}
                      </div>
                      <span className="font-bold">{button.title}</span>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center transform transition-transform group-hover:translate-x-1 relative z-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Año Escolar Panel */}
          <div
            className="bg-white rounded-xl overflow-hidden col-span-2 relative"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(27, 18, 99, 0.1)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(20px)",
              transition:
                "opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s",
            }}
          >
            {/* Patrones decorativos inspirados en interfaces gaming */}
            <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml,%3Csvg width="44" height="12" viewBox="0 0 44 12" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 12v-2L0 0v10l4 2h16zm18 0l4-2V0L22 10v2h16zM20 0v8L4 0h16zm18 0L22 8V0h16z" fill="%23ffffff" fillOpacity="0.4" fillRule="evenodd"/%3E%3C/svg%3E\')',
                  backgroundSize: "44px 12px",
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div
                className="bg-gradient-to-r from-[#1B1263] to-[#2a1e8f] text-white p-4 flex justify-between items-center"
                style={{
                  boxShadow: "0 4px 10px rgba(27, 18, 99, 0.2)",
                }}
              >
                <h2 className="text-lg font-bold flex items-center">
                  <AutoStoriesIcon style={{ fontSize: 22, marginRight: 8 }} />
                  Año Escolar 2024-2025
                </h2>
                <div
                  className="bg-blue-100 text-[#1B1263] text-xs font-bold py-1 px-3 rounded-full border border-blue-200"
                  style={{ boxShadow: "0 2px 5px rgba(27, 18, 99, 0.2)" }}
                >
                  En curso
                </div>
              </div>

              <div className="p-5">
                {/* Billboard Animation for Stats */}
                <div className="relative h-64 flex items-center justify-center overflow-hidden">
                  {/* Background decorative elements */}
                  <div
                    className="absolute w-[500px] h-[500px] border-[30px] border-[#1B1263]/5 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginLeft: "-250px",
                      marginTop: "-250px",
                      animation: "rotate 60s linear infinite",
                    }}
                  ></div>

                  <div
                    className="absolute w-[400px] h-[400px] border-[20px] border-[#538A3E]/5 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginLeft: "-200px",
                      marginTop: "-200px",
                      animation: "rotate 45s linear infinite reverse",
                    }}
                  ></div>

                  {/* Animated Stats */}
                  <div className="relative">
                    <div
                      key={currentStatIndex} // Forzar rerenderizado cuando cambia el índice
                      className="text-center"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scale(1)" : "scale(0.8)",
                        transition:
                          "opacity 0.5s ease-out, transform 0.5s ease-out",
                      }}
                    >
                      <div className="flex justify-center mb-6">
                        <div
                          className="p-4 rounded-full relative"
                          style={{
                            backgroundColor:
                              statsData[currentStatIndex].bgColor,
                            boxShadow: `0 8px 16px -4px ${statsData[currentStatIndex].color}30`,
                            animation: "scaleIn 0.6s ease-out",
                          }}
                        >
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `radial-gradient(circle at center, ${statsData[currentStatIndex].color}30 0%, ${statsData[currentStatIndex].color}00 70%)`,
                              filter: "blur(8px)",
                              animation: "pulse 2s infinite alternate",
                            }}
                          ></div>
                          {statsData[currentStatIndex].icon}
                        </div>
                      </div>

                      <h3
                        className="text-xl font-bold text-gray-700 mb-2"
                        style={{
                          animation: "fadeInUp 0.4s ease-out 0.2s both",
                        }}
                      >
                        {statsData[currentStatIndex].label}
                      </h3>

                      <div
                        className="text-5xl font-bold"
                        style={{
                          color: statsData[currentStatIndex].color,
                          animation: "scaleIn 0.5s ease-out 0.3s both",
                        }}
                      >
                        {/* Mostrar directamente el valor del contador para esta estadística */}
                        {counters[statsData[currentStatIndex].key]}
                      </div>

                      {/* Progress indicator */}
                      <div className="flex justify-center mt-8 space-x-2">
                        {statsData.map((_, index) => (
                          <div
                            key={index}
                            className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                              backgroundColor:
                                index === currentStatIndex
                                  ? statsData[index].color
                                  : "#e5e7eb",
                              width:
                                index === currentStatIndex ? "24px" : "8px",
                            }}
                            onClick={() => {
                              // Permitir cambiar manualmente
                              if (animationRef.current !== null) {
                                window.clearInterval(animationRef.current);
                                animationRef.current = null;
                              }
                              if (rotationRef.current !== null) {
                                window.clearTimeout(rotationRef.current);
                                rotationRef.current = null;
                              }
                              setCurrentStatIndex(index);
                              setAnimationComplete(false);
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Definición de estilos con la etiqueta style normal */}
      <style>
        {`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
        
        @keyframes rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Home;