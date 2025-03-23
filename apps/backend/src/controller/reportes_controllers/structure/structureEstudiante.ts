import { StructureAndData, StructureColumn, ReporteEstudianteDBType } from "../types/matriculaType";

const columnsEstudiante: StructureColumn<ReporteEstudianteDBType>[] = [
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

export const reporteEstudiante: StructureAndData<ReporteEstudianteDBType> = {
  title  : "Reporte de Estudiantes",
  columns: columnsEstudiante,
  data   : [] as ReporteEstudianteDBType[]
};
