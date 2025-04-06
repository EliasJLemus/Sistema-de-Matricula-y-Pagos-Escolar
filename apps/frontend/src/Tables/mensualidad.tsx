import { useState, useEffect } from "react";
import { useGetReporteMensualidad } from "@/lib/queries";
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
import {
  ReporteMensualidadType,
  StructureColumn,
} from "@shared/reportsType";
import { useQueryClient } from "@tanstack/react-query";

const formatoFecha = (fechaISO: string): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(fechaISO).toLocaleDateString("es-HN", opciones);
};

const structureColumns: StructureColumn<ReporteMensualidadType>[] = [
  {
    name: "codigo_mensualidad",
    label: "Código",
  },
  {
    name: "nombre_estudiante",
    label: "Estudiante",
  },
  {
    name: "grado",
    label: "Grado",
  },
  {
    name: "beneficio_aplicado",
    label: "Beneficio Aplicado",
  },
  {
    name: "porcentaje_descuento",
    label: "Porcentaje de Descuento",
  },
  {
    name: "fecha_inicio",
    label: "Fecha Inicio",
    type: "date",
    render: (valor) => formatoFecha(valor),
  },
  {
    name: "fecha_vencimiento",
    label: "Fecha Vencimiento",
    type: "date",
    render: (valor) => formatoFecha(valor),
  },
  {
    name: "subtotal",
    label: "Saldo Total",
    type: "number",
  },
  {
    name: "saldo_pagado",
    label: "Saldo Pagado",
    type: "number",
  },
  {
    name: "saldo_pendiente",
    label: "Saldo Pendiente",
    type: "number",
  },
  {
    name: "recargo",
    label: "Recargo",
    type: "number",
  },
  {
    name: "estado",
    label: "Estado",
  },
];

export const MensualidadTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const [filters, setFilters] = useState({
    estudiante: "",
    grado: "",
    fechaInicio: "",
    fechaFin: "",
  });


  const handleInputChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "todos" ? "" : value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      estudiante: "",
      grado: "",
      fechaInicio: "",
      fechaFin: "",
    });
    setPage(1);
  };

  const debouncedFilters = useDebounce(filters, 400);

  const { data, isFetching, isLoading, error } = useGetReporteMensualidad(
    page,
    limit,
    debouncedFilters
  );

  const tableData = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  useEffect(() => {

  }, [page, total, debouncedFilters]);

  return (
    <div className="relative space-y-4">
      {(isLoading || isFetching) && (
        <div className="absolute top-0 right-0 p-2 text-sm text-muted-foreground animate-pulse">
          {isLoading ? "Cargando..." : "Actualizando..."}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-2">
          Error: {error.message}
        </div>
      )}

      <ReportTable<ReporteMensualidadType>
        title={data?.title || "Reporte de Mensualidades"}
        columns={structureColumns}
        data={tableData}
        filters={
          <div className="flex flex-wrap gap-4 items-end">
            {/* Estudiante */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-muted-foreground">Nombre del Estudiante</label>
              <Input
                placeholder="Ej: José Martínez"
                className="w-52"
                value={filters.estudiante}
                onChange={(e) =>
                  handleInputChange("estudiante", e.target.value)
                }
              />
            </div>

            {/* Grado */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-muted-foreground">Grado</label>
              <Select
                value={filters.grado || "todos"}
                onValueChange={(value) => handleInputChange("grado", value)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
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
            </div>

            {/* Desde */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-muted-foreground">Desde</label>
              <Input
                type="date"
                className="w-44"
                value={filters.fechaInicio}
                onChange={(e) =>
                  handleInputChange("fechaInicio", e.target.value)
                }
              />
            </div>

            {/* Hasta */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-muted-foreground">Hasta</label>
              <Input
                type="date"
                className="w-44"
                value={filters.fechaFin}
                onChange={(e) =>
                  handleInputChange("fechaFin", e.target.value)
                }
              />
            </div>

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
          onPageChange: (newPage) => setPage(newPage),
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
