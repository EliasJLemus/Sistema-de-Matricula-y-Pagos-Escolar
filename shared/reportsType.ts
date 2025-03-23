export type ReporteMatriculaDBType = {
    nombre_estudiante: string;
    grado: string;
    seccion: string;
    tarifa_matricula: number;
    beneficio_aplicado: string;
    descuento: string;
    total_pagar: number;
    estado: string;
    fecha_matricula: string; 
  };

  export type ReporteMatriculaType = {
    nombreEstudiante: string;
    grado: string;
    seccion: string;
    tarifaMatricula: number;
    beneficioAplicado: string;
    descuento: string;
    totalPagar: number;
    estado: string;
    fechaMatricula: string | Date;
  };
  
  export type ReporteMensualidadType = {
    estudiante: string,
    grado: string,
    descuento: string,
    fecha_inicio: string | Date,         
    fecha_vencimiento: string | Date,    
    saldo_total: number,
    saldo_pagado: number,
    saldo_pendiente: number,
    recargo: number,
    estado: string
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
  

  export type StructureColumn<T> = {
    name: keyof T;      
    label: string;   
    type?: string;     
  };
  
  export type StructureAndData<T> = {
    title: string;               
    columns: StructureColumn<T>[];
    data: T[];                     
  };
  
  
  
