import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { client } from "./client";
import {
  ReporteMatriculaType,
  ReporteMensualidadType,
  ReporteEstudianteType,
  ReporteBecaType,
  ReporteFinancieroAnualType,
  ReportePagosPendientesType,
  ReporteRetiroEstudiantesType,
  ReporteAntiguedadEstudiantes,
  StructureAndData,
} from "@shared/reportsType";
import axios from "axios";
import { EstudiantesTablaType } from "@shared/estudiantesType";
import {MatriculaTableType, MatriculaType} from "@shared/pagos"
// Hook para matrícula con filtros
type FiltrosMatricula = {
  nombre?: string;
  grado?: string;
  estado?: string;
  year?:  number;
};

export const useGetReportsMatricula = (
  page: number = 1,
  limit: number = 10,
  filters: FiltrosMatricula = {}
): UseQueryResult<StructureAndData<ReporteMatriculaType>, Error> => {
  return useQuery({
    queryKey: ["getReportsMatricula", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      try {
        const baseUrl = `http://localhost:3000/reportes/matricula`;
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters.nombre) params.append("nombre", filters.nombre);
        if (filters.grado) params.append("grado", filters.grado);
        if (filters.estado) params.append("estado", filters.estado);
        if (filters.year) params.append("year", filters.year.toString());

        const response = await axios.get<StructureAndData<ReporteMatriculaType>>(`${baseUrl}?${params.toString()}`);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de matrícula");
      }
    },
    staleTime: 1000,
  });
};

// Hook para mensualidad
type FiltrosMensualidad = {
  estudiante?: string;
  grado?: string;
  fecha?: string;
  fechaInicio?: string;
  fechaFin?: string;
};

export const useGetReporteMensualidad = (
  page: number = 1,
  limit: number = 10,
  filters: FiltrosMensualidad = {}
): UseQueryResult<StructureAndData<ReporteMensualidadType>, Error> => {
  return useQuery({
    queryKey: ["getReporteMensualidad", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters.estudiante) params.append("estudiante", filters.estudiante);
        if (filters.grado) params.append("grado", filters.grado);
        if (filters.fechaInicio) params.append("fechaInicio", filters.fechaInicio);
        if(filters.fechaFin) params.append("fechaFin", filters.fechaFin)

        const response = await axios.get<StructureAndData<ReporteMensualidadType>>(
          `http://localhost:3000/reportes/mensualidad?${params.toString()}`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de mensualidad");
      }
    },
    staleTime: 1000,
  });
};

// Hook para estudiantes
type Filters = {
  estudiante?: string;
  grado?: string;
  estado?: string;
};

export const useGetReporteEstudiante = (
  page: number,
  limit: number,
  filters: Filters
): UseQueryResult<StructureAndData<ReporteEstudianteType>, Error> => {
  return useQuery({
    queryKey: ["reporteEstudiante", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters.estudiante) params.append("estudiante", filters.estudiante);
        if (filters.grado) params.append("grado", filters.grado);
        if (filters.estado) params.append("estado", filters.estado);

        const response = await axios.get<StructureAndData<ReporteEstudianteType>>(
          `http://localhost:3000/reportes/estudiante?${params.toString()}`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de estudiante");
      }
    },
    staleTime: 1000,
  });
};

type FiltrosBeca = {
  nombre_estudiante?: string;
  grado?: string;
  tipo_beneficio?: string;
};

export const useGetReporteBeca = (
  page: number = 1,
  limit: number = 10,
  filters: FiltrosBeca = {}
): UseQueryResult<StructureAndData<ReporteBecaType>, Error> => {
  return useQuery({
    queryKey: ["getReporteBeca", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters.nombre_estudiante) params.append("nombre_estudiante", filters.nombre_estudiante);
        if (filters.grado) params.append("grado", filters.grado);
        if (filters.tipo_beneficio) params.append("tipo_beneficio", filters.tipo_beneficio);

        const response = await axios.get<StructureAndData<ReporteBecaType>>(
          `http://localhost:3000/reportes/beca?${params.toString()}`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de becas");
      }
    },
    staleTime: 1000,
  });
};

