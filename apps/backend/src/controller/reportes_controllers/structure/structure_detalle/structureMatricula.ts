import { StructureAndData, StructureColumn, ReporteMatriculaType } from "@shared/reportsType"

const columnsMatricula: StructureColumn<ReporteMatriculaType>[] = [
  { name: "nombreEstudiante", 
    label: "Nombre del Estudiante" },
  { name: "grado", 
    label: "Grado" },
  { name: "seccion", 
    label: "Sección" },
  { name: "tarifaMatricula", 
    label: "Tarifa Matrícula", type: "number" },
  { name: "beneficioAplicado", 
    label: "Beneficio" },
  { name: "descuento", 
    label: "Descuento" },
  { name: "totalPagar", 
    label: "Total a Pagar", 
    type: "number" },
  { name: "estado", 
    label: "Estado" },
  { name: "fechaMatricula", 
    label: "Fecha Matrícula", 
    type: "date" }
];

export const matriculaStructure: StructureAndData<ReporteMatriculaType> = {
  title: "Reporte de Matrícula",
  columns: columnsMatricula,
  data: [] as ReporteMatriculaType[]
};
