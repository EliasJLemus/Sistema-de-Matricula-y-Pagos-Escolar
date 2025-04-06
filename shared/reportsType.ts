export type ReporteMatriculaDBType = {
  nombre_estudiante: string;
  grado: string;
  seccion: string;
  tarifa_matricula: number;
  beneficio_aplicado: string;
  descuento?: string;
  total_a_pagar: number;
  estado: string;
  fecha_matricula: string; 
  porcentaje_descuento?: string;
  tipo_plan?: string;
  codigo_matricula?: string
};

export type ReporteMatriculaType = {
  nombreEstudiante: string;
  grado: string;
  seccion: string;
  tarifaMatricula: number;
  beneficioAplicado: string;
  descuento?: string;
  totalPagar: number;
  estado: string;
  fechaMatricula: string | Date;
  pocentajeDescuento?:string;
  tipoPlan: string;
  codigo_matricula?: string
};

export type ReporteMensualidadType = {
  codigo_mensualidad: string,
  nombre_estudiante: string,
  grado: string,
  beneficio_aplicado: string
  porcentaje_descuento: string,
  fecha_inicio: string | Date,         
  fecha_vencimiento: string | Date,    
  subtotal: number,
  saldo_pendiente: number,
  saldo_pagado: number,
  recargo: number,
  estado:string
}

export type ReporteEstudianteType = {
  codigo_estudiante?: string,
  nombre_estudiante: string,
  identidad: string,
  genero: string,
  edad: number,
  alergias: string | null,
  zurdo: "Sí" | "No",
  discapacidad: string,
  grado: string,
  estado: string,
  plan_pago: string,
  encargado_principal: string | null,
  parentesco_principal: string | null,
  telefono_principal: string | null,
  encargado_secundario?: string,
  parentesco_secundario?: string,
  telefono_secundario?: string
}

export type ReporteBecaType = {
  codigo_beca?: string
  nombre_estudiante?: string;
  grado?: string;
  seccion?: string;
  fecha_admision?: string; 
  nombre_beca?: string;
  porcentaje_beca?: string;
  tipo_aplicacion?: string;
  estado?: string;
  nombre_encargado?: string;
  fecha_aplicacion?: string
};

export type ReportePagosPendientesType = {
  grado?: string;
  estudiantes_morosos?: number;
  total_estudiantes?: number;
  porcentaje_morosidad?: string;
  deuda_total?: number;
  promedio_deuda_moroso?: number;
};

export type ReporteFinancieroAnualType = {
  tipo_pago: string;
  ingresos: number;
  deudas_por_cobrar: number;
};

export type ReporteRetiroEstudiantesType = {
  nivel: string;
  estudiantes_activos: number;
  estudiantes_retirados: number;
  tasa_retiro: string; // Viene como porcentaje 'X%'
};

export interface ReporteAntiguedadEstudiantes {
  codigo_estudiante: string;          
  nombre_estudiante: string;     
  grado: string;                 
  seccion: string;                
  fecha_admision: string;         
  antiguedad: string;             // 'Un año', 'Dos años', 'Tres años', etc.
}


export type StructureColumn<T> = {
  name: keyof T;
  label: string;
  type?: string;
  render?: (value: any) => string | number 
};

export type PaginationType = {
  limit: number;
  offset: number;
  count: number;
  total: number;
};

export type StructureAndData<T> = {
  title: string;
  columns: StructureColumn<T>[];
  data: T[];
  pagination?: PaginationType; // 
};
