export interface MatriculaPagoType {
    uuid_matricula: string;
    codigo_estudiante: string;
    nombre_estudiante: string;
    grado: string;
    seccion: string;
    tarifa_base: number;
    beneficio_aplicado: string;
    descuento_aplicado: string;
    total_pagar: number;
    estado: string;
    comprobante: string;
    fecha_matricula: string;
  }

  export interface MatriculaType {
    uuid_matricula?: string;
    uuid_estudiante?: string;
    codigo_estudiante?: string;
    nombre_estudiante?: string;
    grado?: string;
    seccion?: string;
    tarifa_base?: number;
    beneficio_aplicado?: string;
    descuento_aplicado?: string;
    total_pagar?: number;
    estado?: string;
    comprobante?: string;
    fecha_matricula?: string;
    year_academico?: number,
    uuid_encargado_principal?: string
    codigo_encargado_principal?: string;
    nombre_encargado_principal?: string;
    uuid_encargado_secundario?: string;
    codigo_encargado_secundario?: string;
    nombre_encargado_secundario?: string;
    tipo_pago?: string;
    descripcion?: string;
    periodicidad?: string;
    codigo_plan_detallado?: string;
    codigo_plan_matricula?: string;
    tarifa_plan_matricula?: number;
    vencimiento?: string;
    tipo_plan_matricula?: string;
    nivel_plan_matricula?: string;
    year_plan_matricula?: number;
    nombre_beca?: string;
    descuento?: number;
    codigo_beca? : string;
    total_matricula?: number;
  }

  export interface MatriculaTableType {
    uuid_matricula?: string;
    codigo_matricula: string;
    codigo_estudiante: string;
    nombre_estudiante: string;
    nombre_grado: string;
    seccion: string;
    tarifa: string;
    beneficio: string;
    descuento: number;
    total: string;
    estado: string;
    estado_comprobante: string;
    fecha_matricula: string;
  }

  //**
  //MENSUALIDADES 
  //  */
  export type MensualidadTableType = {
    codigo_mensualidad? : string,
    codigo_estudiante?: string,
    nombre_estudiante?: string,
    grado? : string,
    seccion?: string,
    fecha_inicio?: Date | string,
    fecha_vencimiento?: Date | string,
    monto_total?: number,
    beneficio?: string,
    descuento?: number,
    saldo_pagado?: number,
    saldo_pendiente? : number,
    recargo?: number
    estado?: string,
    estado_comprobante?: string,
    uuid_mensualidad? : string,
    uuid_estudiante?: string,
    uuid_comprobante?: string,
    uuid_matricula?: string
  }
  