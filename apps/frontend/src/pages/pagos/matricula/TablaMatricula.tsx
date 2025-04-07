"use client";

import { useState } from "react";
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
import { useGetMatriculaPagos } from "@/lib/queries";

const fontFamily = "'Nunito', sans-serif";

interface TablaMatriculaProps {
  onNewMatricula: () => void;
  onEditMatricula: (id: string) => void;
}

const getVisiblePages = (current: number, total: number) => {
  const visible = 5;
  let start = Math.max(current - Math.floor(visible / 2), 1);
  let end = start + visible - 1;

  if (end > total) {
    end = total;
    start = Math.max(end - visible + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const TablaMatricula: React.FC<TablaMatriculaProps> = ({
  onNewMatricula,
  onEditMatricula,
}) => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  console.log(page)
  const [filters, setFilters] = useState({
    nombreEstudiante: "",
    grado: "",
    estado: "",
  });

  const debouncedFilters = useDebounce(filters, 400);

  const { data, isLoading, isFetching } = useGetMatriculaPagos(
    page,
    limit,
      );

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil((data?.pagination?.total ?? 1) / limit);

  const handleEdit = (id: string) => onEditMatricula(id);
  const handleDelete = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar la matrícula de ${nombre}?`)) {
      console.log("Eliminar matrícula:", id);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "todos" ? "" : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ nombreEstudiante: "", grado: "", estado: "" });
    setPage(1);
  };

  return (
    <Box id="tabla-matriculas-container" sx={{ position: "relative" }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily }}>
            {isLoading ? "Cargando..." : "Actualizando..."}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", mb: 3, pl: 1 }}>
        <Typography variant="h5" sx={{ fontFamily, color: "#1A1363", fontWeight: 700 }}>
          Lista de Matrículas
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", boxShadow: "0 8px 15px rgba(0,0,0,0.15)" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="Nombre del estudiante"
            variant="outlined"
            size="small"
            sx={{ minWidth: 250 }}
            value={filters.nombreEstudiante}
            onChange={(e) => handleInputChange("nombreEstudiante", e.target.value)}
          />

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Grado</InputLabel>
            <Select
              value={filters.grado}
              label="Grado"
              onChange={(e) => handleInputChange("grado", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {[
                "Kinder", "Primero", "Segundo", "Tercero", "Cuarto",
                "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo"
              ].map((grado) => (
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
            </Select>
          </FormControl>

          <Button variant="contained" onClick={clearFilters} sx={{ bgcolor: "#F38223", color: "white" }}>
            ✖️ Quitar filtros
          </Button>

          <Button variant="contained" onClick={onNewMatricula} sx={{ bgcolor: "#538A3E", color: "white" }}>
            📝 Nueva Matrícula
          </Button>
        </Box>
      </Paper>

      <div className="border border-[#edad4c] rounded-lg overflow-hidden">
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
              <TableRow>
                {[
                  "Código", "Estudiante", "Grado", "Sección", "Tarifa",
                  "Beneficio", "Descuento", "Total", "Estado", "Comprobante",
                  "Fecha", "Acciones"
                ].map((h, i) => (
                  <TableHead key={i} className="text-white font-bold" style={{ fontFamily }}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow
                  key={`${item.uuid_matricula}-${index}`}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"} hover:bg-[#e7f5e8]`}
                >
                  <TableCell>{item.codigo_estudiante}</TableCell>
                  <TableCell>{item.nombre_estudiante}</TableCell>
                  <TableCell>{item.grado}</TableCell>
                  <TableCell>{item.seccion}</TableCell>
                  <TableCell>L. {parseFloat(item.tarifa_base.toString()).toFixed(2)}</TableCell>
                  <TableCell>{item.beneficio_aplicado}</TableCell>
                  <TableCell>{item.descuento_aplicado}</TableCell>
                  <TableCell><strong>L. {parseFloat(item.total_pagar.toString()).toFixed(2)}</strong></TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={item.estado === "Pagado" ? "bg-[#538A3E] text-white" : "bg-[#F38223] text-white"}
                      style={{ fontFamily, padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}
                    >
                      {item.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={item.comprobante === "Aceptado" ? "bg-[#538A3E] text-white" : "bg-[#F38223] text-white"}
                      style={{ fontFamily, padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}
                    >
                      {item.comprobante}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.fecha_matricula}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleEdit(item.uuid_matricula)} className="text-[#538A3E] hover:text-[#3e682e]">
                        <EditIcon fontSize="small" />
                      </button>
                      <button onClick={() => handleDelete(item.uuid_matricula, item.nombre_estudiante)} className="text-red-500 hover:text-red-700">
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
        <Typography variant="body2" sx={{ fontFamily }}>
          Mostrando {tableData.length} de {total} registros
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            sx={{ bgcolor: "#F38223" }}
          >
            Anterior
          </Button>

          {getVisiblePages(page, pageCount).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "contained" : "outlined"}
              onClick={() => setPage(pageNum)}
              sx={{
                bgcolor: pageNum === page ? "#538A3E" : "inherit",
                color: pageNum === page ? "white" : "inherit",
                "&:hover": { bgcolor: pageNum === page ? "#3e682e" : "#f5f5f5" },
              }}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page >= pageCount}
            sx={{ bgcolor: "#F38223" }}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      {!isLoading && !isFetching && tableData.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px", boxShadow: "0 8px 15px rgba(0,0,0,0.15)" }}>
          <Typography color="text.secondary" sx={{ fontFamily }}>
            No se encontraron matrículas para los filtros actuales.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TablaMatricula;
