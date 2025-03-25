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
  ReporteAntiguedadEstudiantes,
  StructureAndData 
} from "@shared/reportsType";
import axios from "axios";

// Hook para matrícula con filtros
type FiltrosMatricula = {
  nombre?: string;
  grado?: string;
  estado?: string;
};

export const useGetReportsMatricula = (
  page: number = 1,
  limit: number = 10,
  filters: FiltrosMatricula = {}
): UseQueryResult<StructureAndData<ReporteMatriculaType>, Error> => {
  return useQuery({
    queryKey: ["getReportsMatricula", page, limit, filters],
    queryFn: async () => {
      const baseUrl = `http://localhost:3000/reportes/matricula`;
      let url = `${baseUrl}?page=${page}&limit=5`;

      if (filters.nombre) url += `&nombre=${encodeURIComponent(filters.nombre)}`;
      if (filters.grado) url += `&grado=${encodeURIComponent(filters.grado)}`;
      if (filters.estado) url += `&estado=${encodeURIComponent(filters.estado)}`;

      const response = await axios.get<StructureAndData<ReporteMatriculaType>>(url);
      console.log(response)
      return response.data;
    },
    staleTime: 1000,
  });
};

// Hook para mensualidad
type FiltrosMensualidad = {
  estudiante?: string;
  grado?: string;
  fecha?: string;
};

export const useGetReporteMensualidad = (
  page: number = 1,
  limit: number = 10,
  filters: FiltrosMensualidad = {}
): UseQueryResult<StructureAndData<ReporteMensualidadType>, Error> => {
  return useQuery({
    queryKey: ["getReporteMensualidad", page, limit, filters],
    queryFn: async () => {
      let url = `http://localhost:3000/reportes/mensualidad?page=${page}&limit=5`;
      if (filters.estudiante) url += `&estudiante=${encodeURIComponent(filters.estudiante)}`;
      if (filters.grado) url += `&grado=${encodeURIComponent(filters.grado)}`;
      if (filters.fecha) url += `&fecha=${encodeURIComponent(filters.fecha)}`;

      const response = await axios.get<StructureAndData<ReporteMensualidadType>>(url);
     
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
     
      const response = await axios.get<StructureAndData<ReporteEstudianteType>>(
        `http://localhost:3000/reportes/estudiante?page=${page}=limit:${limit}${filters.estudiante ? `&estudiante=${filters.estudiante}` : ``}${filters.grado ? `&grado=${filters.grado}` : ``}${filters.estado ? `&estado=${filters.estado}` : ``}`
      );
    
      return response.data;
    }
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
    queryKey: ["getReporteBeca", page, limit, filters],
    queryFn: async () => {
      let url = `http://localhost:3000/reportes/beca`;
      if (filters.nombre_estudiante) url += `&nombre_estudiante=${encodeURIComponent(filters.nombre_estudiante)}`;
      if (filters.grado) url += `&grado=${encodeURIComponent(filters.grado)}`;
      if (filters.tipo_beneficio) url += `&tipo_beneficio=${encodeURIComponent(filters.tipo_beneficio)}`;

      const response = await axios.get<StructureAndData<ReporteBecaType>>(url);
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
      const response = await client.get(`/reportes/retiro-estudiante`);
      return response.data;
    },
    staleTime: 1000,
  });
};

//Hook para antiguedad estudiante
export const useGetAntiguedadEstudiante = (): UseQueryResult<StructureAndData<ReporteAntiguedadEstudiantes>, Error> => {
  return useQuery<StructureAndData<ReporteAntiguedadEstudiantes>, Error>({
    queryKey: ["getReporteAntiguedadEstudiante"],
    queryFn: async () => {
      const response = await client.get(`/reportes/antiguedad-estudiante`);
      return response.data
    }
  })
}
