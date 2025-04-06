import { StructureAndData, StructureColumn, ReportePagosPendientesType } from "@shared/reportsType"; // Ajusta ruta si necesario

const columnsPagosPendientes: StructureColumn<ReportePagosPendientesType>[] = [
  { name: "grado", 
    label: "Grado" },
  {
    name: "estudiantes_morosos",
    label: "Cantidad  Morosos"
  },
  {
    name: "total_estudiantes",
    label: "Total Estudiantes en el Grado"
  },
  {
    name: "porcentaje_morosidad",
    label: "Porcentaje Morosidad"
  },
  {
    name: "deuda_total",
    label: "Deuda Total"
  },
  {
    name: "promedio_deuda_moroso",
    label: "Promedio Deuda Moroso"
  }
];

export const pagosPendientesStructure: StructureAndData<ReportePagosPendientesType> = {
  title: "Reporte de Morosidad Por Grado",
  columns: columnsPagosPendientes,
  data: [] as ReportePagosPendientesType[],
  pagination: { limit: 0, offset: 0, count: 0, total: 0 } // <-- Aquí inicializado

};