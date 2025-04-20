import { useQuery } from '@tanstack/react-query';

// Interfaz para las becas
export interface BecaType {
  uuid: string;
  nombre_beca: string;
  descuento: number;
  estado: 'ACTIVO' | 'INACTIVO';
  uuid_autorizado_por: string;
}

// Función para simular la consulta de becas
const fetchBecas = async (
  page: number,
  limit: number,
  filters: {
    nombre?: string;
    estado?: 'ACTIVO' | 'INACTIVO';
    descuento?: number;
  }
): Promise<{
  data: BecaType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  title: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockData: BecaType[] = [
    {
      uuid: 'uuid-001',
      nombre_beca: 'Beca Completa',
      descuento: 100,
      estado: 'ACTIVO',
      uuid_autorizado_por: 'admin-001',
    },
    {
      uuid: 'uuid-002',
      nombre_beca: 'Beca Deportiva',
      descuento: 30,
      estado: 'ACTIVO',
      uuid_autorizado_por: 'admin-002',
    },
    {
      uuid: 'uuid-003',
      nombre_beca: 'Beca Cultural',
      descuento: 25,
      estado: 'INACTIVO',
      uuid_autorizado_por: 'admin-003',
    },
    {
      uuid: 'uuid-004',
      nombre_beca: 'Beca Familiar',
      descuento: 15,
      estado: 'ACTIVO',
      uuid_autorizado_por: 'admin-001',
    },

    {
      uuid: 'uuid-005',
      nombre_beca: 'Beca Excelencia',
      descuento: 75,
      estado: 'ACTIVO',
      uuid_autorizado_por: 'admin-002',
    },

    {
      uuid: 'uuid-006',
      nombre_beca: 'Beca Hermanos ',
      descuento: 50,
      estado: 'ACTIVO',
      uuid_autorizado_por: 'admin-001',
    }
  ];

  // Filtrar los datos según los filtros recibidos
  let filteredData = [...mockData];

  if (filters.nombre) {
    filteredData = filteredData.filter(beca =>
      beca.nombre_beca.toLowerCase().includes(filters.nombre!.toLowerCase())
    );
  }

  if (filters.estado) {
    filteredData = filteredData.filter(beca =>
      beca.estado === filters.estado
    );
  }

  if (filters.descuento !== undefined) {
    filteredData = filteredData.filter(beca =>
      beca.descuento === filters.descuento
    );
  }

  // Paginar los resultados
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
    title: 'Gestión de Becas'
  };
};

// Hook personalizado
export const useGetBecas = (
  page: number,
  limit: number,
  filters: {
    nombre?: string;
    estado?: 'ACTIVO' | 'INACTIVO';
    descuento?: number;
  }
) => {
  return useQuery({
    queryKey: ['getBecas', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchBecas(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetBecas;
