import { StructureAndData, StructureColumn, ReporteEstudiante } from "@shared/reportsType";

const columnsEstudiante: StructureColumn<ReporteEstudiante>[] = [
  { 
    name : "estudiante", 
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
    name : "alergias", 
    label: "Alergias" 
  },
  { 
    name : "zurdo", 
    label: "Zurdo" 
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
    name : "encargado", 
    label: "Encargado" 
  },
  { 
    name : "parentesco", 
    label: "Parentesco" 
  },
  { 
    name : "telefono", 
    label: "Teléfono" 
  }
];

export const estudianteStructure: StructureAndData<ReporteEstudiante> = {
  title  : "Reporte de Estudiantes",
  columns: columnsEstudiante,
  data   : [] as ReporteEstudiante[]
};
