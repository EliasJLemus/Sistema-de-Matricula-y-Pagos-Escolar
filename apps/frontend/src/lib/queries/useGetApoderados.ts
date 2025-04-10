import { useQuery } from '@tanstack/react-query';

// Define la interfaz para los datos de apoderados según la vista vista_apoderado
export interface ApoderadoType {
  encargado_id: number;
  numero_encargado: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  identidad: string;
  genero: 'M' | 'F';
  telefono_personal: string;
  correo_electronico: string;
  parentesco: string;
  es_encargado_principal: boolean;
  numero_estudiante: number;
  estudiante_primer_nombre: string;
  estudiante_primer_apellido: string;
  grado_estudiante: string;
  fecha_nacimiento?: string;
  uuid_estudiante?: string;
  uuid_encargado?: string;
}

// Función para obtener los apoderados de la API
const fetchApoderados = async (
  page: number, 
  limit: number, 
  filters: {
    nombre?: string;
    estudiante?: string;
    parentesco?: string;
  }
): Promise<{
  data: ApoderadoType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  title: string;
}> => {
  // Simulación de un delay para emular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  // Datos de ejemplo ajustados a la estructura mostrada en vista_apoderado
  const mockData: ApoderadoType[] = [
    {
      encargado_id: 1,
      numero_encargado: 2001,
      primer_nombre: 'Juan',
      segundo_nombre: 'Carlos',
      primer_apellido: 'Pérez',
      segundo_apellido: 'López',
      identidad: '0801198012345',
      genero: 'M',
      telefono_personal: '98765432',
      correo_electronico: 'juan.perez@example.com',
      parentesco: 'Padre',
      es_encargado_principal: true,
      numero_estudiante: 1001,
      estudiante_primer_nombre: 'Abigail',
      estudiante_primer_apellido: 'Fajardo',
      grado_estudiante: 'Sexto'
    },
    {
      encargado_id: 2,
      numero_encargado: 2002,
      primer_nombre: 'María',
      segundo_nombre: 'Isabel',
      primer_apellido: 'García',
      segundo_apellido: 'Martínez',
      identidad: '0801197512345',
      genero: 'F',
      telefono_personal: '98765433',
      correo_electronico: 'maria.garcia@example.com',
      parentesco: 'Madre',
      es_encargado_principal: true,
      numero_estudiante: 1002,
      estudiante_primer_nombre: 'Allan',
      estudiante_primer_apellido: 'Fernández',
      grado_estudiante: 'Primero'
    },
    {
      encargado_id: 3,
      numero_encargado: 2003,
      primer_nombre: 'Carlos',
      segundo_nombre: 'Alberto',
      primer_apellido: 'Rodríguez',
      segundo_apellido: 'Gómez',
      identidad: '0801197012345',
      genero: 'M',
      telefono_personal: '98765434',
      correo_electronico: 'carlos.rodriguez@example.com',
      parentesco: 'Tío',
      es_encargado_principal: false,
      numero_estudiante: 1003,
      estudiante_primer_nombre: 'Ángel',
      estudiante_primer_apellido: 'Velásquez',
      grado_estudiante: 'Noveno'
    },
    {
      encargado_id: 4,
      numero_encargado: 2004,
      primer_nombre: 'Ana',
      segundo_nombre: 'Lucía',
      primer_apellido: 'Hernández',
      segundo_apellido: 'Vásquez',
      identidad: '0801198512345',
      genero: 'F',
      telefono_personal: '98765435',
      correo_electronico: 'ana.hernandez@example.com',
      parentesco: 'Madre',
      es_encargado_principal: true,
      numero_estudiante: 1004,
      estudiante_primer_nombre: 'María',
      estudiante_primer_apellido: 'Rodríguez',
      grado_estudiante: 'Segundo'
    },
    {
      encargado_id: 5,
      numero_encargado: 2005,
      primer_nombre: 'Luis',
      segundo_nombre: 'Miguel',
      primer_apellido: 'Martínez',
      segundo_apellido: 'Flores',
      identidad: '0801197812345',
      genero: 'M',
      telefono_personal: '98765436',
      correo_electronico: 'luis.martinez@example.com',
      parentesco: 'Padre',
      es_encargado_principal: true,
      numero_estudiante: 1005,
      estudiante_primer_nombre: 'Carlos',
      estudiante_primer_apellido: 'Mendoza',
      grado_estudiante: 'Tercero'
    }
  ];

  // Filtrar los datos de acuerdo con los filtros recibidos
  let filteredData = [...mockData];
  
  if (filters.nombre) {
    filteredData = filteredData.filter(apo => 
      apo.primer_nombre.toLowerCase().includes(filters.nombre!.toLowerCase()) || 
      apo.primer_apellido.toLowerCase().includes(filters.nombre!.toLowerCase())
    );
  }
  
  if (filters.estudiante) {
    filteredData = filteredData.filter(apo => 
      apo.estudiante_primer_nombre.toLowerCase().includes(filters.estudiante!.toLowerCase()) || 
      apo.estudiante_primer_apellido.toLowerCase().includes(filters.estudiante!.toLowerCase())
    );
  }
  
  if (filters.parentesco) {
    filteredData = filteredData.filter(apo => 
      apo.parentesco.toLowerCase().includes(filters.parentesco!.toLowerCase())
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
    title: 'Gestión de Apoderados'
  };
};

// Hook personalizado para gestionar la consulta
export const useGetApoderados = (
  page: number, 
  limit: number, 
  filters: {
    nombre?: string;
    estudiante?: string;
    parentesco?: string;
  }
) => {
  return useQuery({
    queryKey: ['getApoderados', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchApoderados(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetApoderados;