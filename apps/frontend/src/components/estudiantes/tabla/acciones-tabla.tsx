"use client";

import type React from "react";
import { Box, Button } from "@mui/material";
import { primaryButtonStyle, zoomButtonStyle } from "@/styles/common-styles";

interface AccionesTablaProps {
  isZoomed: boolean;
  toggleZoom: () => void;
  onNewStudent: () => void;
}

export const AccionesTabla: React.FC<AccionesTablaProps> = ({
  isZoomed,
  toggleZoom,
  onNewStudent,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        ml: "auto",
        gap: 2,
        flexWrap: "nowrap",
      }}
    >
      <Button
        variant="contained"
        onClick={toggleZoom}
        sx={zoomButtonStyle}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isZoomed ? (
              <>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
              </>
            ) : (
              <>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </>
            )}
          </svg>
        }
      >
        {isZoomed ? "Vista Normal" : "Ver Tabla Completa"}
      </Button>

      <Button
        variant="contained"
        onClick={onNewStudent}
        sx={primaryButtonStyle}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        }
      >
        Nuevo Estudiante
      </Button>
    </Box>
  );
};
