import { Box, ListItemButton, Typography, Avatar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentIcon from "@mui/icons-material/Payment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";


import { StarIcon } from "lucide-react";


interface SidebarProps {
  isSidebarVisible: boolean;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const EXACT_PADDING = 24;
const BUTTON_SIZE = 44;

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarVisible,
  onLogout,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<string>("");
  const [rol, setRol] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUsuario(decoded.usuario || "");
        setRol(decoded.rol || "");
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
    }
  }, []);

  const puedeVerReportes =
    rol === "admin" || rol === "administracion" || rol === "directivo";

  const navigationItems = [
    { icon: <HomeIcon />, text: "Home", path: "/home" },
    { icon: <SchoolIcon />, text: "Estudiantes", path: "/estudiantes" },
    { icon: <PeopleIcon />, text: "Apoderados", path: "/apoderados" },
    { icon: <PaymentIcon />, text: "Pagos", path: "/pagos" },
    { icon: <StarIcon />, text: "Becas", path: "/becas" },
    ...(puedeVerReportes
      ? [{ icon: <DescriptionIcon />, text: "Reportes", path: "/reportes" }]
      : []),
  ];

  useEffect(() => {
    const pathIndex = navigationItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (pathIndex !== -1) {
      setActiveIndex(pathIndex);
    }
  }, [location.pathname, navigationItems]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Box
      sx={{
        width: isSidebarVisible ? "240px" : "70px",
        height: "100vh",
        background: "linear-gradient(180deg, #1A1363 0%, #538A3E 100%)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        transition: "width 0.3s ease",
        boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        paddingTop: `${EXACT_PADDING}px`,
        paddingBottom: `${EXACT_PADDING}px`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: isSidebarVisible ? 3 : 4,
          transition: "filter 0.2s ease",
        }}
      >
        <Avatar
          alt="Usuario"
          sx={{
            width: isSidebarVisible ? 80 : 40,
            height: isSidebarVisible ? 80 : 40,
            border: "3px solid #FFFFFF",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            fontSize: isSidebarVisible ? 32 : 20,
            fontWeight: 500,
            transition: "width 0.3s ease, height 0.3s ease",
            bgcolor: "#81BE83",
            color: "#FFFFFF",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          {usuario ? usuario.charAt(0).toUpperCase() : "U"}
        </Avatar>
      </Box>

      {isSidebarVisible && (
        <Typography
          variant="subtitle1"
          sx={{
            color: "#FFFFFF",
            fontWeight: 600,
            textAlign: "center",
            fontFamily: fontFamily,
            fontSize: "17px",
            mb: 3,
          }}
        >
          {usuario || "Usuario"}
        </Typography>
      )}

      {isSidebarVisible && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 600,
            width: "100%",
            pl: 4,
            mb: 1.5,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            fontFamily: fontFamily,
            fontSize: "12px",
          }}
        >
          Navegación
        </Typography>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: isSidebarVisible ? 2 : 0,
        }}
      >
        {navigationItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <Box
              key={index}
              sx={{
                width: isSidebarVisible ? "100%" : "auto",
                my: 0.5,
                display: "flex",
                justifyContent: "center",
                position: "relative",
                zIndex: hoveredIndex === index || isActive ? 2 : 1,
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => handleClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  width: isSidebarVisible ? "100%" : `${BUTTON_SIZE}px`,
                  height: `${BUTTON_SIZE}px`,
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: isSidebarVisible ? "flex-start" : "center",
                  alignItems: "center",
                  color: "#FFFFFF",
                  transition:
                    "all 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.05) translateZ(10px)",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                    filter: "brightness(1.2)",
                  },
                  "&:active": {
                    transform: "scale(0.98) translateZ(5px)",
                  },
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.15)"
                    : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  padding: isSidebarVisible ? "8px 16px" : 0,
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: isSidebarVisible ? "26px" : "auto",
                    marginRight: isSidebarVisible ? 2 : 0,
                    width: isSidebarVisible ? "auto" : "100%",
                    height: isSidebarVisible ? "auto" : "100%",
                  }}
                >
                  {item.icon}
                </Box>

                {isSidebarVisible && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "inherit",
                      fontFamily: fontFamily,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {item.text}
                  </Typography>
                )}
              </ListItemButton>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          px: isSidebarVisible ? 2 : 0,
          mt: 2,
          position: "relative",
          zIndex: hoveredIndex === 999 ? 2 : 1,
        }}
      >
        <Box
          sx={{
            width: isSidebarVisible ? "100%" : "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ListItemButton
            onClick={onLogout}
            onMouseEnter={() => setHoveredIndex(999)}
            onMouseLeave={() => setHoveredIndex(null)}
            sx={{
              width: isSidebarVisible ? "100%" : `${BUTTON_SIZE}px`,
              height: `${BUTTON_SIZE}px`,
              backgroundColor: "#F38223",
              color: "#FFFFFF",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition:
                "all 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                backgroundColor: "#e67615",
                transform: "scale(1.05) translateZ(10px)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                filter: "brightness(1.2)",
              },
              "&:active": {
                backgroundColor: "#d56a10",
                transform: "scale(0.98) translateZ(5px)",
              },
              display: "flex",
              justifyContent: isSidebarVisible ? "flex-start" : "center",
              alignItems: "center",
              padding: isSidebarVisible ? "8px 16px" : 0,
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: isSidebarVisible ? "26px" : "auto",
                marginRight: isSidebarVisible ? 2 : 0,
                width: isSidebarVisible ? "auto" : "100%",
                height: isSidebarVisible ? "auto" : "100%",
              }}
            >
              <ExitToAppIcon sx={{ color: "#FFFFFF" }} />
            </Box>

            {isSidebarVisible && (
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: fontFamily,
                  letterSpacing: "-0.1px",
                }}
              >
                Salir
              </Typography>
            )}
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
