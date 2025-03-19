import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard/Index";
import DashboardPage from "../src/pages/dashboard/dashboard"
import Sidebar from "./pages/global/Sidebar";
import Home from "./pages/home/home"
import { Route, Routes } from "react-router-dom";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Estado para mostrar/ocultar sidebar

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          {/* Sidebar */}
          <Sidebar isSidebarVisible={isSidebarVisible} />

          {/* Contenido principal */}
          <Box
            flexGrow={1}
            ml={isSidebarVisible ? "300px" : "0px"}
            sx={{ transition: "margin 0.3s ease" }}
          >
            <Topbar onMenuClick={() => setIsSidebarVisible(!isSidebarVisible)} />
            <Routes>
              <Route path="/home" element={<Home/>}/>
              <Route path="/reportes" element={<DashboardPage />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
