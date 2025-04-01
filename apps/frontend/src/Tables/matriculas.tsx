import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useGetReportsMatricula } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { StructureColumn, ReporteMatriculaType } from "@shared/reportsType";

const structureColumns: StructureColumn<ReporteMatriculaType>[] = [
  { name: "nombreEstudiante", label: "Nombre Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  { name: "tarifaMatricula", label: "Tarifa Matrícula", type: "number" },
  { name: "beneficioAplicado", label: "Beneficio Aplicado" },
  { name: "descuento", label: "Descuento", type: "string" },
  { name: "totalPagar", label: "Total a Pagar", type: "number" },
  { name: "estado", label: "Estado" },
  { name: "fechaMatricula", label: "Fecha Matrícula" },
];

export const MatriculaTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const [filters, setFilters] = useState({
    nombre: "",
    grado: "",
    estado: "",
  });

  const debouncedFilters = useDebounce(filters, 400);

  const { data, isLoading, isFetching, error } = useGetReportsMatricula(
    page,
    limit,
    debouncedFilters
  );

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

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

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getReportsMatricula", page, limit, JSON.stringify(filters)],
    });
  };

  useEffect(() => {
    console.log("Página actual:", page);
    console.log("Total registros:", total);
    console.log("Data:", tableData);
  }, [page, total, tableData]);

  return (
    <div className="relative space-y-4">
      {(isLoading || isFetching) && (
        <div className="absolute top-0 right-0 p-2 text-sm text-muted-foreground animate-pulse">
          {isLoading ? "Cargando..." : "Actualizando..."}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-2">Error: {error.message}</div>
      )}

      <ReportTable<ReporteMatriculaType>
        title={data?.title || "Reporte de Matrícula"}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Nombre del estudiante"
              className="w-64"
              value={filters.nombre}
              onChange={(e) =>
                handleInputChange("nombre", e.target.value)
              }
            />
            <Select
              value={filters.grado || "todos"}
              onValueChange={(value) =>
                handleInputChange("grado", value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Kinder">Kinder</SelectItem>
                <SelectItem value="Primero">Primero</SelectItem>
                <SelectItem value="Segundo">Segundo</SelectItem>
                <SelectItem value="Tercero">Tercero</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.estado || "todos"}
              onValueChange={(value) =>
                handleInputChange("estado", value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
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
          onPageChange: handleFreshReload,
        }}
      />

      {!isLoading && !isFetching && tableData.length === 0 && (
        <div className="text-sm text-muted-foreground px-2 py-4">
          No se encontraron resultados para los filtros actuales.
        </div>
      )}
    </div>
  );
};