// Hook para reporte financiero anual
export const useGetReporteFinancieroAnual = (): UseQueryResult<StructureAndData<ReporteFinancieroAnualType>, Error> => {
  return useQuery({
    queryKey: ["getReporteFinancieroAnual"],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/financiero-anual`);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte financiero anual");
      }
    },
    staleTime: 1000,
  });
};

// Hook para pagos pendientes
export const useGetReportePagosPendientes = (
  page: number,
  limit: number
): UseQueryResult<StructureAndData<ReportePagosPendientesType>, Error> => {
  return useQuery({
    queryKey: ["getReportePagosPendientes", page, limit],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/pagos-pendientes?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de pagos pendientes");
      }
    },
    staleTime: 1000,
  });
};


// Hook para retiro de estudiantes
export const useGetReporteRetiroEstudiantes = (): UseQueryResult<StructureAndData<ReporteRetiroEstudiantesType>, Error> => {
  return useQuery({
    queryKey: ["getReporteRetiroEstudiantes"],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/retiro-estudiante`);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de retiro de estudiantes");
      }
    },
    staleTime: 1000,
  });
};

// Hook para antigüedad de estudiantes
export const useGetAntiguedadEstudiante = (
  page: number,
  limit: number
): UseQueryResult<StructureAndData<ReporteAntiguedadEstudiantes>, Error> => {
  return useQuery({
    queryKey: ["getReporteAntiguedadEstudiante", page, limit],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/antiguedad-estudiante?page=${page}&limit=${limit}`);
        console.log(response)
        return response.data;
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || "Error al obtener reporte de antigüedad de estudiantes"
        );
      }
    },
    staleTime: 1000,
  });
};

// ======================
// Tipos y filtros
// ======================
type FiltrosEstudiantes = {
  nombre?: string;
  grado?: string;
  estado?: string;
};

interface StructureAndDataResult<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

interface StructureBackendResponse<T>{
  status: string;
  data: T;
}

// =======================
// Hook para registrar estudiante
// =======================

export const useRegistrarEstudiante = () => {
  return useMutation({
    mutationKey: ["registrarEstudiante"],
    mutationFn: async (data: Omit<EstudiantesTablaType, "codigo_estudiante" | "uuid">) => {
      try {
        console.log("Data a registrar:", data);
        const response = await client.post("/estudiantes/registro-estudiante", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Respuesta del servidor:", response.data);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al registrar estudiante");
      }
    },
  });
};


// ======================
// Obtener lista de estudiantes
// ======================
export const useGetEstudiantes = (
page: number = 1, limit: number = 5,filters: FiltrosEstudiantes = {}): UseQueryResult<StructureAndDataResult<EstudiantesTablaType>, Error> => {
  return useQuery({
    queryKey: ["getEstudiantes", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      // Solo agregamos los filtros si tienen valor no vacío
      if (filters.nombre?.trim()) params.append("nombre", filters.nombre.trim());
      if (filters.grado?.trim()) params.append("grado", filters.grado.trim());
      if (filters.estado?.trim()) params.append("estado", filters.estado.trim());

      const res = await axios.get<StructureAndDataResult<EstudiantesTablaType>>(
        `http://localhost:3000/estudiantes/obtener-estudiantes?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 1000,
  });
};

// ======================
// Obtener estudiante por UUID
// ======================
export const useGetEstudianteByUuid = (uuid: string): UseQueryResult<StructureBackendResponse<EstudiantesTablaType>, Error> => {
  console.log("UUID en el hook:", uuid);
  return useQuery({
    queryKey: ["getEstudiante", uuid],
    queryFn: async () => {
      const res = await client.get(`/estudiantes/obtener-estudiante/${uuid}`);
      console.log("Respuesta del servidor:", res.data);
      return res.data;
    },
    enabled: !!uuid,
    staleTime: 1000,
    
  });
};

