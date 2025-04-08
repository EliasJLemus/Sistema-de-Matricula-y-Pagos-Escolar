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
    nombre_encargado_secundario?: string
  }