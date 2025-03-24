import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "./client";
import { 
  ReporteMatriculaType, 
  ReporteMensualidadType,
  ReporteEstudianteType,
  ReporteBecaType,
  ReporteFinancieroAnualType,
  ReportePagosPendientesType,
  ReporteRetiroEstudiantesType,
  StructureAndData 
} from "@shared/reportsType";

// Hook para matrícula con filtros
export const useGetReportsMatricula = (
  page: number = 1,
  limit: number = 10,
  filters: { nombre?: string; grado?: string; estado?: string } = {}
): UseQueryResult<StructureAndData<ReporteMatriculaType>, Error> => {
  return useQuery<StructureAndData<ReporteMatriculaType>, Error>({
    queryKey: ["getReportsMatricula", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      // Solo agregamos filtros que tengan valor
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.append(key, value);
        }
      });
      const response = await client.get(`/reportes/matricula?${params.toString()}`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para mensualidad
export const useGetReporteMensualidad = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<StructureAndData<ReporteMensualidadType>, Error> => {
  return useQuery<StructureAndData<ReporteMensualidadType>, Error>({
    queryKey: ["getReporteMensualidad", page, limit],
    queryFn: async () => {
      const response = await client.get(`/reportes/mensualidad?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para estudiantes
export const useGetReporteEstudiante = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<StructureAndData<ReporteEstudianteType>, Error> => {
  return useQuery<StructureAndData<ReporteEstudianteType>, Error>({
    queryKey: ["getReporteEstudiante", page, limit],
    queryFn: async () => {
      const response = await client.get(`/reportes/estudiante?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para becas
export const useGetReporteBeca = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<StructureAndData<ReporteBecaType>, Error> => {
  return useQuery<StructureAndData<ReporteBecaType>, Error>({
    queryKey: ["getReporteBeca", page, limit],
    queryFn: async () => {
      const response = await client.get(`/reportes/beca?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para reporte financiero anual
export const useGetReporteFinancieroAnual = (): UseQueryResult<StructureAndData<ReporteFinancieroAnualType>, Error> => {
  return useQuery<StructureAndData<ReporteFinancieroAnualType>, Error>({
    queryKey: ["getReporteFinancieroAnual"],
    queryFn: async () => {
      const response = await client.get(`/reportes/financiero-anual`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para pagos pendientes
export const useGetReportePagosPendientes = (): UseQueryResult<StructureAndData<ReportePagosPendientesType>, Error> => {
  return useQuery<StructureAndData<ReportePagosPendientesType>, Error>({
    queryKey: ["getReportePagosPendientes"],
    queryFn: async () => {
      const response = await client.get(`/reportes/pagos-pendientes`);
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para retiro de estudiantes
export const useGetReporteRetiroEstudiantes = (): UseQueryResult<StructureAndData<ReporteRetiroEstudiantesType>, Error> => {
  return useQuery<StructureAndData<ReporteRetiroEstudiantesType>, Error>({
    queryKey: ["getReporteRetiroEstudiantes"],
    queryFn: async () => {
      const response = await client.get(`/reportes/retiro-estudiantes`);
      return response.data;
    },
    staleTime: 1000,
  });
};
