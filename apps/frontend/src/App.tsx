import { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

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
import Login from "./pages/login/login";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setAuthLoaded(true); // Ya cargó
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (!authLoaded) {
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
        <Box display="flex">
          {isLoggedIn && (
            <Sidebar
              isSidebarVisible={isSidebarVisible}
              onLogout={handleLogout}
            />
          )}

          <Box
            flexGrow={1}
            ml={isLoggedIn && isSidebarVisible ? "300px" : "0px"}
            sx={{ transition: "margin 0.3s ease" }}
          >
            {isLoggedIn && (
              <Topbar
                onMenuClick={() => setIsSidebarVisible(!isSidebarVisible)}
              />
            )}

            <Box sx={{ padding: "20px", marginTop: "10px", overflow: "auto" }}>
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

                {/* Rutas protegidas */}
                <Route
                  path="/home"
                  element={
                    isLoggedIn ? <Home /> : <Navigate to="/login" />
                  }
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
  <Route path="/pagos" element={<Pagos />} />

{/* Rutas de matricula*/}
{/* <Route path="/pagos/matricula" element={<MatriculaPage />} />
                 <Route
                   path="/pagos/matricula/nuevo"
                   element={<NuevoMatricula />}
                 />
                 <Route
                   path="/pagos/matricula/editar/:id"
                   element={<EditarMatricula />}
                 /> */}
 
  {/* Rutas de matricula*/}
  <Route path="/pagos/mensualidad" element={<MensualidadPage />} />
                 <Route
                   path="/pagos/mensualidad/nuevo"
                   element={<NuevoMensualidad />}
                 />
                 <Route
                   path="/pagos/mensualidad/editar/:id"
                   element={<EditarMensualidad />}
                 />

                <Route
                  path="/subir-comprobante"
                  element={
                    isLoggedIn ? <SubirComprobante /> : <Navigate to="/login" />
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

export default App;