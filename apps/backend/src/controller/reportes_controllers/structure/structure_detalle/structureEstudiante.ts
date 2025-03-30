import { StructureAndData, StructureColumn, ReporteEstudianteType } from "@shared/reportsType";

const columnsEstudiante: StructureColumn<ReporteEstudianteType>[] = [
  { 
    name : "nombre_estudiante", 
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
    name: "edad",
    label: "Edad"
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
    name: "discapacidad",
    label: "Discapacidad"
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
    name : "encargado_principal", 
    label: "Encargado Principal" 
  },
  { 
    name : "parentesco_principal", 
    label: "Parentesco Principal" 
  },
  { 
    name : "telefono_principal", 
    label: "Teléfono Principal" 
  },
  { 
    name : "encargado_secundario", 
    label: "Encargado Secundario" 
  },
  { 
    name : "parentesco_secundario", 
    label: "Parentesco Principal" 
  },
  { 
    name : "telefono_secundario", 
    label: "Teléfono Principal" 
  }
];

export const estudianteStructure: StructureAndData<ReporteEstudianteType> = {
  title  : "Reporte de Estudiantes",
  columns: columnsEstudiante,
  data   : [] as ReporteEstudianteType[]
};
