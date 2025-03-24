import { useState, useEffect } from "react";
import { useGetReporteBeca } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export const BecaTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    nombre_estudiante: "",
    grado: "",
    tipo_beneficio: "",
  });
  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    console.log("Debounced Beca filters:", debouncedFilters);
  }, [debouncedFilters]);

  const handleInputChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ nombre_estudiante: "", grado: "", tipo_beneficio: "" });
    setPage(1);
  };

  const { data, isFetching, isLoading, error } = useGetReporteBeca(page, limit, debouncedFilters);

  const total = data?.pagination?.total || 0;
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="relative">
      {(isLoading || isFetching) && (
        <div className="absolute top-0 right-0 p-2 text-sm text-muted-foreground animate-pulse">
          {isLoading ? "Cargando..." : "Actualizando..."}
        </div>
      )}
      {error && <div className="text-red-500 p-2">Error: {error.message}</div>}
      {data && data.columns && data.data ? (
        <ReportTable
          title={data.title}
          columns={data.columns}
          data={data.data}
          filters={
            <div className="flex flex-wrap gap-4 items-end">
              <Input
                placeholder="Estudiante"
                className="w-64"
                value={filters.nombre_estudiante}
                onChange={(e) => handleInputChange("nombre_estudiante", e.target.value)}
              />
              <Select
                value={filters.grado}
                onValueChange={(value) => handleInputChange("grado", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kinder">Kinder</SelectItem>
                  <SelectItem value="primero">Primero</SelectItem>
                  <SelectItem value="segundo">Segundo</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Tipo beneficio"
                className="w-64"
                value={filters.tipo_beneficio}
                onChange={(e) => handleInputChange("tipo_beneficio", e.target.value)}
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
      ) : (
        <div>No hay datos</div>
      )}
    </div>
  );
};
