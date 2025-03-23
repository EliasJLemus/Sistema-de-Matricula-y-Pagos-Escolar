import { ReactNode, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "./client";
import {ReporteMatricula, 
  ReporteMensualidad, 
  ReporteEstudiante,
  ReporteBeca,
  StructureAndData} from "@shared/reportsType";


// Definimos los props del provider
interface QueryProviderProps {
  children: ReactNode;
}

// Creamos el `QueryClient` para manejar la caché y las consultas
const queryClient = new QueryClient();

// Hook personalizado para obtener los reportes de matrícula
export const useGetReportsMatricula = (): UseQueryResult<StructureAndData<ReporteMatricula>, Error> => {
  return useQuery({
    queryKey: ["getReportsMatricula"],
    queryFn: async (): Promise<StructureAndData<ReporteMatricula>> => {
      try {
        const response = await client.get("/reportes/matricula");
        if (!response.data) throw new Error("No se encontraron datos en el reporte de matrícula");
        return response.data;
      } catch (e) {
        throw e;
      }
    },
  });
};

export const useGetReporteMensualidad = (): UseQueryResult<StructureAndData<ReporteMensualidad>, Error> => {
  return useQuery({
    queryKey: ["getReporteMensualidad"],
    queryFn: async (): Promise<StructureAndData<ReporteMensualidad>> => {
      try {
        const response = await client.get("/reportes/mensualidad");
        if (!response.data) throw new Error("No se encontraron datos en el reporte de mensualidad");
        return response.data;
      } catch (e) {
        throw e;
      }
    },
  });
}

export const useGetReporteEstudiante = (): UseQueryResult<StructureAndData<ReporteEstudiante>, Error> => {
  return useQuery({
    queryKey: ["getReporteEstdiante"],
    queryFn: async (): Promise<StructureAndData<ReporteEstudiante>> => {
      try{
        const response = await client.get("/reportes/estudiante");
        if(!response.data) throw new Error("No se encontraron datos en el reporte de estudiantes");

        return response.data;
      }catch(error){
        throw error
      }
    } 
  })
}

export const useGetReporteBeca = (): UseQueryResult<StructureAndData<ReporteBeca>, Error> => {
  return useQuery({
    queryKey: ["getReporteBeca"],
    queryFn: async (): Promise<StructureAndData<ReporteBeca>> => {
      try{
        const response = await client.get("/reportes/beca");
        if(!response.data) throw new Error("No se encontraron datos en el reporte de becas");

        return response.data;
      }catch(error){
        throw error
      }
    } 
  })
} 

// Creamos el contexto con un valor por defecto apropiado
type QueryContextType = {
  useGetReportsMatricula: typeof useGetReportsMatricula,
  useGetReporteMensualidad: typeof useGetReporteMensualidad;
  useGetReporteEstudiante: typeof useGetReporteEstudiante;
  useGetReporteBeca: typeof useGetReporteBeca;
};

const QueryContext = createContext<QueryContextType>({
  useGetReportsMatricula,
  useGetReporteMensualidad,
  useGetReporteEstudiante,
  useGetReporteBeca,
});

//  Hook para usar el contexto
export const useQueryContext = () => useContext(QueryContext);

// Componente `QueryProvider` para proveer React Query
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // Valor que se proveerá en el contexto
  const contextValue = {
    useGetReportsMatricula,
    useGetReporteMensualidad,
    useGetReporteEstudiante,
    useGetReporteBeca,
  };

  return (
    <QueryContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryContext.Provider>
  );
};