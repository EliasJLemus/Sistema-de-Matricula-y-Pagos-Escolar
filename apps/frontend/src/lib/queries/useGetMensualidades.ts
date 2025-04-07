import { useQuery } from '@tanstack/react-query';

// Interface basada en la vista vista_mensualidades_completa
export interface MensualidadType {
  mensualidad_id: number;
  numero_estudiante: string;
  estudiante: string;
  grado: string;
  seccion: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  monto_total: number;
  beneficio_aplicado: string;
  porcentaje_descuento: number;
  monto_descuento: number;
  saldo_pagado: number;
  saldo_pendiente: number;
  recargo: number;
  estado: string;
  comprobante: string;
}

// Función para obtener las mensualidades
const fetchMensualidades = async (
  page: number,
  limit: number,
  filters: {
    estudiante?: string;
    grado?: string;
    estado?: string;
    fecha_vencimiento?: string;
  }
): Promise<{
  data: MensualidadType[];
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
  const mockData: MensualidadType[] = [
    {
      mensualidad_id: 1,
      numero_estudiante: 'EST001',
      estudiante: 'Abigail López',
      grado: 'Kinder',
      seccion: 'A',
      fecha_inicio: '01/02/2025',
      fecha_vencimiento: '01/03/2025',
      monto_total: 5000,
      beneficio_aplicado: 'Excelencia Académica',
      porcentaje_descuento: 100,
      monto_descuento: 5000,
      saldo_pagado: 0,
      saldo_pendiente: 0,
      recargo: 0,
      estado: 'Pagado',
      comprobante: 'Enviado'
    },
    {
      mensualidad_id: 2,
      numero_estudiante: 'EST002',
      estudiante: 'Anna Mejía',
      grado: 'Primero',
      seccion: 'A',
      fecha_inicio: '01/02/2025',
      fecha_vencimiento: '01/03/2025',
      monto_total: 5000,
      beneficio_aplicado: 'Descuento Hermanos',
      porcentaje_descuento: 25,
      monto_descuento: 1250,
      saldo_pagado: 3750,
      saldo_pendiente: 0,
      recargo: 0,
      estado: 'Pagado',
      comprobante: 'Pendiente'
    },
    {
      mensualidad_id: 3,
      numero_estudiante: 'EST003',
      estudiante: 'Berenice Corrales',
      grado: 'Tercero',
      seccion: 'B',
      fecha_inicio: '01/02/2025',
      fecha_vencimiento: '01/04/2025',
      monto_total: 5000,
      beneficio_aplicado: 'Descuento 50%',
      porcentaje_descuento: 50,
      monto_descuento: 2500,
      saldo_pagado: 2500,
      saldo_pendiente: 0,
      recargo: 0,
      estado: 'Pendiente',
      comprobante: 'Pendiente'
    },
    {
      mensualidad_id: 4,
      numero_estudiante: 'EST004',
      estudiante: 'Carlos López',
      grado: 'Cuarto',
      seccion: 'A',
      fecha_inicio: '01/03/2025',
      fecha_vencimiento: '01/04/2025',
      monto_total: 5000,
      beneficio_aplicado: 'Ninguno',
      porcentaje_descuento: 0,
      monto_descuento: 0,
      saldo_pagado: 3000,
      saldo_pendiente: 2000,
      recargo: 100,
      estado: 'Parcial',
      comprobante: 'Enviado'
    },
    {
      mensualidad_id: 5,
      numero_estudiante: 'EST005',
      estudiante: 'Axel López',
      grado: 'Sexto',
      seccion: 'B',
      fecha_inicio: '01/03/2025',
      fecha_vencimiento: '01/05/2025',
      monto_total: 5000,
      beneficio_aplicado: 'Ninguno',
      porcentaje_descuento: 0,
      monto_descuento: 0,
      saldo_pagado: 1500,
      saldo_pendiente: 3500,
      recargo: 200,
      estado: 'Pendiente',
      comprobante: 'Pendiente'

    }
  ];

  // Filtrar datos
  let filteredData = [...mockData];
  
  if (filters.estudiante) {
    filteredData = filteredData.filter(mens => 
      mens.estudiante.toLowerCase().includes(filters.estudiante!.toLowerCase())
    );
  }
  
  if (filters.grado) {
    filteredData = filteredData.filter(mens => 
      mens.grado.toLowerCase() === filters.grado!.toLowerCase()
    );
  }
  
  if (filters.estado) {
    filteredData = filteredData.filter(mens => 
      mens.estado.toLowerCase() === filters.estado!.toLowerCase()
    );
  }

  if (filters.fecha_vencimiento) {
    filteredData = filteredData.filter(mens => 
      mens.fecha_vencimiento === filters.fecha_vencimiento
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
    title: 'Gestión de Mensualidades'
  };
};

// Hook personalizado para mensualidades
export const useGetMensualidades = (
  page: number,
  limit: number,
  filters: {
    estudiante?: string;
    grado?: string;
    estado?: string;
    fecha_vencimiento?: string;
  }
) => {
  return useQuery({
    queryKey: ['getMensualidades', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchMensualidades(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetMensualidades;