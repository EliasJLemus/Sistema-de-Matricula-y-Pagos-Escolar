import { StructureAndData, StructureColumn, ReportePagosPendientesType } from "@shared/reportsType"; // Ajusta ruta si necesario

const columnsPagosPendientes: StructureColumn<ReportePagosPendientesType>[] = [
  { name: "grado", 
    label: "Grado" },
  { name: "total_deudas", 
    label: "Total Deudas", 
    type: "number" },
  { name: "promedio_deuda_por_estudiante", 
    label: "Promedio de Deuda por Estudiante", 
    type: "number" },
  { name: "deuda_total_del_grado", 
    label: "Deuda Total del Grado", 
    type: "number" },
];

export const pagosPendientesStructure: StructureAndData<ReportePagosPendientesType> = {
  title: "Reporte de Pagos Pendientes",
  columns: columnsPagosPendientes,
  data: [] as ReportePagosPendientesType[],
};
