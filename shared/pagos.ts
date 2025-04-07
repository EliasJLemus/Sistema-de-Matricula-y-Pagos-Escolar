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