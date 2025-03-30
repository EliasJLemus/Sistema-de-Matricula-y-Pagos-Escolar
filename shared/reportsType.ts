export type ReporteMatriculaDBType = {
    nombre_estudiante: string;
    grado: string;
    seccion: string;
    tarifa_matricula: number;
    beneficio_aplicado: string;
    descuento?: string;
    total_pagar: number;
    estado: string;
    fecha_matricula: string; 
    porcentaje_descuento?: string;
    tipo_plan

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
  };
  
  export type ReporteMensualidadType = {
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
    estudiante: string,
    identidad: string,
    genero: string,
    alergias: string | null,
    zurdo: "Sí" | "No",
    grado: string,
    estado: string,
    plan_pago: string,
    encargado: string | null,
    parentesco: string | null,
    telefono: string | null
  }

  export type ReporteBecaType = {
    id_estudiante: string;
    nombre_estudiante: string;
    grado: string;
    seccion: string;
    fecha_admision: string; 
    tipo_beneficio: string;
    porcentaje_beneficio: string; 
    estado: string;
  };
  
  export type ReportePagosPendientesType = {
    grado: string;
    total_deudas: number;
    promedio_deuda_por_estudiante: number;
    deuda_total_del_grado: number;
  };
  
  export type ReporteFinancieroAnualType = {
    tipo_pago: string;
    ingresos: number;
    deudas_por_cobrar: number;
  };
  
  export type ReporteRetiroEstudiantesType = {
    grado: string;
    estudiantes_activos: number;
    estudiantes_retirados: number;
    tasa_retiro: string; // Viene como porcentaje 'X%'
  };
  
  export interface ReporteAntiguedadEstudiantes {
    id_estudiante: string;          
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
  
  
  
  
