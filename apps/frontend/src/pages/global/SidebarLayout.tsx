import React, { ReactNode, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar"; // Importa tu componente Sidebar existente

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily: fontFamily }}>
      {/* Sidebar component */}
      <Sidebar isSidebarVisible={isSidebarVisible} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isSidebarVisible ? "300px" : "70px",
          transition: "margin 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Contenido principal */}
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
