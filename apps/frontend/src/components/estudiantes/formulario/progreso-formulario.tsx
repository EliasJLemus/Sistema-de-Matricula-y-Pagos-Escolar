"use client";

import type React from "react";
import { Box, Typography } from "@mui/material";

interface ProgresoFormularioProps {
  activeSection: string;
  hasErrorsInSection: (section: string) => boolean;
}

export const ProgresoFormulario: React.FC<ProgresoFormularioProps> = ({
  activeSection,
  hasErrorsInSection,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        pb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        mb: 2,
      }}
    >
      {/* Contenedor principal con distribución equitativa */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          width: "100%",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Primer paso - Datos Personales */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: hasErrorsInSection("personal")
                ? "#f44336"
                : activeSection === "personal"
                ? "#538A3E"
                : activeSection === "academico" || activeSection === "adicional"
                ? "#538A3E"
                : "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              mr: 1.5,
              zIndex: 2,
            }}
          >
            {hasErrorsInSection("personal") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            ) : (
              "1"
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: activeSection === "personal" ? 600 : 400,
              color: hasErrorsInSection("personal") ? "#f44336" : "#000",
            }}
          >
            Datos Personales
          </Typography>
        </Box>

        {/* Línea conectora entre Datos Personales e Información Académica */}
        <Box
          sx={{
            position: "absolute",
            height: "2px",
            bgcolor: "#ddd",
            left: "14%", // Comienza en el borde derecho del primer círculo
            width: "22%", // Llega hasta el borde izquierdo del segundo círculo
            top: "50%",
            zIndex: 1,
          }}
        />

        {/* Segundo paso - Información Académica (centrado) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: hasErrorsInSection("academico")
                ? "#f44336"
                : activeSection === "academico"
                ? "#538A3E"
                : activeSection === "adicional"
                ? "#538A3E"
                : "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              mr: 1.5,
              zIndex: 2,
            }}
          >
            {hasErrorsInSection("academico") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            ) : (
              "2"
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: activeSection === "academico" ? 600 : 400,
              color: hasErrorsInSection("academico") ? "#f44336" : "#000",
            }}
          >
            Información Académica
          </Typography>
        </Box>

        {/* Línea conectora entre Información Académica e Información Adicional */}
        <Box
          sx={{
            position: "absolute",
            height: "2px",
            bgcolor: "#ddd",
            left: "64%", // Comienza en el borde derecho del segundo círculo
            width: "22%", // Llega hasta el borde izquierdo del tercer círculo
            top: "50%",
            zIndex: 1,
          }}
        />

        {/* Tercer paso - Información Adicional (alineado a la derecha) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: hasErrorsInSection("adicional")
                ? "#f44336"
                : activeSection === "adicional"
                ? "#538A3E"
                : "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              mr: 1.5,
              zIndex: 2,
            }}
          >
            {hasErrorsInSection("adicional") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            ) : (
              "3"
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: activeSection === "adicional" ? 600 : 400,
              color: hasErrorsInSection("adicional") ? "#f44336" : "#000",
            }}
          >
            Información Adicional
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