// ======================
// Actualizar estudiante
// ======================
export const useUpdateEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<EstudiantesTablaType> }) => {
      const res = await axios.put(`http://localhost:3000/estudiantes/actualizar-estudiante/${uuid}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getEstudiantes"] });
    },
    onError: (error: any) => {
      throw new Error(error?.response?.data?.message || "Error al actualizar estudiante");
    },
  });
};

// ======================
// Registrar Apoderado
// ======================

interface RegistrarApoderadoInput {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  identidad: string;
  genero: string;
  fecha_nacimiento: string;
  correo: string;
  telefono: string;
  es_principal: boolean;
  parentesco: string;
  uuid: string;
}

interface RegistrarApoderadoResponse {
  success: boolean;
  data?: string;
  message?: string;
}

export const useRegistrarApoderado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["registrarApoderado"],
    mutationFn: async (data: RegistrarApoderadoInput): Promise<RegistrarApoderadoResponse> => {
      try {
        const response = await axios.post<RegistrarApoderadoResponse>(
          "http://localhost:3000/estudiantes/registro-apoderado",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || "Error al registrar apoderado"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getEstudiantes"] }); // Por si querés refrescar lista
    },
  });
};


// ======================
// PAGOOOOS: OBTENER MATRICULAS
// ======================E

interface Pagination {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

interface MatriculaPagosResponse {
  data: MatriculaType[];
  pagination: Pagination;
}

interface UseGetMatriculaPagosParams {
  page: number;
  limit: number;
  year?: number;
  grado?: string;
  uuid_estudiante?: string;
}

export const useGetMatriculaPagos = ({
  page,
  limit,
  year,
  grado,
  uuid_estudiante,
}: UseGetMatriculaPagosParams): UseQueryResult<MatriculaPagosResponse, Error> => {
  return useQuery({
    queryKey: ["getMatriculaPagos", page, limit, year, grado, uuid_estudiante],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (year) params.append("year", year.toString());
      if (grado) params.append("grado", grado);
      if (uuid_estudiante) params.append("uuid_estudiante", uuid_estudiante);

      const response = await axios.get<MatriculaPagosResponse>(
        `http://localhost:3000/pagos/obtener-matricula?${params.toString()}`
      );

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCrearMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, MatriculaType>({
    mutationKey: ["crearMatricula"],
    mutationFn: async (data: MatriculaType) => {
      const response = await axios.post(
        "http://localhost:3000/pagos/creacion-matricula",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMatriculaPagos"] });
    },
    onError: (error: any) => {
      throw new Error(error?.response?.data?.message || "Error al crear matrícula");
    },
  });
};



interface FiltersType {
  nombreEstudiante?: string;
  grado?: string;
  estado?: string;
  year?: number;
}

interface ResponseStructure {
  data: MatriculaTableType[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

export const useGetMatriculas = (
  page: number,
  limit: number,
  filters: FiltrosMatricula
): UseQueryResult<StructureAndData<MatriculaTableType>, Error> => {
  return useQuery({
    queryKey: ["getMatriculas", page, limit, JSON.stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (filters.nombre) params.append("nombre", filters.nombre);
      if (filters.grado) params.append("grado", filters.grado);
      if (filters.estado) params.append("estado", filters.estado);
      if (filters.year) params.append("year", filters.year.toString());

      const response = await axios.get<StructureAndData<MatriculaTableType>>(
        `http://localhost:3000/pagos/matriculas?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ======================
// Hook para obtener matrícula por UUID
// ======================

interface MatriculaConImagen extends MatriculaType {
  url_imagen?: string;
}


interface BackendResponse {
  success: boolean;
  data: MatriculaConImagen;
  message: string;
}

export const useGetMatriculaByUuid = (
  uuid: string
): UseQueryResult<BackendResponse, Error> => {
  return useQuery({
    queryKey: ["getMatriculaByUuid", uuid],
    queryFn: async () => {
      const response = await axios.get<BackendResponse>(
        `http://localhost:3000/pagos/matricula/${uuid}`
      );

      // Reemplazar ruta absoluta por ruta accesible públicamente
      const updatedData = {
        ...response.data,
        data: {
          ...response.data.data,
          url_imagen: response.data.data.url_imagen
            ? response.data.data.url_imagen.replace(
                "/home/andrea/repo/Sistema-de-Matricula-y-Pagos-Escolar/apps/backend/uploads",
                "http://localhost:3000/uploads"
              )
            : undefined,
        },
      };
      console.log("Respuesta del servidor:", updatedData);
      return updatedData;
    },
    enabled: !!uuid,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

//Actualizar comprobante
export const useActualizarEstadoComprobante = () => {
  return useMutation({
    mutationFn: async ({ uuid, estado }: { uuid: string; estado: "Aceptado" | "Rechazado" }) => {
      const res = await axios.patch(`http://localhost:3000/pagos/comprobante/${uuid}`, { estado });
      return res.data;
    },
  });
};