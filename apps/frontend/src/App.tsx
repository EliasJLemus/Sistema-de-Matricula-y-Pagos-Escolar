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
              marginLeft: isSidebarVisible ? "300px" : "70px",
              transition: "margin-left 0.3s ease",
              padding: 0,
              position: "relative",
              width: `calc(100% - ${isSidebarVisible ? "300px" : "70px"})`,
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

                {/* Add other routes as needed */}
              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
