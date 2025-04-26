"use client";

import type React from "react";
import { Box, Button, CircularProgress } from "@mui/material";

interface NavegacionFormularioProps {
  activeSection: string;
  setOpenCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextSection: (e: React.MouseEvent) => void;
  isSubmitting: boolean;
  isEditing: boolean; // Este es el prop que está faltando
}

export const NavegacionFormulario: React.FC<NavegacionFormularioProps> = ({
  activeSection,
  setOpenCancelDialog,
  handleNextSection,
  isSubmitting,
  isEditing,
}) => {
  // Estilo para botón secundario naranja (para Cancelar/Anterior)
  const secondaryButtonStyle = {
    fontFamily: "'Nunito', sans-serif",
    textTransform: "none",
    borderRadius: "10px",
    bgcolor: "#F38223",
    color: "white",
    px: 4,
    py: 1.2,
    height: "40px",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0px 4px 10px rgba(243, 130, 35, 0.3)",
    "&:hover": {
      backgroundColor: "#e67615",
      transform: "translateY(-2px)",
      boxShadow: "0px 6px 12px rgba(243, 130, 35, 0.4)",
    },
    "&:active": {
      backgroundColor: "#d56a10",
      transform: "translateY(1px)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(243, 130, 35, 0.7)",
      color: "white",
    },
    transition: "all 0.2s ease-in-out",
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 3,
        p: 3,
        borderTop: "1px solid rgba(0,0,0,0.05)",
        bgcolor: "#f8f9fa",
        position: "sticky",
        bottom: 0,
        zIndex: 10,
      }}
    >
      {/* Botón Cancelar/Anterior */}
      <Button
        variant="contained"
        onClick={() => setOpenCancelDialog(true)}
        sx={secondaryButtonStyle}
        startIcon={
          activeSection === "personal" ? (
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          )
        }
      >
        {activeSection === "personal" ? "Cancelar" : "Anterior"}
      </Button>

      {/* Botón Siguiente/Guardar */}
      <Button
        variant="contained"
        onClick={handleNextSection}
        disabled={isSubmitting}
        type="button"
        sx={{
          bgcolor: "#538A3E",
          fontFamily: "'Nunito', sans-serif",
          textTransform: "none",
          borderRadius: "12px",
          px: 4,
          py: 1.2,
          minWidth: "140px",
          fontWeight: 600,
          fontSize: "15px",
          color: "white",
          boxShadow: "0px 4px 10px rgba(83, 138, 62, 0.3)",
          "&:hover": {
            backgroundColor: "#3e682e",
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 12px rgba(83, 138, 62, 0.4)",
          },
          "&:active": {
            backgroundColor: "#2e5022",
            transform: "translateY(1px)",
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(83, 138, 62, 0.7)",
            color: "white",
          },
          transition: "all 0.2s ease-in-out",
        }}
        startIcon={
          isSubmitting ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : activeSection !== "adicional" ? (
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          ) : (
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          )
        }
      >
        {isSubmitting
          ? isEditing
            ? "Actualizando..."
            : "Guardando..."
          : activeSection !== "adicional"
          ? "Siguiente"
          : isEditing
          ? "Actualizar"
          : "Guardar"}
      </Button>
    </Box>
  );
};
