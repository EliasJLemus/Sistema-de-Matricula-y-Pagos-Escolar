import { StructureAndData, StructureColumn, ReporteBecaType } from "@shared/reportsType";

const columnsBeca: StructureColumn<ReporteBecaType>[] = [
  { 
    name : "id_estudiante", 
    label: "ID Estudiante",
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
    name : "tipo_beneficio", 
    label: "Tipo de Beneficio"
  },
  { 
    name : "porcentaje_beneficio", 
    label: "Porcentaje de Beneficio"
  },
  { 
    name : "estado", 
    label: "Estado"
  }
];

export const becaStructure: StructureAndData<ReporteBecaType> = {
  title  : "Reporte de Becas y Descuentos",
  columns: columnsBeca,
  data   : [] as ReporteBecaType[]
};
