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

const fontFamily = "'Nunito', sans-serif";

interface TablaMensualidadProps {
  onNewMensualidad: () => void;
  onEditMensualidad: (id: number) => void;
}

export const TablaMensualidad: React.FC<TablaMensualidadProps> = ({
  onNewMensualidad,
  onEditMensualidad,
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

  useEffect(() => {
    const currentContainer = document.getElementById("tabla-mensualidades-container");
    if (currentContainer) currentContainer.style.zoom = isZoomed ? "60%" : "100%";
    return () => { if (currentContainer) currentContainer.style.zoom = "100%"; };
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

  const { data, isLoading, isFetching, error } = useGetMensualidades(page, limit, debouncedFilters);

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const handleEdit = (id: number) => onEditMensualidad(id);
  const handleDelete = (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar la mensualidad de ${nombre}?`)) {
      console.log("Eliminar mensualidad:", id);
      handleFreshReload();
    }
  };

  return (
    <Box id="tabla-mensualidades-container" sx={{ position: "relative" }}>
      {(isLoading || isFetching) && (
        <Box sx={{ position: "absolute", top: 0, right: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} sx={{ color: "#538A3E" }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily }}>
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

      <Box sx={{ display: "flex", alignItems: "center", mb: 3, pl: 1 }}>
        <Typography variant="h5" sx={{ fontFamily, color: "#1A1363", fontWeight: 700 }}>
          Gestión de Mensualidades
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="Nombre del estudiante"
            variant="outlined"
            size="small"
            sx={{ minWidth: 250 }}
            value={filters.estudiante}
            onChange={(e) => handleInputChange("estudiante", e.target.value)}
          />

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Grado</InputLabel>
            <Select
              value={filters.grado}
              label="Grado"
              onChange={(e) => handleInputChange("grado", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {['Kinder', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 
                'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'].map((grado) => (
                <MenuItem key={grado} value={grado}>{grado}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              label="Estado"
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Pagado">Pagado</MenuItem>
              <MenuItem value="Parcial">Parcial</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Fecha Vencimiento (DD/MM/YYYY)"
            variant="outlined"
            size="small"
            sx={{ minWidth: 250 }}
            value={filters.fecha_vencimiento}
            onChange={(e) => handleInputChange("fecha_vencimiento", e.target.value)}
          />

          <Button variant="contained" onClick={clearFilters} sx={{ bgcolor: "#F38223", color: "white" }}>
            ✖️ Quitar filtros
          </Button>
          
          <Button variant="contained" onClick={() => setIsZoomed(!isZoomed)} sx={{ bgcolor: "#1A1363", color: "white" }}>
            {isZoomed ? "Vista Normal" : "🔍 Ver Tabla Completa"}
          </Button>
          
          <Button variant="contained" onClick={onNewMensualidad} sx={{ bgcolor: "#538A3E", color: "white" }}>
            📝 Nueva Mensualidad
          </Button>
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
                  "Descuento", "Saldo Pagado", "Saldo Pendiente", "Recargo", "Estado", "Acciones"
                ].map((h, i) => (
                  <TableHead key={i} className="text-white font-bold" style={{ fontFamily }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={item.mensualidad_id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"} hover:bg-[#e7f5e8] cursor-pointer`}>
                  <TableCell>{item.mensualidad_id}</TableCell>
                  <TableCell>{item.numero_estudiante}</TableCell>
                  <TableCell>{item.estudiante}</TableCell>
                  <TableCell>{item.grado}</TableCell>
                  <TableCell>{item.seccion}</TableCell>
                  <TableCell>{item.fecha_inicio}</TableCell>
                  <TableCell>{item.fecha_vencimiento}</TableCell>
                  <TableCell>L. {item.monto_total.toLocaleString()}</TableCell>
                  <TableCell>{item.beneficio_aplicado}</TableCell>
                  <TableCell>{item.porcentaje_descuento}%</TableCell>
                  <TableCell>L. {item.saldo_pagado.toLocaleString()}</TableCell>
                  <TableCell>
                    <strong>L. {item.saldo_pendiente.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell>L. {item.recargo.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.estado === "Pagado" ? "bg-[#538A3E] text-white" :
                        item.estado === "Parcial" ? "bg-[#F38223] text-white" :
                        "bg-red-500 text-white"
                      }
                      style={{ fontFamily, padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleEdit(item.mensualidad_id)} 
                        className="text-[#538A3E] hover:text-[#3e682e]"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.mensualidad_id, item.estudiante)} 
                        className="text-red-500 hover:text-red-700"
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, p: 2, bgcolor: "white", borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
        <Typography variant="body2" sx={{ fontFamily }}>Mostrando {tableData.length} de {total} registros</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => setPage((p) => Math.max(p - 1, 1))} 
            disabled={page <= 1}
            sx={{ bgcolor: "#F38223", "&:disabled": { bgcolor: "#F3822370" } }}
          >
            Anterior
          </Button>
          {[...Array(Math.min(5, pageCount))].map((_, i) => {
            const pageNum = page <= 3 ? i + 1 : page - 2 + i;
            return pageNum <= pageCount ? (
              <Button 
                key={i}
                variant={pageNum === page ? "contained" : "outlined"}
                onClick={() => setPage(pageNum)}
                sx={{ 
                  bgcolor: pageNum === page ? "#538A3E" : "inherit",
                  color: pageNum === page ? "white" : "inherit",
                  "&:hover": { bgcolor: pageNum === page ? "#3e682e" : "#f5f5f5" }
                }}
              >
                {pageNum}
              </Button>
            ) : null;
          })}
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))} 
            disabled={page >= pageCount}
            sx={{ bgcolor: "#F38223", "&:disabled": { bgcolor: "#F3822370" } }}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      {!isLoading && !isFetching && tableData.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
          <Typography color="text.secondary" sx={{ fontFamily }}>
            No se encontraron mensualidades para los filtros actuales.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TablaMensualidad;