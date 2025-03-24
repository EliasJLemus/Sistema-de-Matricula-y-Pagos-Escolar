import { useEffect, useState } from "react";
import { useGetReportsMatricula } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export const MatriculaTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Estado temporal para escribir filtros
  const [tempFilters, setTempFilters] = useState({
    nombre: "",
    grado: "",
    estado: ""
  });

  // Estado de filtros aplicados (se actualiza al presionar "Buscar")
  const [filters, setFilters] = useState(tempFilters);

  // Aplica debounce a los filtros aplicados
  const debouncedFilters = useDebounce(filters, 400);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  useEffect(() => {
    setAppliedFilters(debouncedFilters);
  }, [debouncedFilters]);

  const handleInput = (key: string, value: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const aplicarFiltros = () => {
    setFilters(tempFilters);
    setPage(1);
  };

  const { data, isFetching, isLoading, error } = useGetReportsMatricula(page, limit, appliedFilters);
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
      {data ? (
        <ReportTable
          title={data.title}
          columns={data.columns}
          data={data.data}
          filters={
            <div className="flex flex-wrap gap-4 items-end">
              <Input
                placeholder="Nombre"
                className="w-64"
                value={tempFilters.nombre}
                onChange={(e) => handleInput("nombre", e.target.value)}
              />
              <Select value={tempFilters.grado} onValueChange={(value) => handleInput("grado", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kinder">Kinder</SelectItem>
                  <SelectItem value="Primero">Primero</SelectItem>
                  <SelectItem value="Segundo">Segundo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tempFilters.estado} onValueChange={(value) => handleInput("estado", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={aplicarFiltros}>Buscar</Button>
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
        <div className="text-muted-foreground p-4">Cargando datos...</div>
      )}
    </div>
  );
};
