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

  export type ReporteMatricula = {
    nombreEstudiante: string;
    grado: string;
    seccion: string;
    tarifaMatricula: number;
    beneficioAplicado: string;
    descuento: string;
    totalPagar: number;
    estado: string;
    fechaMatricula: string; // Formato 'DD/MM/YYYY'
  };
  
  export type ReporteMensualidadDBType = {
    estudiante: string,
    grado: string,
    descuento: string,
    fecha_inicio: string,         // Format: "DD/MM/YYYY"
    fecha_vencimiento: string,    // Format: "DD/MM/YYYY"
    saldo_total: number,
    saldo_pagado: number,
    saldo_pendiente: number,
    recargo: number,
    estado: string
  }

  export type ReporteEstudianteDBType = {
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
  
  
