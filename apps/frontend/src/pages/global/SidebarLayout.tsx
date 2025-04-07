import React, { ReactNode, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily }}>
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isSidebarVisible ? "240px" : "70px",
          transition: "margin 0.3s ease",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default SidebarLayout;
