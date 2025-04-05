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
import useGetApoderados, { ApoderadoType } from "@/lib/queries/useGetApoderados";

const fontFamily = "'Nunito', sans-serif";

interface TablaApoderadosProps {
  onNewApoderado: () => void;
  onEditApoderado: (id: number) => void;
}

export const TablaApoderados: React.FC<TablaApoderadosProps> = ({
  onNewApoderado,
  onEditApoderado,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({ nombre: "", estudiante: "", parentesco: "" });
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    const currentContainer = document.getElementById("tabla-apoderados-container");
    if (currentContainer) currentContainer.style.zoom = isZoomed ? "60%" : "100%";
    return () => { if (currentContainer) currentContainer.style.zoom = "100%"; };
  }, [isZoomed]);

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getApoderados", page, limit, JSON.stringify(filters)],
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "todos" ? "" : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ nombre: "", estudiante: "", parentesco: "" });
    setPage(1);
  };

  const { data, isLoading, isFetching, error } = useGetApoderados(page, limit, debouncedFilters);

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const getNombreCompleto = (a: ApoderadoType) => `${a.primer_nombre ?? ''} ${a.segundo_nombre ?? ''} ${a.primer_apellido ?? ''} ${a.segundo_apellido ?? ''}`.trim();
  const getNombreEstudiante = (a: ApoderadoType) => `${a.estudiante_primer_nombre ?? ''} ${a.estudiante_primer_apellido ?? ''}`.trim();

  const handleEdit = (id: number) => onEditApoderado(id);
  const handleDelete = (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar al apoderado ${nombre}?`)) {
      console.log("Eliminar apoderado:", id);
      handleFreshReload();
    }
  };

  return (
    <Box id="tabla-apoderados-container" sx={{ position: "relative" }}>
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
          Lista de Apoderados
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField label="Nombre del apoderado" variant="outlined" size="small" sx={{ minWidth: 250 }} value={filters.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} />
          <TextField label="Nombre del estudiante" variant="outlined" size="small" sx={{ minWidth: 250 }} value={filters.estudiante} onChange={(e) => handleInputChange("estudiante", e.target.value)} />

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="parentesco-label">Parentesco</InputLabel>
            <Select labelId="parentesco-label" value={filters.parentesco || "todos"} label="Parentesco" onChange={(e) => handleInputChange("parentesco", e.target.value)}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="Padre">Padre</MenuItem>
              <MenuItem value="Madre">Madre</MenuItem>
              <MenuItem value="Tutor">Tutor</MenuItem>
              <MenuItem value="Tío">Tío</MenuItem>
              <MenuItem value="Abuelo">Abuelo</MenuItem>
              <MenuItem value="Hermano">Hermano</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={clearFilters} sx={{ bgcolor: "#F38223", color: "white" }}>Quitar filtros</Button>
          <Button variant="contained" onClick={() => setIsZoomed(!isZoomed)} sx={{ bgcolor: "#1A1363", color: "white" }}>{isZoomed ? "Vista Normal" : "Ver Tabla Completa"}</Button>
          <Button variant="contained" onClick={onNewApoderado} sx={{ bgcolor: "#538A3E", color: "white" }}>Nuevo Apoderado</Button>
        </Box>
      </Paper>

      <div className="border border-[#edad4c] rounded-lg overflow-hidden">
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
              <TableRow>
                {[
                  "ID", "Código Apoderado", "Nombre Completo", "Identidad", "Género", "Teléfono", "Correo", "Parentesco", "Principal", "Código Estudiante", "Estudiante", "Grado", "Acciones"
                ].map((h, i) => (
                  <TableHead key={i} className="text-white font-bold" style={{ fontFamily }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={item.encargado_id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"} hover:bg-[#e7f5e8] cursor-pointer`}>
                  <TableCell>{item.encargado_id}</TableCell>
                  <TableCell>{item.numero_encargado}</TableCell>
                  <TableCell>{getNombreCompleto(item)}</TableCell>
                  <TableCell>{item.identidad}</TableCell>
                  <TableCell>{item.genero}</TableCell>
                  <TableCell>{item.telefono_personal}</TableCell>
                  <TableCell>{item.correo_electronico}</TableCell>
                  <TableCell>{item.parentesco}</TableCell>
                  <TableCell>{item.es_encargado_principal ? "Sí" : "No"}</TableCell>
                  <TableCell>{item.numero_estudiante}</TableCell>
                  <TableCell>{getNombreEstudiante(item)}</TableCell>
                  <TableCell>{item.grado_estudiante}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleEdit(item.encargado_id)} className="text-[#538A3E] hover:text-[#3e682e]">
                        <EditIcon fontSize="small" />
                      </button>
                      <button onClick={() => handleDelete(item.encargado_id, getNombreCompleto(item))} className="text-red-500 hover:text-red-700">
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
          <Button variant="contained" size="small" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page <= 1}>Anterior</Button>
          {[...Array(Math.min(5, pageCount))].map((_, i) => {
            const pageNum = page <= 3 ? i + 1 : page - 2 + i;
            return pageNum <= pageCount ? (
              <Button key={i} variant={pageNum === page ? "contained" : "outlined"} onClick={() => setPage(pageNum)}>{pageNum}</Button>
            ) : null;
          })}
          <Button variant="contained" size="small" onClick={() => setPage((p) => Math.min(p + 1, pageCount))} disabled={page >= pageCount}>Siguiente</Button>
        </Box>
      </Box>

      {!isLoading && !isFetching && tableData.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
          <Typography color="text.secondary" sx={{ fontFamily }}>
            No se encontraron apoderados para los filtros actuales.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TablaApoderados;