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
import axios from "axios";

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
  limit: number = 10,
  filters: { estudiante?: string; grado?: string; fecha?: string } = {}
): UseQueryResult<StructureAndData<ReporteMensualidadType>, Error> => {
  return useQuery<StructureAndData<ReporteMensualidadType>, Error>({
    queryKey: ["getReporteMensualidad", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.append(key, value);
        }
      });
      const response = await client.get(`http://localhost:3000/reportes/mensualidad?${params.toString()}`);
      return response.data;
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
) => {
  return useQuery({
  
    queryKey: ["reporteEstudiante", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (filters.estudiante) params.append("estudiante", filters.estudiante);
      if (filters.grado) params.append("grado", filters.grado);
      if (filters.estado) params.append("estado", filters.estado);
      console.log(params)
      const response = await axios.get<StructureAndData<ReporteEstudianteType>>(
        `http://localhost:3000/reportes/estudiante?page:${page}&limit:${limit}${filters.estudiante ? `&estudiante=${filters.estudiante}` : ``}${filters.grado ? `&grado=${filters.grado}` : ``}${filters.estado ? `&estado=${filters.estado}` : ``}`
      );
      console.log(response.data)
      return response.data;
    }
  });
};


// Hook para becas
export const useGetReporteBeca = (
  page: number = 1,
  limit: number = 10,
  filters: { nombre_estudiante?: string; grado?: string; tipo_beneficio?: string } = {}
): UseQueryResult<StructureAndData<ReporteBecaType>, Error> => {
  return useQuery<StructureAndData<ReporteBecaType>, Error>({
    queryKey: ["getReporteBeca", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.append(key, value);
        }
      });
      const response = await client.get(`/reportes/beca?${params.toString()}`);
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
