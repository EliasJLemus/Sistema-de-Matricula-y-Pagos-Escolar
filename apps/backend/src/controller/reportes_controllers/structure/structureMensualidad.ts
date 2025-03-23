import { StructureAndData, StructureColumn, ReporteMensualidadDBType } from "../types/matriculaType";

const columnsMensualidad: StructureColumn<ReporteMensualidadDBType>[] = [
  { 
    name : "estudiante", 
    label: "Estudiante" 
  },
  { 
    name : "grado", 
    label: "Grado" 
  },
  { 
    name : "descuento", 
    label: "Descuento" 
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
    name : "saldo_total", 
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

export const mensualidadStructure: StructureAndData<ReporteMensualidadDBType> = {
  title  : "Reporte de Mensualidad",
  columns: columnsMensualidad,
  data   : [] as ReporteMensualidadDBType[]
};
