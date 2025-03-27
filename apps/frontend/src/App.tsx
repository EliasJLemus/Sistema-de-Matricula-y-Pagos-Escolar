import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Topbar from "./pages/global/Topbar";
import DashboardPage from "../src/pages/dashboard/dashboard";
import Sidebar from "./pages/global/Sidebar";
import Home from "./pages/home/home";
import { Route, Routes } from "react-router-dom";

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
              marginLeft: isSidebarVisible ? "300px" : "70px", // Ajusta margen según el estado del sidebar
              transition: "margin-left 0.3s ease",
              padding: 0,
              position: "relative",
              width: `calc(100% - ${isSidebarVisible ? "300px" : "70px"})`, // Ancho dinámico
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
