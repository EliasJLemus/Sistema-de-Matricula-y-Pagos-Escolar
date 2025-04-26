"use client"

import type React from "react"
import { Box, Button } from "@mui/material"

interface NavegacionSeccionesProps {
  activeSection: string
  handleSectionChange: (section: string) => void
  hasErrorsInSection: (section: string) => boolean
}

export const NavegacionSecciones: React.FC<NavegacionSeccionesProps> = ({
  activeSection,
  handleSectionChange,
  hasErrorsInSection,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        bgcolor: "#f8f9fa",
        px: 2,
        mt: 0,
      }}
    >
      {["personal", "academico", "adicional"].map((section) => (
        <Button
          key={section}
          onClick={() => handleSectionChange(section)}
          sx={{
            fontFamily: "'Nunito', sans-serif",
            textTransform: "none",
            py: 2,
            px: 3,
            color: activeSection === section ? "#1A1363" : "#666",
            fontWeight: activeSection === section ? 600 : 400,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgcolor: activeSection === section ? "#538A3E" : "transparent",
              borderRadius: "3px 3px 0 0",
              transition: "all 0.2s ease",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: "#1A1363",
              "&::after": {
                bgcolor: activeSection === section ? "#538A3E" : "rgba(83, 138, 62, 0.3)",
              },
            },
          }}
        >
          {section === "personal" && (
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
              style={{ marginRight: "8px" }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
          {section === "academico" && (
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
              style={{ marginRight: "8px" }}
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          )}
          {section === "adicional" && (
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
              style={{ marginRight: "8px" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          )}
          {section === "personal" && "Datos Personales"}
          {section === "academico" && "Información Académica"}
          {section === "adicional" && "Información Adicional"}

          {/* Indicador de error */}
          {hasErrorsInSection(section) && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#f44336",
                ml: 1,
              }}
            />
          )}
        </Button>
      ))}
    </Box>
  )
}
