import {
  Box,
  ListItemButton,
  Typography,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentIcon from "@mui/icons-material/Payment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

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
    const pathIndex = navigationItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (pathIndex !== -1) {
      setActiveIndex(pathIndex);
    }

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
  }, [location.pathname]);

  const puedeVerReportes =
    rol === "admin" || rol === "administracion" || rol === "directivo";

  const navigationItems = [
    { icon: <HomeIcon />, text: "Home", path: "/home" },
    { icon: <SchoolIcon />, text: "Estudiantes", path: "/estudiantes" },
    { icon: <PeopleIcon />, text: "Apoderados", path: "/apoderados" },
    { icon: <PaymentIcon />, text: "Pagos", path: "/pagos" },
    ...(puedeVerReportes
      ? [{ icon: <DescriptionIcon />, text: "Reportes", path: "/reportes" }]
      : []),
  ];

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
        }}
      >
        <Avatar
          alt="Usuario"
          sx={{
            width: isSidebarVisible ? 80 : 40,
            height: isSidebarVisible ? 80 : 40,
            border: "3px solid #FFFFFF",
            fontSize: isSidebarVisible ? 32 : 18,
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
            fontFamily,
            mb: 3,
          }}
        >
          {usuario || "Usuario"}
        </Typography>
      )}

      <Box sx={{ flex: 1, px: isSidebarVisible ? 2 : 0 }}>
        {navigationItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <ListItemButton
              key={index}
              component={Link}
              to={item.path}
              onClick={() => handleClick(index)}
              sx={{
                my: 0.5,
                borderRadius: "8px",
                color: "#FFFFFF",
                justifyContent: isSidebarVisible ? "flex-start" : "center",
                backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: isSidebarVisible ? "26px" : "auto",
                  mr: isSidebarVisible ? 2 : 0,
                }}
              >
                {item.icon}
              </Box>
              {isSidebarVisible && (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontFamily,
                  }}
                >
                  {item.text}
                </Typography>
              )}
            </ListItemButton>
          );
        })}
      </Box>

      <Box sx={{ mt: 2, px: isSidebarVisible ? 2 : 0 }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            backgroundColor: "#F38223",
            color: "#FFFFFF",
            borderRadius: "8px",
            justifyContent: isSidebarVisible ? "flex-start" : "center",
          }}
        >
          <ExitToAppIcon sx={{ mr: isSidebarVisible ? 2 : 0 }} />
          {isSidebarVisible && (
            <Typography sx={{ fontFamily, fontWeight: 600 }}>Salir</Typography>
          )}
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
