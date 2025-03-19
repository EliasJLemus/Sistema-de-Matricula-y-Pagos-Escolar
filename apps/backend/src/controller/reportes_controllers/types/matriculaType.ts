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
  
  