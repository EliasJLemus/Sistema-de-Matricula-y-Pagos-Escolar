import { useQuery } from '@tanstack/react-query';

// Interface basada en la vista vista_matriculas_completa
export interface MatriculaType {
  matricula_id: number;
  numero_estudiante: string;
  nombre_estudiante: string;
  grado: string;
  seccion: string;
  fecha_matricula: string;
  tarifa_base: number;
  beneficio_aplicado: string;
  descuento_aplicado: string;
  total_pagar: number;
  estado: string;
  comprobante: string;
  anno_academico: string;
}

// Función para obtener las matrículas
const fetchMatriculas = async (
  page: number,
  limit: number,
  filters: {
    nombreEstudiante?: string;
    grado?: string;
    estado?: string;
  }
): Promise<{
  data: MatriculaType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  title: string;
}> => {
  // Simulación de delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Datos de ejemplo basados en la vista
  const mockData: MatriculaType[] = [
    {
      matricula_id: 1,
      numero_estudiante: 'EST001',
      nombre_estudiante: 'Abigail López',
      grado: 'Kinder',
      seccion: 'A',
      fecha_matricula: '05/01/2025',
      tarifa_base: 5000,
      beneficio_aplicado: 'Sin beneficio',
      descuento_aplicado: '0%',
      total_pagar: 5000,
      estado: 'Pagado',
      comprobante: 'Enviado',
      anno_academico: '2025'
    },
    {
      matricula_id: 2,
      numero_estudiante: 'EST002',
      nombre_estudiante: 'Anna Mejía',
      grado: 'Primero',
      seccion: 'A',
      fecha_matricula: '05/01/2025',
      tarifa_base: 5000,
      beneficio_aplicado: 'Beca',
      descuento_aplicado: '100%',
      total_pagar: 0,
      estado: 'Pagado',
      comprobante: 'Enviado',
      anno_academico: '2025'
    },
    {
      matricula_id: 3,
      numero_estudiante: 'EST003',
      nombre_estudiante: 'Berenice Corrales',
      grado: 'Tercero',
      seccion: 'B',
      fecha_matricula: '07/01/2025',
      tarifa_base: 5000,
      beneficio_aplicado: 'Descuento hermanos',
      descuento_aplicado: '25%',
      total_pagar: 3750,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
      anno_academico: '2025'
    },
    {
      matricula_id: 4,
      numero_estudiante: 'EST004',
      nombre_estudiante: 'Carlos López',
      grado: 'Cuarto',
      seccion: 'A',
      fecha_matricula: '08/01/2025',
      tarifa_base: 5000,
      beneficio_aplicado: 'Descuento especial',
      descuento_aplicado: '50%',
      total_pagar: 2500,
      estado: 'Pagado',
      comprobante: 'Enviado',
      anno_academico: '2025'
    },
    {
      matricula_id: 5,
      numero_estudiante: 'EST005',
      nombre_estudiante: 'Axel López',
      grado: 'Sexto',
      seccion: 'B',
      fecha_matricula: '10/01/2025',
      tarifa_base: 5000,
      beneficio_aplicado: 'Sin beneficio',
      descuento_aplicado: '0%',
      total_pagar: 5000,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
      anno_academico: '2025'
    }
  ];

  // Filtrar datos
  let filteredData = [...mockData];
  
  if (filters.nombreEstudiante) {
    filteredData = filteredData.filter(mat => 
      mat.nombre_estudiante.toLowerCase().includes(filters.nombreEstudiante!.toLowerCase())
    );
  }
  
  if (filters.grado) {
    filteredData = filteredData.filter(mat => 
      mat.grado.toLowerCase() === filters.grado!.toLowerCase()
    );
  }
  
  if (filters.estado) {
    filteredData = filteredData.filter(mat => 
      mat.estado.toLowerCase() === filters.estado!.toLowerCase()
    );
  }

  // Paginación
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filteredData.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      total: filteredData.length,
      page,
      limit
    },
    title: 'Gestión de Matrículas'
  };
};

// Hook personalizado para matrículas
export const useGetMatriculas = (
  page: number,
  limit: number,
  filters: {
    nombreEstudiante?: string;
    grado?: string;
    estado?: string;
  }
) => {
  return useQuery({
    queryKey: ['getMatriculas', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchMatriculas(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetMatriculas;