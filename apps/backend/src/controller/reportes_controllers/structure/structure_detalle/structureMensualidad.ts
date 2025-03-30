import { StructureAndData, StructureColumn, ReporteMensualidadType } from "@shared/reportsType";

const columnsMensualidad: StructureColumn<ReporteMensualidadType>[] = [
  { 
    name : "nombre_estudiante", 
    label: "Estudiante" 
  },
  { 
    name : "grado", 
    label: "Grado" 
  },
  { 
    name : "beneficio_aplicado", 
    label: "Beneficio Aplicado" 
  },
  {
    name: "porcentaje_descuento",
    label: "Porcentaje de Descuento"
  },
  { 
    name : "fecha_inicio", 
    label: "Fecha Inicio", 
    type : "date" 
  },
  { 
    name : "fecha_vencimiento", 
    label: "Fecha Vencimiento", 
    type : "date" 
  },
  { 
    name : "subtotal", 
    label: "Saldo Total", 
    type : "number" 
  },
  { 
    name : "saldo_pagado", 
    label: "Saldo Pagado", 
    type : "number" 
  },
  { 
    name : "saldo_pendiente", 
    label: "Saldo Pendiente", 
    type : "number" 
  },
  { 
    name : "recargo", 
    label: "Recargo", 
    type : "number" 
  },
  { 
    name : "estado", 
    label: "Estado" 
  }
];

export const mensualidadStructure: StructureAndData<ReporteMensualidadType> = {
  title  : "Reporte de Mensualidad",
  columns: columnsMensualidad,
  data   : [] as ReporteMensualidadType[]
};
