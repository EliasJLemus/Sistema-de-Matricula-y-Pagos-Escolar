import { useState } from "react";
import {
  Box, Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Typography, Paper, CircularProgress
} from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMatriculas } from "@/lib/queries";
import { MatriculaTableType } from "@shared/pagos";

const fontFamily = "'Nunito', sans-serif";

interface TablaMatriculaProps {
  onNewMatricula: () => void;
  onEditMatricula: (codigo_matricula: string) => void;
}

const TablaMatricula: React.FC<TablaMatriculaProps> = ({ onNewMatricula, onEditMatricula }) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({ nombre: "", grado: "", estado: "" });
  const debouncedFilters = useDebounce(filters, 400);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useGetMatriculas(
    page,
    limit,
    {
      nombre: debouncedFilters.nombre,
      grado: debouncedFilters.grado,
      estado: debouncedFilters.estado,
      year: new Date().getFullYear(),
    }
  );

  const tableData: MatriculaTableType[] = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "Todos" ? "" : value }));
    setPage(1);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {(isLoading || isFetching) && (
        <Box sx={{ position: "absolute", top: 0, right: 0, p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} sx={{ color: "#538A3E" }} />
          <Typography sx={{ fontFamily }}>Cargando...</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontFamily, color: "#1A1363", fontWeight: 700 }}>
          Lista de Matrículas
        </Typography>
        <Button variant="contained" onClick={onNewMatricula} sx={{ bgcolor: "#538A3E", color: "white" }}>
          📝 Nueva Matrícula
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: "12px" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Nombre del estudiante"
            size="small"
            value={filters.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
          />
          <FormControl size="small">
            <InputLabel>Grado</InputLabel>
            <Select
              value={filters.grado}
              label="Grado"
              onChange={(e) => handleInputChange("grado", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo"].map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              label="Estado"
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pagado">Pagado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Table className="bg-white">
        <TableHeader className="bg-[#edad4c] text-white">
          <TableRow>
            <TableHead>Código Matrícula</TableHead>
            <TableHead>Código Estudiante</TableHead>
            <TableHead>Estudiante</TableHead>
            <TableHead>Grado</TableHead>
            <TableHead>Sección</TableHead>
            <TableHead>Tarifa</TableHead>
            <TableHead>Beneficio</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Comprobante</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.codigo_matricula}>
              <TableCell>{item.codigo_matricula}</TableCell>
              <TableCell>{item.codigo_estudiante}</TableCell>
              <TableCell>{item.nombre_estudiante}</TableCell>
              <TableCell>{item.nombre_grado}</TableCell>
              <TableCell>{item.seccion}</TableCell>
              <TableCell>L. {parseFloat(item.tarifa).toLocaleString()}</TableCell>
              <TableCell>{item.beneficio}</TableCell>
              <TableCell>{item.descuento}</TableCell>
              <TableCell><strong>L. {parseFloat(item.total).toLocaleString()}</strong></TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={item.estado === "Pagado" ? "bg-green-600 text-white" : "bg-orange-500 text-white"}
                >
                  {item.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={item.estado_comprobante === "Enviado" ? "bg-green-600 text-white" : "bg-orange-500 text-white"}
                >
                  {item.estado_comprobante}
                </Badge>
              </TableCell>
              <TableCell>{new Date(item.fecha_matricula).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => {
                    console.log("Editando matrícula:", item.uuid_matricula);
                    onEditMatricula(item.uuid_matricula ?? "")}}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography sx={{ fontFamily }}>
          Mostrando {tableData.length} de {total} resultados
        </Typography>
        <Box display="flex" gap={1}>
          <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          <Button disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TablaMatricula;
