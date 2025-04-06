import { useState, useEffect } from "react";
import { useGetReporteBeca } from "@/lib/queries";
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
import { StructureColumn, ReporteBecaType } from "@shared/reportsType";
import { useQueryClient } from "@tanstack/react-query";

// 🔁 Formateador de fechas reutilizable
const formatoFecha = (fechaISO: string): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(fechaISO).toLocaleDateString("es-HN", opciones);
};

// 🧱 Columnas del reporte con fechas formateadas
const structureColumns: StructureColumn<ReporteBecaType>[] = [
  { name: "codigo_beca", label: "Codigo Beca" },
  { name: "nombre_estudiante", label: "Nombre del Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  {
    name: "fecha_admision",
    label: "Fecha de Admisión",
    type: "date",
    render: (valor) => formatoFecha(valor),
  },
  { name: "nombre_beca", label: "Nombre de la Beca" },
  { name: "porcentaje_beca", label: "Porcentaje" },
  { name: "tipo_aplicacion", label: "Tipo Aplicacion" },
  {
    name: "fecha_aplicacion",
    label: "Fecha Aplicada a la Beca",
    type: "date",
    render: (valor) => formatoFecha(valor),
  },
  { name: "estado", label: "Estado" },
];

export const BecaTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    nombre_estudiante: "",
    grado: "",
    tipo_beneficio: "",
  });

  const queryClient = useQueryClient();

  const handleFreshReload = () => {
    queryClient.invalidateQueries({
      queryKey: ["getReporteBeca", page, limit, filters],
    });
  };

  const debouncedFilters = useDebounce(filters, 400);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      nombre_estudiante: "",
      grado: "",
      tipo_beneficio: "",
    });
    setPage(1);
  };

  const { data, isFetching, isLoading, error } = useGetReporteBeca(
    page,
    limit,
    debouncedFilters
  );

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

      <ReportTable<ReporteBecaType>
        title={data ? data.title : "Reporte de Becas"}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Nombre del estudiante"
              className="w-64"
              value={filters.nombre_estudiante}
              onChange={(e) =>
                handleInputChange("nombre_estudiante", e.target.value)
              }
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
                <SelectItem value="Cuarto">Cuarto</SelectItem>
                <SelectItem value="Quinto">Quinto</SelectItem>
                <SelectItem value="Sexto">Sexto</SelectItem>
                <SelectItem value="Séptimo">Séptimo</SelectItem>
                <SelectItem value="Octavo">Octavo</SelectItem>
                <SelectItem value="Noveno">Noveno</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Tipo de beneficio"
              className="w-64"
              value={filters.tipo_beneficio}
              onChange={(e) =>
                handleInputChange("tipo_beneficio", e.target.value)
              }
            />
            <Button 
              variant="default"
              onClick={clearFilters}
              className="bg-[#F38223] hover:bg-[#e67615] text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-[#d56a10] active:shadow-inner flex items-center gap-2 hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
              style={{
                boxShadow: '0px 4px 10px rgba(243, 130, 35, 0.3)',
                willChange: 'transform' // Optimización para animaciones
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
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" // Efecto adicional en el icono
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
