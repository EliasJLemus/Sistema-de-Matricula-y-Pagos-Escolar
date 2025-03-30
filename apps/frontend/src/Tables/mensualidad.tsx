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
import { ReporteMensualidadType, StructureColumn } from "@shared/reportsType";
import { useQueryClient } from "@tanstack/react-query";

const structureColumns: StructureColumn<ReporteMensualidadType>[] = [
  { 
    name : "nombre_estudiante", 
    label: "Estudiante" 
  },
  { 
    name : "grado", 
    label: "Grado" 
  },
  { 
    name : "beneficio_aplicado", 
    label: "Beneficio Aplicado" 
  },
  {
    name: "porcentaje_descuento",
    label: "Porcentaje de Descuento"
  },
  { 
    name : "fecha_inicio", 
    label: "Fecha Inicio", 
    type : "date" 
  },
  { 
    name : "fecha_vencimiento", 
    label: "Fecha Vencimiento", 
    type : "date" 
  },
  { 
    name : "subtotal", 
    label: "Saldo Total", 
    type : "number" 
  },
  { 
    name : "saldo_pagado", 
    label: "Saldo Pagado", 
    type : "number" 
  },
  { 
    name : "saldo_pendiente", 
    label: "Saldo Pendiente", 
    type : "number" 
  },
  { 
    name : "recargo", 
    label: "Recargo", 
    type : "number" 
  },
  { 
    name : "estado", 
    label: "Estado" 
  }
];

export const MensualidadTable: React.FC = () => {

  const [page, setPage] = useState<number>(1);
  const limit = 5; // Puedes cambiarlo a 10 o más para producción

  const [filters, setFilters] = useState({
    estudiante: "",
    grado: "",
    fecha: ""
  });

  const queryClient = useQueryClient(); 

  const handleFreshReload = () => {

    setPage;

    queryClient.invalidateQueries({
      queryKey: ["getReporteMensualidad", page, limit, JSON.stringify(filters)],
    });
  }

  const debouncedFilters = useDebounce(filters, 400);

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

  useEffect(() => {
    console.log("Mensualidad page:", page);
    console.log("Pagination total:", total);
    console.log("Debounced filters:", debouncedFilters);
  }, [page, total, debouncedFilters]);

  return (
    <div className="relative space-y-4">
      {(isLoading || isFetching) && (
        <div className="absolute top-0 right-0 p-2 text-sm text-muted-foreground animate-pulse">
          {isLoading ? "Cargando..." : "Actualizando..."}
        </div>
      )}

      {error && <div className="text-red-500 p-2">Error: {error.message}</div>}

      <ReportTable<ReporteMensualidadType>
        title={data?.title || "Reporte de Mensualidades"}
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
