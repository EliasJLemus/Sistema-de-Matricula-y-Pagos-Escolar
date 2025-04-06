import { StructureAndData, StructureColumn, ReporteAntiguedadEstudiantes } from "@shared/reportsType";

const columnsAntiguedad: StructureColumn<ReporteAntiguedadEstudiantes>[] = [
  { 
    name : "codigo_estudiante", 
    label: "Codigo Estudiante" 
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
    label: "Fecha de Admisión" 
  },
  { 
    name : "antiguedad", 
    label: "Antigüedad" 
  }
];

export const antiguedadStructure: StructureAndData<ReporteAntiguedadEstudiantes> = {
  title  : "Reporte de Antigüedad de Estudiantes",
  columns: columnsAntiguedad,
  data   : [] as ReporteAntiguedadEstudiantes[]
};