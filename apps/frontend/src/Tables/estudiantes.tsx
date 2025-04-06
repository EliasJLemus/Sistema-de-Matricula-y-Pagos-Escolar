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
  {
    name: "codigo_estudiante",
    label: "Codigo Estudiante"
  },
  { 
    name : "nombre_estudiante", 
    label: "Nombre del Estudiante" 
  },
  { 
    name : "identidad", 
    label: "Identidad" 
  },
  { 
    name : "genero", 
    label: "Género" 
  },
  {
    name: "edad",
    label: "Edad"
  },
  { 
    name : "alergias", 
    label: "Alergias" 
  },
  { 
    name : "zurdo", 
    label: "Zurdo" 
  },
  {
    name: "discapacidad",
    label: "Discapacidad"
  },
  { 
    name : "grado", 
    label: "Grado" 
  },
  { 
    name : "estado", 
    label: "Estado" 
  },
  { 
    name : "plan_pago", 
    label: "Plan de Pago" 
  },
  { 
    name : "encargado_principal", 
    label: "Encargado Principal" 
  },
  { 
    name : "parentesco_principal", 
    label: "Parentesco Principal" 
  },
  { 
    name : "telefono_principal", 
    label: "Teléfono Principal" 
  },
  { 
    name : "encargado_secundario", 
    label: "Encargado Secundario" 
  },
  { 
    name : "parentesco_secundario", 
    label: "Parentesco Principal" 
  },
  { 
    name : "telefono_secundario", 
    label: "Teléfono Principal" 
  }
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
          onPageChange: setPage,
        }}
      />
    </div>
  );
};