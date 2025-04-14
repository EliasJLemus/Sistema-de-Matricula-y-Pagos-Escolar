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
import useGetMensualidades, { MensualidadType } from "@/lib/queries/useGetMensualidades";
import { useGetMensualidadesAll } from "@/lib/queries";

const fontFamily = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface TablaMensualidadProps {
  onNewMensualidad: () => void;
  onEditMensualidad: (id: string) => void;
  onDeleteMensualidad: (id: string, nombre: string) => void;
}

export const TablaMensualidad: React.FC<TablaMensualidadProps> = ({
  onNewMensualidad,
  onEditMensualidad,
  onDeleteMensualidad,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    estudiante: "",
    grado: "",
    estado: "",
    fecha_vencimiento: ""
  });
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const debouncedFilters = useDebounce(filters, 400);

  const {data: getMensualidades, isLoading, isFetching, error} = useGetMensualidadesAll(
    page, limit, filters
  )

  useEffect(() => {
    const currentContainer = document.getElementById("tabla-mensualidades-container");
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

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getMensualidades", page, limit, JSON.stringify(filters)],
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "todos" ? "" : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ estudiante: "", grado: "", estado: "", fecha_vencimiento: "" });
    setPage(1);
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
    px: 3,
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
    px: 3,
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
    px: 3,
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

  const tableData = getMensualidades?.data ?? [];
  const total = getMensualidades?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const handleEdit = (id: string) => onEditMensualidad(id);
  const handleDelete = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar la mensualidad de ${nombre}?`)) {
      onDeleteMensualidad(id, nombre);
      handleFreshReload();
    }
  };

  return (
    <Box id="tabla-mensualidades-container" sx={{ position: "relative" }}>
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
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
        </svg>
        <Typography
          variant="h5"
          sx={{
            fontFamily,
            color: "#1A1363",
            fontWeight: 700,
          }}
        >
          Gestión de Mensualidades
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
            value={filters.estudiante}
            onChange={(e) => handleInputChange("estudiante", e.target.value)}
          />

          <FormControl
            sx={{
              minWidth: 150,
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
              {['Kinder', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 
                'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'].map((grado) => (
                <MenuItem key={grado} value={grado} sx={{ fontFamily }}>{grado}</MenuItem>
              ))}
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
              <MenuItem value="Pendiente" sx={{ fontFamily }}>
                Pendiente
              </MenuItem>
              <MenuItem value="Pagado" sx={{ fontFamily }}>
                Pagado
              </MenuItem>
              <MenuItem value="Parcial" sx={{ fontFamily }}>
                Parcial
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Fecha Vencimiento (DD/MM/YYYY)"
            variant="outlined"
            size="small"
            sx={{
              minWidth: 250,
              height: "40px",
              ...textFieldStyle,
            }}
            value={filters.fecha_vencimiento}
            onChange={(e) => handleInputChange("fecha_vencimiento", e.target.value)}
          />

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
              onClick={() => setIsZoomed(!isZoomed)}
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
              onClick={onNewMensualidad}
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
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              }
            >
              Nueva Mensualidad
            </Button>
          </Box>
        </Box>
      </Paper>

      <div className="border border-[#edad4c] rounded-lg overflow-hidden">
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
              <TableRow>
                {[
                  "ID", "N° Estudiante", "Estudiante", "Grado", "Sección", 
                  "Fecha Inicio", "Fecha Vencimiento", "Monto Total", "Beneficio", 
                  "Descuento", "Saldo Pagado", "Saldo Pendiente", "Recargo", "Estado", "Comprobante", "Acciones"
                ].map((h, i) => (
                  <TableHead key={i} className="text-white font-bold" style={{ fontFamily }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={item.codigo_mensualidad} className={`${index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"} hover:bg-[#e7f5e8] cursor-pointer transition-colors`}>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.codigo_mensualidad}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.codigo_estudiante}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.nombre_estudiante}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.grado}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.seccion}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>L. {item.monto_total}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.beneficio}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>{item.descuento}%</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>L. {item.saldo_pagado}</TableCell>
                  <TableCell className="text-[#4D4D4D] font-medium" style={{ fontFamily }}>
                    <strong>L. {item.saldo_pendiente}</strong>
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>L. {item.recargo || "0"}</TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    <Badge
                      variant="outline"
                      className={
                        item.estado === "Pagado" ? "bg-green-600 text-white" :
                        item.estado === "Parcial" ? "bg-orange-500 text-white" :
                        "bg-red-500 text-white"
                      }
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                    <Badge
                      variant="outline"
                      className={
                        item.estado_comprobante === "Enviado" ? "bg-green-600 text-white" : "bg-orange-500 text-white"
                      }
                    >
                      {item.estado_comprobante}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(item?.uuid_mensualidad || "")}
                        className="p-1 text-[#538A3E] hover:text-[#3e682e] transition-colors hover:scale-125"
                        title="Editar"
                        style={{
                          transition: "all 0.2s ease, transform 0.2s ease",
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(item?.uuid_mensualidad || "", item?.nombre_estudiante || "")}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors hover:scale-125"
                        title="Eliminar"
                        style={{
                          transition: "all 0.2s ease, transform 0.2s ease",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
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
            No se encontraron mensualidades para los filtros actuales.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TablaMensualidad;