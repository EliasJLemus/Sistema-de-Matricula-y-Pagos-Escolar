import { ReactNode, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from "@tanstack/react-query";
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

interface QueryProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export const useGetReportsMatricula = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["getReportsMatricula", page, limit],
    queryFn: async (): Promise<StructureAndData<ReporteMatriculaType>> => {
      const response = await client.get(`/reportes/matricula?page=${page}&limit=${limit}`);
      if (!response.data) throw new Error("No se encontraron datos");
      return response.data;
    },
  });
};


export const useGetReporteMensualidad = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["getReporteMensualidad", page, limit],
    queryFn: async (): Promise<StructureAndData<ReporteMensualidadType>> => {
      const response = await client.get(`/reportes/mensualidad?page=${page}&limit=${limit}`);
      if (!response.data) throw new Error("No se encontraron datos");
      return response.data;
    },
  });
};


export const useGetReporteEstudiante = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["getReporteEstudiante", page, limit],
    queryFn: async (): Promise<StructureAndData<ReporteEstudianteType>> => {
      const response = await client.get(`/reportes/estudiante?page=${page}&limit=${limit}`);
      if (!response.data) throw new Error("No se encontraron datos");
      return response.data;
    }
  });
};


export const useGetReporteBeca = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["getReporteBeca", page, limit],
    queryFn: async (): Promise<StructureAndData<ReporteBecaType>> => {
      const response = await client.get(`/reportes/beca?page=${page}&limit=${limit}`);
      if (!response.data) throw new Error("No se encontraron datos");
      return response.data;
    },
  });
};


export const useGetReporteFinancieroAnual = (): UseQueryResult<StructureAndData<ReporteFinancieroAnualType>, Error> => {
  return useQuery({
    queryKey: ["getReporteFinancieroAnual"],
    queryFn: async (): Promise<StructureAndData<ReporteFinancieroAnualType>> => {
      try {
        const response = await client.get("/reportes/financiero-anual");
        if (!response.data) throw new Error("No se encontraron datos en el reporte financiero anual");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useGetReportePagosPendientes = (): UseQueryResult<StructureAndData<ReportePagosPendientesType>, Error> => {
  return useQuery({
    queryKey: ["getReportePagosPendientes"],
    queryFn: async (): Promise<StructureAndData<ReportePagosPendientesType>> => {
      try {
        const response = await client.get("/reportes/pagos-pendientes");
        if (!response.data) throw new Error("No se encontraron datos en el reporte de pagos pendientes");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useGetReporteRetiroEstudiantes = (): UseQueryResult<StructureAndData<ReporteRetiroEstudiantesType>, Error> => {
  return useQuery({
    queryKey: ["getReporteRetiroEstudiantes"],
    queryFn: async (): Promise<StructureAndData<ReporteRetiroEstudiantesType>> => {
      try {
        const response = await client.get("/reportes/retiro-estudiantes");
        if (!response.data) throw new Error("No se encontraron datos en el reporte de retiro de estudiantes");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

type QueryContextType = {
  useGetReportsMatricula: typeof useGetReportsMatricula;
  useGetReporteMensualidad: typeof useGetReporteMensualidad;
  useGetReporteEstudiante: typeof useGetReporteEstudiante;
  useGetReporteBeca: typeof useGetReporteBeca;
  useGetReporteFinancieroAnual: typeof useGetReporteFinancieroAnual;
  useGetReportePagosPendientes: typeof useGetReportePagosPendientes;
  useGetReporteRetiroEstudiantes: typeof useGetReporteRetiroEstudiantes;
};

const QueryContext = createContext<QueryContextType>({
  useGetReportsMatricula,
  useGetReporteMensualidad,
  useGetReporteEstudiante,
  useGetReporteBeca,
  useGetReporteFinancieroAnual,
  useGetReportePagosPendientes,
  useGetReporteRetiroEstudiantes,
});

export const useQueryContext = () => useContext(QueryContext);

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const contextValue = {
    useGetReportsMatricula,
    useGetReporteMensualidad,
    useGetReporteEstudiante,
    useGetReporteBeca,
    useGetReporteFinancieroAnual,
    useGetReportePagosPendientes,
    useGetReporteRetiroEstudiantes,
  };

  return (
    <QueryContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryContext.Provider>
  );
};
