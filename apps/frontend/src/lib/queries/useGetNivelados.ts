import { useQuery } from '@tanstack/react-query';

// Interface basada en la vista reporte_nivelados
export interface NiveladoType {
  nivelado_id: number;
  numero_estudiante: string;
  estudiante: string;
  grado: string;
  seccion: string;
  monto_pagado: number;
  saldo_restante: number;
  fecha_pago: string;
  beca_aplicada: string;
  porcentaje_descuento: string;
  recargo: number;
  estado: string;
  comprobante: string;
}

const fetchNivelados = async (
  page: number,
  limit: number,
  filters: {
    estudiante?: string;
    grado?: string;
    estado?: string;
  }
): Promise<{
  data: NiveladoType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  title: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockData: NiveladoType[] = [
    {
      nivelado_id: 1,
      numero_estudiante: 'EST001',
      estudiante: 'Abigail López',
      grado: 'Kinder',
      seccion: 'A',
      monto_pagado: 3000,
      saldo_restante: 2000,
      fecha_pago: '15/01/2025',
      beca_aplicada: 'Ninguna',
      porcentaje_descuento: '0%',
      recargo: 0,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
    },
    {
      nivelado_id: 2,
      numero_estudiante: 'EST002',
      estudiante: 'Anna Mejía',
      grado: 'Primero',
      seccion: 'A',
      monto_pagado: 0,
      saldo_restante: 0,
      fecha_pago: '15/01/2025',
      beca_aplicada: 'Excelencia Académica',
      porcentaje_descuento: '100%',
      recargo: 0,
      estado: 'Pagado',
      comprobante:'Enviado',
    },
    {
      nivelado_id: 3,
      numero_estudiante: 'EST003',
      estudiante: 'Berenice Corrales',
      grado: 'Tercero',
      seccion: 'B',
      monto_pagado: 3750,
      saldo_restante: 1250,
      fecha_pago: '15/01/2025',
      beca_aplicada: 'Descuento Hermanos',
      porcentaje_descuento: '25%',
      recargo: 0,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
    },
    {
      nivelado_id: 4,
      numero_estudiante: 'EST004',
      estudiante: 'Carlos López',
      grado: 'Cuarto',
      seccion: 'A',
      monto_pagado: 4000,
      saldo_restante: 1000,
      fecha_pago: '15/01/2025',
      beca_aplicada: 'Descuento Hermanos',
      porcentaje_descuento: '25%',
      recargo: 0,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
    },
    {
      nivelado_id: 5,
      numero_estudiante: 'EST005',
      estudiante: 'Axel López',
      grado: 'Sexto',
      seccion: 'B',
      monto_pagado: 2500,
      saldo_restante: 2600,
      fecha_pago: '15/01/2025',
      beca_aplicada: 'Ninguna',
      porcentaje_descuento: '0%',
      recargo: 100,
      estado: 'Pendiente',
      comprobante: 'Pendiente',
    },
  ];

  let filteredData = [...mockData];
  
  if (filters.estudiante) {
    filteredData = filteredData.filter(nivelado => 
      nivelado.estudiante.toLowerCase().includes(filters.estudiante!.toLowerCase())
    );
  }
  
  if (filters.grado) {
    filteredData = filteredData.filter(nivelado => 
      nivelado.grado.toLowerCase() === filters.grado!.toLowerCase()
    );
  }
  
  if (filters.estado) {
    filteredData = filteredData.filter(nivelado => 
      nivelado.estado.toLowerCase() === filters.estado!.toLowerCase()
    );
  }

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
    title: 'Gestión de Nivelados'
  };
};

export const useGetNivelados = (
  page: number,
  limit: number,
  filters: {
    estudiante?: string;
    grado?: string;
    estado?: string;
  }
) => {
  return useQuery({
    queryKey: ['getNivelados', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchNivelados(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetNivelados;