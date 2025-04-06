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

// ✅ Formato de fecha para la columna
const formatoFecha = (fechaISO: string): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(fechaISO).toLocaleDateString("es-HN", opciones);
};

const structureColumns: StructureColumn<ReporteMatriculaType>[] = [
  { name: "codigo_matricula", label: "Código" },
  { name: "nombreEstudiante", label: "Nombre del Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  { name: "tipoPlan", label: "Plan de matrícula" },
  { name: "tarifaMatricula", label: "Tarifa Matrícula", type: "number" },
  { name: "beneficioAplicado", label: "Beneficio" },
  { name: "descuento", label: "Porcentaje de Descuento" },
  { name: "totalPagar", label: "Total a Pagar", type: "number" },
  { name: "estado", label: "Estado" },
  {
    name: "fechaMatricula",
    label: "Fecha Matrícula",
    type: "date",
    render: (valor) => formatoFecha(valor),
  },
];

export const MatriculaTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const [filters, setFilters] = useState({
    nombre: "",
    grado: "",
    estado: "",
    year: new Date().getFullYear(),
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

  const handleInputChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
    }));
    setPage(1);
    handleFreshReload();
  };

  const clearFilters = () => {
    setFilters({
      nombre: "",
      grado: "",
      estado: "",
      year: new Date().getFullYear(),
    });
    setPage(1);
    handleFreshReload();
  };

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "getReportsMatricula",
        page,
        limit,
        JSON.stringify(filters),
      ],
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
        title={`Reporte de Matrícula ${filters.year}`}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Nombre del estudiante"
              className="w-64"
              value={filters.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
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
                <SelectItem value="Tercero">Tercero</SelectItem>
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
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col w-24">
              <label className="text-sm text-muted-foreground mb-1" htmlFor="anio-filter">
                Año
              </label>
              <Input
                id="anio-filter"
                type="number"
                value={filters.year}
                onChange={(e) =>
                  handleInputChange("year", parseInt(e.target.value))
                }
                min={2000}
                max={2100}
              />
            </div>
            <Button 
              variant="default"
              onClick={clearFilters}
              className="bg-[#F38223] hover:bg-[#e67615] text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-[#d56a10] active:shadow-inner flex items-center gap-2 hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
              style={{
                boxShadow: '0px 4px 10px rgba(243, 130, 35, 0.3)',
                willChange: 'transform'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="transition-all duration-200">Quitar filtros</span>
            </Button>
          </div>
        }
        pagination={{
          page,
          pageCount,
          onNext: () => setPage((p) => Math.min(p + 1, pageCount)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          onPageChange: (newPage) => {
            setPage(newPage);
            handleFreshReload();
          },
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
