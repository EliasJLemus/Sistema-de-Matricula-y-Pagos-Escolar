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
import useGetBecas, { BecaType } from "@/lib/queries/useGetBecas";

const fontFamily = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface TablaBecasProps {
  onNewBeca: () => void;
  onEditBeca: (id: string) => void;
}

export const TablaBecas: React.FC<TablaBecasProps> = ({
  onNewBeca,
  onEditBeca,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    nombre: "",
    estado: "" as 'ACTIVO' | 'INACTIVO' | '',
    descuento: "",
  });

  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    const currentContainer = document.getElementById("tabla-becas-container");
    if (currentContainer) {
      currentContainer.style.zoom = isZoomed ? "60%" : "100%";
    }
    return () => {
      if (currentContainer) currentContainer.style.zoom = "100%";
    };
  }, [isZoomed]);

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getBecas", page, limit, filters],
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ nombre: "", estado: "", descuento: "" });
    setPage(1);
  };

  const { data, isLoading, isFetching, error } = useGetBecas(
    page,
    limit,
    {
      nombre: debouncedFilters.nombre,
      estado: debouncedFilters.estado as 'ACTIVO' | 'INACTIVO',
      descuento: debouncedFilters.descuento ? Number(debouncedFilters.descuento) : undefined
    }
  );

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const handleEdit = (id: string) => onEditBeca(id);
  const handleDelete = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar la beca ${nombre}?`)) {
      console.log("Eliminar beca:", id);
      handleFreshReload();
    }
  };

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
  
  return (
  <Box id="tabla-becas-container" sx={{ position: "relative" }}>
      {/* Loading y errores (mantener misma estructura) */}
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

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 1 }}>
        <svg
          // Icono modificado para becas
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
        <Typography variant="h5" sx={{ fontFamily, color: "#1A1363", fontWeight: 700 }}>
          Listado de Becas
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Nombre de la beca"
            variant="outlined"
            size="small"
            sx={{ minWidth: 250, height: "40px", ...textFieldStyle }}
            value={filters.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
          />
          <FormControl sx={{ minWidth: 150, height: "40px", ...formControlStyle }} size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado || "todos"}
              label="Estado"
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <MenuItem value="todos" sx={{ fontFamily }}>Todos</MenuItem>
              <MenuItem value="ACTIVO" sx={{ fontFamily }}>Activo</MenuItem>
              <MenuItem value="INACTIVO" sx={{ fontFamily }}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Descuento (%)"
            variant="outlined"
            size="small"
            type="number"
            sx={{ minWidth: 150, height: "40px", ...textFieldStyle }}
            value={filters.descuento}
            onChange={(e) => handleInputChange("descuento", e.target.value)}
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
                        onClick={onNewBeca}
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
                        Nueva Beca
                      </Button>
                    </Box>
                  </Box>
                </Paper>
                <div className="border border-[#edad4c] rounded-lg overflow-hidden">
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-white font-bold" style={{ fontFamily }}>Nombre</TableHead>
                <TableHead className="text-white font-bold" style={{ fontFamily }}>Descuento</TableHead>
                <TableHead className="text-white font-bold" style={{ fontFamily }}>Estado</TableHead>
                <TableHead className="text-white font-bold" style={{ fontFamily }}>Autorizado por</TableHead>
                <TableHead className="text-white font-bold" style={{ fontFamily }}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow
                  key={item.uuid}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"} hover:bg-[#e7f5e8]`}
                >
                  <TableCell style={{ fontFamily }}>{item.nombre_beca}</TableCell>
                  <TableCell style={{ fontFamily }}>{item.descuento}%</TableCell>
                  <TableCell style={{ fontFamily }}>
                  <Badge
                      variant="outline"
                      className={
                        item.estado === "ACTIVO" ? "bg-[#538A3E] text-white" :
                        item.estado === "INACTIVO" ? "bg-orange-500 text-white" :
                        "bg-red-500 text-white"
                      }
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ fontFamily }}>{item.uuid_autorizado_por}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(item.uuid)}
                        className="p-1 text-[#538A3E] hover:text-[#3e682e]"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.uuid, item.nombre_beca)}
                        className="p-1 text-red-500 hover:text-red-700"
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
                  No se encontraron apoderados para los filtros actuales.
                </Typography>
              </Paper>
            )}
          </Box>
           );
        };
        export default TablaBecas;
