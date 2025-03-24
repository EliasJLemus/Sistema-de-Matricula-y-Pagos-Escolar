import { useState } from "react";
import { useGetReportsMatricula } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { StructureColumn, ReporteMatriculaType } from "@shared/reportsType";

const structureColumns: StructureColumn<ReporteMatriculaType>[] = [
  { name: "nombreEstudiante", label: "Nombre Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  { name: "tarifaMatricula", label: "Tarifa Matrícula" },
  { name: "beneficioAplicado", label: "Beneficio Aplicado" },
  { name: "descuento", label: "Descuento" },
  { name: "totalPagar", label: "Total a Pagar" },
  { name: "estado", label: "Estado" },
  { name: "fechaMatricula", label: "Fecha Matrícula" },
];

export const MatriculaTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Estado para los filtros que se mantienen visibles
  const [filters, setFilters] = useState({
    nombre: "",
    grado: "",
    estado: ""
  });

  // Se aplica debounce para evitar refetch en cada tecla
  const debouncedFilters = useDebounce(filters, 400);

  // Actualiza filtros y reinicia la página
  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Consulta la data usando los filtros
  const { data, isFetching, isLoading, error } = useGetReportsMatricula(page, limit, debouncedFilters);

  // Si no hay data, se define un arreglo vacío para la tabla
  const tableData = data ? data.data : [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="relative">
      {(isLoading || isFetching) && (
        <div className="absolute top-0 right-0 p-2 text-sm text-muted-foreground animate-pulse">
          {isLoading ? "Cargando..." : "Actualizando..."}
        </div>
      )}
      {error && <div className="text-red-500 p-2">Error: {error.message}</div>}
      <ReportTable<ReporteMatriculaType>
        title={data ? data.title : "Reporte de Matrícula"}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Nombre"
              className="w-64"
              value={filters.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
            />
            <Select
              value={filters.grado}
              onValueChange={(value) => handleInputChange("grado", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kinder">Kinder</SelectItem>
                <SelectItem value="Primero">Primero</SelectItem>
                <SelectItem value="Segundo">Segundo</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.estado}
              onValueChange={(value) => handleInputChange("estado", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        pagination={{
          page,
          pageCount,
          onNext: () => setPage((p) => Math.min(p + 1, pageCount)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          onPageChange: setPage,
        }}
      />
    </div>
  );
};
