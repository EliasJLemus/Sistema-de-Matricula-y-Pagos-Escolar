import { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Layout
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";

// Páginas
import Home from "./pages/home/home";
import DashboardPage from "./pages/dashboard/dashboard";
import EstudiantesPage from "./pages/estudiantes/EstudiantesPage";
import NuevoEstudiantePage from "./pages/estudiantes/nuevo/NuevoEstudiantePage";
import EditarEstudiantePage from "./pages/estudiantes/editar/EditarEstudiantePage";
import ApoderadoPage from "./pages/apoderados/ApoderadosPage";
import NuevoApoderado from "./pages/apoderados/nuevo/NuevoApoderado";
import EditarApoderado from "./pages/apoderados/editar/EditarApoderado";
import SubirComprobante from "./components/Comprobante/subirComprobante";
import Pagos from "./pages/pagos/Pagos";
import MatriculaPage from "./pages/pagos/matricula/MatriculaPage";
import NuevoMatricula from "./pages/pagos/matricula/nuevo/NuevoMatricula";
import EditarMatricula from "./pages/pagos/matricula/editar/EditarMatricula";
import MensualidadPage from "./pages/pagos/mensualidad/MensualidadPage";
import NuevoMensualidad from "./pages/pagos/mensualidad/nuevo/NuevoMensualidad";
import EditarMensualidad from "./pages/pagos/mensualidad/editar/EditarMensualidad";
import NiveladoPage from "./pages/pagos/nivelados/NiveladoPage";
import NuevoNivelado from "./pages/pagos/nivelados/nuevo/NuevoNivelado";
import EditarNivelado from "./pages/pagos/nivelados/editar/EditarNivelado";

import BecasPage from "./pages/becas/BecasPage";
import NuevoBecas from "./pages/becas/nuevo/NuevoBecas";
import EditarBecas from "./pages/becas/editar/EditarBecas";


import Login from "./pages/login/login";
import UsuariosPage from "./pages/usuarios/UsuariosPage"; // 👈🏼 Nuevo import

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isComprobanteRoute = location.pathname === "/subir-comprobante";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setAuthLoaded(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (!authLoaded && !isComprobanteRoute) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f7f7f7",
        }}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography
          variant="body1"
          sx={{ color: "#555", fontFamily: "'Nunito', sans-serif" }}
        >
          Verificando sesión...
        </Typography>
      </Box>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh" }}>
          {!isComprobanteRoute && isLoggedIn && (
            <Sidebar
              isSidebarVisible={isSidebarVisible}
              onLogout={handleLogout}
              toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
            />
          )}

          <Box
            flexGrow={1}
            sx={{
              marginLeft:
                !isComprobanteRoute && isLoggedIn && isSidebarVisible
                  ? "240px"
                  : !isComprobanteRoute && isLoggedIn
                  ? "70px"
                  : "0px",
              transition: "margin 0.3s ease",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {!isComprobanteRoute && isLoggedIn && (
              <Topbar
                onMenuClick={() => setIsSidebarVisible(!isSidebarVisible)}
              />
            )}

            <Box
              sx={{
                padding: isComprobanteRoute ? "0" : "20px",
                marginTop: isComprobanteRoute ? "0" : "10px",
                overflow: "auto",
                flex: 1,
              }}
            >
              <Routes>
                {/* Rutas públicas */}
                <Route
                  path="/"
                  element={
                    !isLoggedIn ? (
                      <Login onLogin={() => setIsLoggedIn(true)} />
                    ) : (
                      <Navigate to="/home" />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    !isLoggedIn ? (
                      <Login onLogin={() => setIsLoggedIn(true)} />
                    ) : (
                      <Navigate to="/home" />
                    )
                  }
                />
                <Route
                  path="/subir-comprobante"
                  element={<SubirComprobante />}
                />

                {/* Rutas protegidas */}
                <Route
                  path="/home"
                  element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                  path="/reportes"
                  element={
                    isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/estudiantes"
                  element={
                    isLoggedIn ? <EstudiantesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/estudiantes/nuevo"
                  element={
                    isLoggedIn ? (
                      <NuevoEstudiantePage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/estudiantes/editar/:id"
                  element={
                    isLoggedIn ? (
                      <EditarEstudiantePage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/apoderados"
                  element={
                    isLoggedIn ? <ApoderadoPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/apoderados/nuevo"
                  element={
                    isLoggedIn ? <NuevoApoderado /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/apoderados/editar/:id"
                  element={
                    isLoggedIn ? <EditarApoderado /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    isLoggedIn ? <UsuariosPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos"
                  element={isLoggedIn ? <Pagos /> : <Navigate to="/login" />}
                />
                <Route
                  path="/pagos/matricula"
                  element={
                    isLoggedIn ? <MatriculaPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/matricula/nuevo"
                  element={
                    isLoggedIn ? <NuevoMatricula /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/matricula/editar/:id"
                  element={
                    isLoggedIn ? <EditarMatricula /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/mensualidad"
                  element={
                    isLoggedIn ? <MensualidadPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/mensualidad/nuevo"
                  element={
                    isLoggedIn ? <NuevoMensualidad /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/mensualidad/editar/:id"
                  element={
                    isLoggedIn ? (
                      <EditarMensualidad />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/pagos/nivelados"
                  element={
                    isLoggedIn ? <NiveladoPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/nivelados/nuevo"
                  element={
                    isLoggedIn ? <NuevoNivelado /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/pagos/nivelados/editar/:id"
                  element={
                    isLoggedIn ? <EditarNivelado /> : <Navigate to="/login" />
                  }
                />
             <Route
                  path="/becas"
                  element={
                    isLoggedIn ? <BecasPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/becas/nuevo"
                  element={
                    isLoggedIn ? <NuevoBecas /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/becas/editar/:id"
                  element={
                    isLoggedIn ? <EditarBecas /> : <Navigate to="/login" />
                  }
                />


              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
