import { StructureAndData, StructureColumn, ReporteBecaType, PaginationType } from "@shared/reportsType";

const columnsBeca: StructureColumn<ReporteBecaType>[] = [
  { 
    name : "codigo_beca", 
    label: "Codigo Beca",
  },
  { 
    name : "nombre_estudiante", 
    label: "Nombre del Estudiante"
  },
  { 
    name : "grado", 
    label: "Grado"
  },
  { 
    name : "seccion", 
    label: "Sección"
  },
  { 
    name : "fecha_admision", 
    label: "Fecha de Admisión",
    type : "date"
  },
  {
    name: "nombre_beca",
    label: "Nombre de la Beca"
  },
  {
    name: "porcentaje_beca",
    label: "Porcentaje"
  },
  {
    name : "tipo_aplicacion",
    label: "Tipo Aplicacion"
  },
  {
    name: "fecha_aplicacion",
    label: "Fecha Aplicada a la Beca"
  },
  { 
    name : "estado", 
    label: "Estado"
  }
];

export const becaStructure: StructureAndData<ReporteBecaType> = {
  title  : "Reporte de Becas y Descuentos",
  columns: columnsBeca,
  data   : [] as ReporteBecaType[],
  pagination: { limit: 0, offset: 0, count: 0, total: 0 } // <-- Aquí inicializado
};