"use client";
import type React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import MenuOutlined from "@mui/icons-material/MenuOutlined";

interface TopbarProps {
  onMenuClick: () => void;
}

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <Box
      sx={{
        height: "70px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 900,
        boxShadow:
          "0 6px 25px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.08)",
        borderBottom: "none",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
        margin: 0,
        width: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <IconButton
        onClick={onMenuClick}
        sx={{
          color: "#1A1363",
          marginRight: 2,
          "&:hover": {
            backgroundColor: "rgba(26, 19, 99, 0.08)",
          },
        }}
      >
        <MenuOutlined />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          component="img"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Sunny%20Path-baCvL17UVIOWy2lkb1I5T8lqOm7wDX.png"
          alt="Sunny Path Logo"
          sx={{
            height: "40px",
            width: "40px",
            display: { xs: "none", sm: "block" },
            objectFit: "contain",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1A1363",
            textAlign: "center",
            letterSpacing: "-0.2px",
            fontFamily: fontFamily,
          }}
        >
          Sunny Path Bilingual School
        </Typography>
      </Box>

      <Box width="40px" />
    </Box>
  );
};

export default Topbar;
