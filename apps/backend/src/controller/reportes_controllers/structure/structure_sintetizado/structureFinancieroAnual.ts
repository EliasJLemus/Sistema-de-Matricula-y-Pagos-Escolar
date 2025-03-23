import { StructureAndData, StructureColumn, ReporteFinancieroAnualType } from "@shared/reportsType";

 const columnsFinancieroAnual: StructureColumn<ReporteFinancieroAnualType>[] = [
  { name: "tipo_pago", label: "Tipo de Pago" },
  { name: "ingresos", label: "Ingresos", type: "number" },
  { name: "deudas_por_cobrar", label: "Deudas por Cobrar", type: "number" },
];

export const financieroAnualStructure: StructureAndData<ReporteFinancieroAnualType> = {
  title: "Reporte Financiero Anual",
  columns: columnsFinancieroAnual,
  data: [] as ReporteFinancieroAnualType[],
};
