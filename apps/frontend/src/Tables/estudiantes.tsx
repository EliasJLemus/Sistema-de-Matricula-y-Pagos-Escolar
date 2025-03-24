import { useState, useEffect } from "react";
import { useGetReporteEstudiante } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import {
  StructureColumn,
  ReporteEstudianteType
} from "@shared/reportsType";

// Columnas de la tabla
const structureColumns: StructureColumn<ReporteEstudianteType>[] = [
  { name: "estudiante", label: "Estudiante" },
  { name: "identidad", label: "Identidad" },
  { name: "genero", label: "Género" },
  { name: "grado", label: "Grado" },
  { name: "estado", label: "Estado" },
  { name: "plan_pago", label: "Plan de Pago" },
];

export const EstudianteTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    estudiante: "",
    grado: "",
    estado: ""
  });

  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    console.log("Debounced Estudiante filters:", debouncedFilters);
  }, [debouncedFilters]);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "todos" ? "" : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ estudiante: "", grado: "", estado: "" });
    setPage(1);
  };

  const {
    data,
    isFetching,
    isLoading,
    error
  } = useGetReporteEstudiante(page, limit, debouncedFilters);

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
      <ReportTable<ReporteEstudianteType>
        title={data ? data.title : "Reporte de Estudiantes"}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Estudiante"
              className="w-64"
              value={filters.estudiante}
              onChange={(e) => handleInputChange("estudiante", e.target.value)}
            />
            <Select
              value={filters.grado || "todos"}
              onValueChange={(value) => handleInputChange("grado", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Kinder">Kinder</SelectItem>
                <SelectItem value="Primero">Primero</SelectItem>
                <SelectItem value="Segundo">Segundo</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.estado || "todos"}
              onValueChange={(value) => handleInputChange("estado", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Quitar filtros
            </Button>
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
