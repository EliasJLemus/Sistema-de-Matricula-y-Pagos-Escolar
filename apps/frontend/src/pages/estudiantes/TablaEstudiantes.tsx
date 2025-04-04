"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
// import useGetEstudiantes from "@/lib/queries/useGetEstudiantes";
import {useGetEstudiantes} from "@/lib/queries"

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface TablaEstudiantesProps {
  onNewStudent: () => void;
  onEditStudent: (id: string) => void;
}

export const TablaEstudiantes: React.FC<TablaEstudiantesProps> = ({
  onNewStudent,
  onEditStudent,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    nombre: "",
    grado: "",
    estado: "",
  });

  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const debouncedFilters = useDebounce(filters, 400);

  // Efecto para aplicar el zoom solo al contenido de la tabla, no al sidebar
  useEffect(() => {
    // En lugar de aplicar zoom a todo el HTML, lo aplicamos solo al contenedor actual
    const currentContainer = document.getElementById(
      "tabla-estudiantes-container"
    );

    if (currentContainer) {
      if (isZoomed) {
        currentContainer.style.zoom = "60%"; // Reducido a 60% para mostrar más contenido
      } else {
        currentContainer.style.zoom = "100%";
      }
    }

    return () => {
      // Restaurar el zoom al desmontar el componente
      if (currentContainer) {
        currentContainer.style.zoom = "100%";
      }
    };
  }, [isZoomed]);

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getEstudiantes", page, limit, JSON.stringify(filters)],
    });
  };

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
  };

  const handleDelete = (id: number, nombre: string) => {
    if (
      window.confirm(`¿Está seguro que desea eliminar al estudiante ${nombre}?`)
    ) {
      console.log("Eliminar estudiante:", id);
      handleFreshReload();
    }
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  // Estilos comunes para TextField
  const textFieldStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiInputBase-root": {
      fontFamily,
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
      },
    },
    "& .MuiFormHelperText-root": {
      fontFamily,
    },
  };

  // Estilos comunes para FormControl
  const formControlStyle = {
    "& .MuiInputLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiFormLabel-root": {
      fontFamily,
      fontSize: "14px",
      color: "#1A1363",
    },
    "& .MuiSelect-select": {
      fontFamily,
      backgroundColor: "#f8f9fa",
    },
    "& .MuiRadio-root": {
      color: "#538A3E",
    },
    "& .Mui-checked": {
      color: "#538A3E",
    },
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#538A3E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A1363",
      },
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#e7f5e8",
    },
  };

  // Estilo para botón primario verde
  const primaryButtonStyle = {
    bgcolor: "#538A3E",
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    color: "white",
    px: 3, // Reduced from 4 to 3
    py: 1.2,
    height: "40px",
    fontWeight: 600,
    fontSize: "15px",
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
  };

  // Estilo para botón secundario naranja
  const secondaryButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    bgcolor: "#F38223",
    color: "white",
    px: 3, // Reduced from 4 to 3
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

  // Estilo para paginación
  const paginationButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    minWidth: "34px",
    height: "34px",
    fontWeight: 600,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    transition: "all 0.2s ease-in-out",
  };

  const zoomButtonStyle = {
    fontFamily,
    textTransform: "none",
    borderRadius: "10px",
    bgcolor: "#1A1363",
    color: "white",
    px: 3, // Reduced from 4 to 3
    py: 1.2,
    height: "40px",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0px 4px 10px rgba(26, 19, 99, 0.3)",
    "&:hover": {
      backgroundColor: "#13104d",
      transform: "translateY(-2px)",
      boxShadow: "0px 6px 12px rgba(26, 19, 99, 0.4)",
    },
    "&:active": {
      backgroundColor: "#0c0a33",
      transform: "translateY(1px)",
    },
    transition: "all 0.2s ease-in-out",
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
              <MenuItem value="todos" sx={{ fontFamily }}>
                Todos
              </MenuItem>
              <MenuItem value="Primero" sx={{ fontFamily }}>
                Primero
              </MenuItem>
              <MenuItem value="Segundo" sx={{ fontFamily }}>
                Segundo
              </MenuItem>
              <MenuItem value="Tercero" sx={{ fontFamily }}>
                Tercero
              </MenuItem>
              <MenuItem value="Cuarto" sx={{ fontFamily }}>
                Cuarto
              </MenuItem>
              <MenuItem value="Quinto" sx={{ fontFamily }}>
                Quinto
              </MenuItem>
              <MenuItem value="Sexto" sx={{ fontFamily }}>
                Sexto
              </MenuItem>
              <MenuItem value="Séptimo" sx={{ fontFamily }}>
                Séptimo
              </MenuItem>
              <MenuItem value="Octavo" sx={{ fontFamily }}>
                Octavo
              </MenuItem>
              <MenuItem value="Noveno" sx={{ fontFamily }}>
                Noveno
              </MenuItem>
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
              <MenuItem value="todos" sx={{ fontFamily }}>
                Todos
              </MenuItem>
              <MenuItem value="Activo" sx={{ fontFamily }}>
                Activo
              </MenuItem>
              <MenuItem value="Inactivo" sx={{ fontFamily }}>
                Inactivo
              </MenuItem>
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

          {/* Contenedor para alinear los botones a la derecha - modificado para mantener botones en línea */}
          <Box
            sx={{
              display: "flex",
              ml: "auto",
              gap: 2,
              flexWrap: "nowrap", // Esto evita que los botones se envuelvan
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
        </Box>
      </Paper>

      <div className="border border-[#edad4c] rounded-lg overflow-hidden">
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
              <TableRow>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Codigo
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Primer Nombre
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Segundo Nombre
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Primer Apellido
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Segundo Apellido
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Nacionalidad
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Identidad
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Género
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Fecha Nacimiento
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Edad
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Dirección
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Grado
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Sección
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Es Zurdo
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Dif. Educación
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Alergia
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Desc. Alergia
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Fecha Admisión
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Estado
                </TableHead>
                <TableHead
                  className="text-white font-bold"
                  style={{ fontFamily }}
                >
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow
                  key={item.uuid}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"
                  } hover:bg-[#e7f5e8] cursor-pointer transition-colors`}
                >
                  <TableCell
                    className="font-medium text-[#4D4D4D]"
                    style={{ fontFamily }}
                  >
                    {item.codigo_estudiante}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.primer_nombre}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.segundo_nombre}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.primer_apellido}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.segundo_apellido}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.nacionalidad}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.identidad}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {String(item.genero)}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.fecha_nacimiento}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.edad}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.direccion}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.grado}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.seccion}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.es_zurdo ? "Sí" : "No"}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.dif_educacion ? "Sí" : "No"}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.alergia ? "Sí" : "No"}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.desc_alergia || "N/A"}
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    {item.fecha_admision}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.estado === "Activo"
                          ? "bg-[#538A3E] text-white hover:bg-[#538A3E] hover:text-white w-16 justify-center" // Ancho más reducido
                          : "bg-[#F38223] text-white hover:bg-[#F38223] hover:text-white w-16 justify-center" // Ancho más reducido
                      }
                      style={{
                        fontFamily,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {console.log(item?.uuid )
                          handleEdit(item?.uuid as string)}}
                        className="p-1 text-[#538A3E] hover:text-[#3e682e] transition-colors hover:scale-125"
                        title="Editar"
                        style={{
                          transition: "all 0.2s ease, transform 0.2s ease",
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </button>
    
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          p: 2,
          bgcolor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily, display: "flex", alignItems: "center" }}
        >
          Mostrando {tableData.length} de {total} registros
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            sx={{
              ...paginationButtonStyle,
              bgcolor: "#F38223",
              color: "white",
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
                bgcolor: "rgba(243, 130, 35, 0.4)",
                color: "white",
              },
            }}
          >
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>
          {[...Array(Math.min(5, pageCount))].map((_, i) => {
            const pageNum = page <= 3 ? i + 1 : page - 2 + i;
            if (pageNum <= pageCount) {
              return (
                <Button
                  key={i}
                  variant={pageNum === page ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setPage(pageNum)}
                  sx={
                    pageNum === page
                      ? {
                          ...paginationButtonStyle,
                          bgcolor: "#538A3E",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#3e682e",
                            transform: "translateY(-2px)",
                            boxShadow: "0px 6px 12px rgba(83, 138, 62, 0.4)",
                          },
                        }
                      : {
                          ...paginationButtonStyle,
                          bgcolor: "#f8f9fa",
                          color: "#333",
                          border: "1px solid #ddd",
                          "&:hover": {
                            bgcolor: "#e7f5e8",
                            transform: "translateY(-2px)",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                          },
                        }
                  }
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page >= pageCount}
            sx={{
              ...paginationButtonStyle,
              bgcolor: "#F38223",
              color: "white",
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
                bgcolor: "rgba(243, 130, 35, 0.4)",
                color: "white",
              },
            }}
          >
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
        </Box>
      </Box>

      {!isLoading && !isFetching && tableData.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Typography color="text.secondary" sx={{ fontFamily }}>
            No se encontraron estudiantes para los filtros actuales.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TablaEstudiantes;
