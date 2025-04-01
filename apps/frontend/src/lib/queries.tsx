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
  StructureAndData,
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
        if (filters.fecha) params.append("fecha", filters.fecha);

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
export const useGetReportePagosPendientes = (): UseQueryResult<StructureAndData<ReportePagosPendientesType>, Error> => {
  return useQuery({
    queryKey: ["getReportePagosPendientes"],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/pagos-pendientes`);
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
export const useGetAntiguedadEstudiante = (): UseQueryResult<StructureAndData<ReporteAntiguedadEstudiantes>, Error> => {
  return useQuery({
    queryKey: ["getReporteAntiguedadEstudiante"],
    queryFn: async () => {
      try {
        const response = await client.get(`/reportes/antiguedad-estudiante`);
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Error al obtener reporte de antigüedad de estudiantes");
      }
    },
    staleTime: 1000,
  });
};