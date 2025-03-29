import { useQuery } from '@tanstack/react-query';

// Define la interfaz para los datos de estudiantes según las columnas mostradas
export interface EstudianteType {
  id: number;
  numero_estudiante: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  nacionalidad: string;
  identidad: string;
  genero: 'M' | 'F';
  fecha_nacimiento: string;
  edad: number;
  direccion: string;
  nombre_grado: string;
  seccion: string;
  es_zurdo: boolean;
  dif_educacion_fisica: boolean;
  reaccion_alergica: boolean;
  descripcion_alergica: string;
  fecha_admision: string;
  estado: 'Activo' | 'Inactivo';
}

// Función para obtener los estudiantes de la API
const fetchEstudiantes = async (
  page: number, 
  limit: number, 
  filters: {
    nombre?: string;
    grado?: string;
    estado?: string;
  }
): Promise<{
  data: EstudianteType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  title: string;
}> => {
  // Simulación de un delay para emular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  // Datos de ejemplo ajustados a la estructura mostrada
  const mockData: EstudianteType[] = [
    {
      id: 1,
      numero_estudiante: 1001,
      primer_nombre: 'Abigail',
      segundo_nombre: '',
      primer_apellido: 'Fajardo',
      segundo_apellido: '',
      nacionalidad: 'Hondureña',
      identidad: '0801199912345',
      genero: 'F',
      fecha_nacimiento: '1999-05-15',
      edad: 25,
      direccion: 'Col. Kennedy',
      nombre_grado: 'Sexto',
      seccion: 'A',
      es_zurdo: true,
      dif_educacion_fisica: false,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2025-01-02',
      estado: 'Activo'
    },
    {
      id: 2,
      numero_estudiante: 1002,
      primer_nombre: 'Allan',
      segundo_nombre: '',
      primer_apellido: 'Fernández',
      segundo_apellido: '',
      nacionalidad: 'Hondureña',
      identidad: '0801200054321',
      genero: 'M',
      fecha_nacimiento: '2000-07-22',
      edad: 24,
      direccion: 'Col. Miraflores',
      nombre_grado: 'Primero',
      seccion: 'B',
      es_zurdo: false,
      dif_educacion_fisica: false,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2025-01-02',
      estado: 'Activo'
    },
    {
      id: 3,
      numero_estudiante: 1003,
      primer_nombre: 'Ángel',
      segundo_nombre: '',
      primer_apellido: 'Velásquez',
      segundo_apellido: '',
      nacionalidad: 'Hondureño',
      identidad: '0801199811122',
      genero: 'M',
      fecha_nacimiento: '1998-10-05',
      edad: 26,
      direccion: 'Col. Las Torres',
      nombre_grado: 'Noveno',
      seccion: 'C',
      es_zurdo: false,
      dif_educacion_fisica: false,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2025-01-02',
      estado: 'Activo'
    },
    {
      id: 4,
      numero_estudiante: 1004,
      primer_nombre: 'María',
      segundo_nombre: 'Luisa',
      primer_apellido: 'Rodríguez',
      segundo_apellido: 'Gómez',
      nacionalidad: 'Hondureña',
      identidad: '0801200154321',
      genero: 'F',
      fecha_nacimiento: '2001-04-12',
      edad: 23,
      direccion: 'Res. Villa Real',
      nombre_grado: 'Segundo',
      seccion: 'A',
      es_zurdo: false,
      dif_educacion_fisica: true,
      reaccion_alergica: true,
      descripcion_alergica: 'Alergia al maní',
      fecha_admision: '2024-12-15',
      estado: 'Activo'
    },
    {
      id: 5,
      numero_estudiante: 1005,
      primer_nombre: 'Carlos',
      segundo_nombre: 'Eduardo',
      primer_apellido: 'Mendoza',
      segundo_apellido: 'Ortiz',
      nacionalidad: 'Hondureño',
      identidad: '0801199767890',
      genero: 'M',
      fecha_nacimiento: '1997-09-28',
      edad: 27,
      direccion: 'Col. Lomas del Guijarro',
      nombre_grado: 'Tercero',
      seccion: 'B',
      es_zurdo: true,
      dif_educacion_fisica: false,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2024-11-20',
      estado: 'Inactivo'
    },
    // Añadir más datos para probar el scrollbar
    {
      id: 6,
      numero_estudiante: 1006,
      primer_nombre: 'Juan',
      segundo_nombre: 'Carlos',
      primer_apellido: 'Martínez',
      segundo_apellido: 'López',
      nacionalidad: 'Hondureño',
      identidad: '0801199678901',
      genero: 'M',
      fecha_nacimiento: '1996-03-15',
      edad: 28,
      direccion: 'Col. Palmira',
      nombre_grado: 'Cuarto',
      seccion: 'A',
      es_zurdo: false,
      dif_educacion_fisica: false,
      reaccion_alergica: true,
      descripcion_alergica: 'Alergia a la penicilina',
      fecha_admision: '2024-10-05',
      estado: 'Activo'
    },
    {
      id: 7,
      numero_estudiante: 1007,
      primer_nombre: 'Ana',
      segundo_nombre: 'Sofía',
      primer_apellido: 'Morales',
      segundo_apellido: 'Castillo',
      nacionalidad: 'Hondureña',
      identidad: '0801200256789',
      genero: 'F',
      fecha_nacimiento: '2002-07-19',
      edad: 22,
      direccion: 'Col. El Pedregal',
      nombre_grado: 'Quinto',
      seccion: 'C',
      es_zurdo: true,
      dif_educacion_fisica: true,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2025-01-10',
      estado: 'Activo'
    },
    {
      id: 8,
      numero_estudiante: 1008,
      primer_nombre: 'Pedro',
      segundo_nombre: 'Antonio',
      primer_apellido: 'García',
      segundo_apellido: 'Flores',
      nacionalidad: 'Hondureño',
      identidad: '0801199589012',
      genero: 'M',
      fecha_nacimiento: '1995-11-30',
      edad: 29,
      direccion: 'Col. Los Pinos',
      nombre_grado: 'Sexto',
      seccion: 'B',
      es_zurdo: false,
      dif_educacion_fisica: false,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2024-09-15',
      estado: 'Inactivo'
    },
    {
      id: 9,
      numero_estudiante: 1009,
      primer_nombre: 'Laura',
      segundo_nombre: 'Melissa',
      primer_apellido: 'Hernández',
      segundo_apellido: 'Paz',
      nacionalidad: 'Hondureña',
      identidad: '0801200367890',
      genero: 'F',
      fecha_nacimiento: '2003-02-25',
      edad: 21,
      direccion: 'Col. Cerro Grande',
      nombre_grado: 'Séptimo',
      seccion: 'A',
      es_zurdo: false,
      dif_educacion_fisica: false,
      reaccion_alergica: true,
      descripcion_alergica: 'Alergia al polen',
      fecha_admision: '2025-01-15',
      estado: 'Activo'
    },
    {
      id: 10,
      numero_estudiante: 1010,
      primer_nombre: 'Daniel',
      segundo_nombre: 'José',
      primer_apellido: 'Santos',
      segundo_apellido: 'Rivera',
      nacionalidad: 'Hondureño',
      identidad: '0801199475678',
      genero: 'M',
      fecha_nacimiento: '1994-05-10',
      edad: 30,
      direccion: 'Col. Las Colinas',
      nombre_grado: 'Octavo',
      seccion: 'C',
      es_zurdo: true,
      dif_educacion_fisica: true,
      reaccion_alergica: false,
      descripcion_alergica: '',
      fecha_admision: '2024-08-20',
      estado: 'Activo'
    }
  ];

  // Filtrar los datos de acuerdo con los filtros recibidos
  let filteredData = [...mockData];
  
  if (filters.nombre) {
    filteredData = filteredData.filter(est => 
      est.primer_nombre.toLowerCase().includes(filters.nombre!.toLowerCase()) || 
      est.primer_apellido.toLowerCase().includes(filters.nombre!.toLowerCase())
    );
  }
  
  if (filters.grado) {
    filteredData = filteredData.filter(est => 
      est.nombre_grado === filters.grado
    );
  }
  
  if (filters.estado) {
    filteredData = filteredData.filter(est => 
      est.estado === filters.estado
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
    title: 'Gestión de Estudiantes'
  };
};

// Hook personalizado para gestionar la consulta
export const useGetEstudiantes = (
  page: number, 
  limit: number, 
  filters: {
    nombre?: string;
    grado?: string;
    estado?: string;
  }
) => {
  return useQuery({
    queryKey: ['getEstudiantes', page, limit, JSON.stringify(filters)],
    queryFn: () => fetchEstudiantes(page, limit, filters),
    placeholderData: (prevData) => prevData,
    refetchOnWindowFocus: false,
  });
};

export default useGetEstudiantes;