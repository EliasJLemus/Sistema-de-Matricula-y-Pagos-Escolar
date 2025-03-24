import { useState, useEffect } from "react";
import { useGetReporteMensualidad } from "@/lib/queries";
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
import { ReporteMensualidadType } from "@shared/reportsType";

export const MensualidadTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    estudiante: "",
    grado: "",
    fecha: ""
  });

  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    console.log("Debounced Mensualidad Filters:", debouncedFilters);
  }, [debouncedFilters]);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ estudiante: "", grado: "", fecha: "" });
    setPage(1);
  };

  const { data, isFetching, isLoading, error } = useGetReporteMensualidad(page, limit, debouncedFilters);

  const tableData = data?.data ?? [];
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

      <ReportTable<ReporteMensualidadType>
        title={data?.title || "Reporte de Mensualidades"}
        columns={data?.columns || []}
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
                <SelectItem value="kinder">Kinder</SelectItem>
                <SelectItem value="primero">Primero</SelectItem>
                <SelectItem value="segundo">Segundo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-40"
              value={filters.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
            />
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

      {!isLoading && !isFetching && tableData.length === 0 && (
        <div className="text-sm text-muted-foreground px-2 py-4">
          No se encontraron resultados para los filtros actuales.
        </div>
      )}
    </div>
  );
};
