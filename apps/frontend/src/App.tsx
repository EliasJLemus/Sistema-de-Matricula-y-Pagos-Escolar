import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Topbar from "./pages/global/Topbar";
import DashboardPage from "../src/pages/dashboard/dashboard";
import Sidebar from "./pages/global/Sidebar";
import Home from "./pages/home/home";
import { Route, Routes } from "react-router-dom";

// Importación de componentes de estudiantes
import EstudiantesPage from "./pages/estudiantes/EstudiantesPage";
import NuevoEstudiantePage from "./pages/estudiantes/nuevo/NuevoEstudiantePage";
import EditarEstudiantePage from "./pages/estudiantes/editar/EditarEstudiantePage";

// Importación de componentes de apoderados
import ApoderadoPage from "./pages/apoderados/ApoderadosPage";
import NuevoApoderado from "./pages/apoderados/nuevo/NuevoApoderado";
import EditarApoderado from "./pages/apoderados/editar/EditarApoderado";
import SubirComprobante from "./components/Comprobante/subirComprobante";

//Importacion de componentes de Pagos
import Pagos from "./pages/pagos/Pagos";
import MatriculaPage from "./pages/pagos/matricula/MatriculaPage";
import NuevoMatricula from "./pages/pagos/matricula/nuevo/NuevoMatricula";
import EditarMatricula from "./pages/pagos/matricula/editar/EditarMatricula";

import MensualidadPage from "./pages/pagos/mensualidad/MensualidadPage";
import NuevoMensualidad from "./pages/pagos/mensualidad/nuevo/NuevoMensualidad";
import EditarMensualidad from "./pages/pagos/mensualidad/editar/EditarMensualidad";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          {/* Sidebar - always visible, but can be collapsed */}
          <Sidebar isSidebarVisible={isSidebarVisible} />

          {/* Main content */}
          <Box
            flexGrow={1}
            sx={{
              marginLeft: isSidebarVisible ? "240px" : "70px",
              padding: 0,
              position: "relative",
              width: `calc(100% - ${isSidebarVisible ? "240px" : "70px"})`,
            }}
          >
            <Topbar
              onMenuClick={() => setIsSidebarVisible(!isSidebarVisible)}
            />
            <Box
              sx={{
                padding: "20px",
                marginTop: "10px",
                overflow: "auto",
              }}
            >
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/reportes" element={<DashboardPage />} />
              
  {/* Nueva ruta para Pagos */}
  <Route path="/pagos" element={<Pagos />} />

                {/* Rutas de estudiantes */}
                <Route path="/estudiantes" element={<EstudiantesPage />} />
                <Route
                  path="/estudiantes/nuevo"
                  element={<NuevoEstudiantePage />}
                />
                <Route
                  path="/estudiantes/editar/:id"
                  element={<EditarEstudiantePage />}
                />
                <Route path="/subir-comprobante" element={<SubirComprobante />} />

                {/* Rutas de apoderados */}
                <Route path="/apoderados" element={<ApoderadoPage />} />
                <Route
                  path="/apoderados/nuevo"
                  element={<NuevoApoderado />}
                />
                <Route
                  path="/apoderados/editar/:id"
                  element={<EditarApoderado />}
                />

                {/* Add other routes as needed */}

                {/* Rutas de matricula*/}
                <Route path="/pagos/matricula" element={<MatriculaPage />} />
                <Route
                  path="/pagos/matricula/nuevo"
                  element={<NuevoMatricula />}
                />
                <Route
                  path="/pagos/matricula/editar/:id"
                  element={<EditarMatricula />}
                />

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

              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;