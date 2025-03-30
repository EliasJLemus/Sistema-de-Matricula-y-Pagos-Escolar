import { StructureColumn, StructureAndData, ReporteRetiroEstudiantesType } from "@shared/reportsType";

const columnsRetiroEstudiantes: StructureColumn<ReporteRetiroEstudiantesType>[] = [
  { name: "nivel", label: "Grado" },
  { name: "estudiantes_activos", label: "Estudiantes Activos", type: "number" },
  { name: "estudiantes_retirados", label: "Estudiantes Retirados", type: "number" },
  { name: "tasa_retiro", label: "Tasa Retiro" },
];

export const retiroEstudiantesStructure: StructureAndData<ReporteRetiroEstudiantesType> = {
  title: "Reporte de Retiro de Estudiantes",
  columns: columnsRetiroEstudiantes,
  data: [] as ReporteRetiroEstudiantesType[],
};
