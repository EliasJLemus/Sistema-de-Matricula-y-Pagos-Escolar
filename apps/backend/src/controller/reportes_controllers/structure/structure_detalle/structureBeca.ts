import { StructureAndData, StructureColumn, ReporteBeca } from "@shared/reportsType";

const columnsBeca: StructureColumn<ReporteBeca>[] = [
  { 
    name : "idEstudiante", 
    label: "ID Estudiante",
    type : "number"
  },
  { 
    name : "nombreEstudiante", 
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
    name : "fechaAdmision", 
    label: "Fecha de Admisión",
    type : "date"
  },
  { 
    name : "tipoBeneficio", 
    label: "Tipo de Beneficio"
  },
  { 
    name : "porcentajeBeneficio", 
    label: "Porcentaje de Beneficio"
  },
  { 
    name : "estado", 
    label: "Estado"
  }
];

export const becaStructure: StructureAndData<ReporteBeca> = {
  title  : "Reporte de Becas y Descuentos",
  columns: columnsBeca,
  data   : [] as ReporteBeca[]
};
