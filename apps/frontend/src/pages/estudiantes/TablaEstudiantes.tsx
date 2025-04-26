"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetEstudiantes } from "@/lib/queries";
import { fontFamily } from "@/styles/common-styles";
import { FiltrosEstudiantes } from "@/components/estudiantes/tabla/filtros-estudiantes";
import { AccionesTabla } from "@/components/estudiantes/tabla/acciones-tabla";
import { TablaContenido } from "@/components/estudiantes/tabla/tabla-contenido";
import { PaginacionTabla } from "@/components/estudiantes/tabla/paginacion-tabla";

interface TablaEstudiantesProps {
  onNewStudent: () => void;
  onEditStudent: (id: string) => void;
}

export const TablaEstudiantes: React.FC<TablaEstudiantesProps> = ({
  onNewStudent,
  onEditStudent,
}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 15;

  const [filters, setFilters] = useState({
    nombre: "",
    grado: "",
    estado: "",
  });

  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const debouncedFilters = useDebounce(filters, 400);

  // Fuerza una actualización cuando el componente se monta
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["getEstudiantes"],
      exact: false,
    });
  }, [queryClient]);

  // Actualiza cuando cambian los filtros
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "getEstudiantes",
        page,
        limit,
        JSON.stringify(debouncedFilters),
      ],
    });
  }, [queryClient, page, limit, debouncedFilters]);

  useEffect(() => {
    const currentContainer = document.getElementById(
      "tabla-estudiantes-container"
    );

    if (currentContainer) {
      if (isZoomed) {
        currentContainer.style.zoom = "60%";
      } else {
        currentContainer.style.zoom = "100%";
      }
    }

    return () => {
      if (currentContainer) {
        currentContainer.style.zoom = "100%";
      }
    };
  }, [isZoomed]);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ nombre: "", grado: "", estado: "" });
    setPage(1);
  };

  // Función para forzar una actualización manual
  const forceRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["getEstudiantes"],
      exact: false,
    });
  };

  const { data, isLoading, isFetching, error } = useGetEstudiantes(
    page,
    limit,
    debouncedFilters
  );

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const handleEdit = (id: string) => {
    onEditStudent(id);
    // Fuerza una actualización después de editar
    setTimeout(() => {
      forceRefresh();
    }, 500);
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <Box id="tabla-estudiantes-container" sx={{ position: "relative" }}>
      {(isLoading || isFetching) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircularProgress size={20} sx={{ color: "#538A3E" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily }}
          >
            {isLoading ? "Cargando..." : "Actualizando..."}
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ p: 2, color: "error.main", mb: 2 }}>
          <Typography sx={{ fontFamily }}>
            Error: {(error as Error).message}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          pl: 1,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1363"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "10px" }}
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <Typography
          variant="h5"
          sx={{
            fontFamily,
            color: "#1A1363",
            fontWeight: 700,
          }}
        >
          Lista de Estudiantes
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "12px",
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <FiltrosEstudiantes
            filters={filters}
            handleInputChange={handleInputChange}
            clearFilters={clearFilters}
          />

          <Box sx={{ display: "flex", ml: "auto", gap: 2, flexWrap: "nowrap" }}>
            <AccionesTabla
              isZoomed={isZoomed}
              toggleZoom={toggleZoom}
              onNewStudent={onNewStudent}
            />
          </Box>
        </Box>
      </Paper>

      <TablaContenido tableData={tableData} handleEdit={handleEdit} />

      <PaginacionTabla
        page={page}
        pageCount={pageCount}
        total={total}
        tableData={tableData}
        setPage={setPage}
      />
    </Box>
  );
};

export default TablaEstudiantes;
