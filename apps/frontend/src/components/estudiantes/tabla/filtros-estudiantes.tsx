"use client";

import type React from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  textFieldStyle,
  formControlStyle,
  secondaryButtonStyle,
} from "@/styles/common-styles";

interface FiltrosEstudiantesProps {
  filters: {
    nombre: string;
    grado: string;
    estado: string;
  };
  handleInputChange: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const FiltrosEstudiantes: React.FC<FiltrosEstudiantesProps> = ({
  filters,
  handleInputChange,
  clearFilters,
}) => {
  return (
    <>
      <TextField
        label="Nombre del estudiante"
        variant="outlined"
        size="small"
        sx={{
          minWidth: 250,
          height: "40px",
          ...textFieldStyle,
        }}
        value={filters.nombre}
        onChange={(e) => handleInputChange("nombre", e.target.value)}
      />

      <FormControl
        sx={{
          minWidth: 120,
          height: "40px",
          ...formControlStyle,
        }}
        size="small"
      >
        <InputLabel id="grado-label">Grado</InputLabel>
        <Select
          labelId="grado-label"
          value={filters.grado || "todos"}
          label="Grado"
          onChange={(e) => handleInputChange("grado", e.target.value)}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "#e7f5e8",
                },
              },
            },
          }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="Primero">Primero</MenuItem>
          <MenuItem value="Segundo">Segundo</MenuItem>
          <MenuItem value="Tercero">Tercero</MenuItem>
          <MenuItem value="Cuarto">Cuarto</MenuItem>
          <MenuItem value="Quinto">Quinto</MenuItem>
          <MenuItem value="Sexto">Sexto</MenuItem>
          <MenuItem value="Séptimo">Séptimo</MenuItem>
          <MenuItem value="Octavo">Octavo</MenuItem>
          <MenuItem value="Noveno">Noveno</MenuItem>
          <MenuItem value="Décimo">Décimo</MenuItem>
          <MenuItem value="Undécimo">Undécimo</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        sx={{
          minWidth: 150,
          height: "40px",
          ...formControlStyle,
        }}
        size="small"
      >
        <InputLabel id="estado-label">Estado</InputLabel>
        <Select
          labelId="estado-label"
          value={filters.estado || "todos"}
          label="Estado"
          onChange={(e) => handleInputChange("estado", e.target.value)}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "#e7f5e8",
                },
              },
            },
          }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="Activo">Activo</MenuItem>
          <MenuItem value="Inactivo">Inactivo</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={clearFilters}
        sx={secondaryButtonStyle}
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        }
      >
        Quitar filtros
      </Button>
    </>
  );
};
