import { ReactNode, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "./client";

// Definimos el tipo de los datos del reporte de matrícula
type ReporteMatricula = {
    nombreEstudiante: string;
    grado: string;
    seccion: string;
    tarifaMatricula: number;
    beneficioAplicado: string;
    descuento: string;
    totalPagar: number;
    estado: string;
    fechaMatricula: string; // Formato 'DD/MM/YYYY'
  };

  type ReporteMensualidad = {
    estudiante: string,
    grado: string,
    descuento: string,
    fecha_inicio: string |  Date,         
    fecha_vencimiento: string | Date,   
    saldo_total: number,
    saldo_pagado: number,
    saldo_pendiente: number,
    recargo: number,
    estado: string
  }

  type ReporteEstudiante = {
    estudiante: string,
    identidad: string,
    genero: string,
    alergias: string | null,
    zurdo: "Sí" | "No",
    grado: string,
    estado: string,
    plan_pago: string,
    encargado: string | null,
    parentesco: string | null,
    telefono: string | null
  }


// Definimos los props del provider
interface QueryProviderProps {
  children: ReactNode;
}

// Creamos el `QueryClient` para manejar la caché y las consultas
const queryClient = new QueryClient();

// Hook personalizado para obtener los reportes de matrícula
export const useGetReportsMatricula = (): UseQueryResult<ReporteMatricula[], Error> => {
  return useQuery({
    queryKey: ["getReportsMatricula"],
    queryFn: async (): Promise<ReporteMatricula[]> => {
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

export const useGetReporteMensualidad = (): UseQueryResult<ReporteMensualidad[], Error> => {
  return useQuery({
    queryKey: ["getReporteMensualidad"],
    queryFn: async (): Promise<ReporteMensualidad[]> => {
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

export const useGetReporteEstudiante = (): UseQueryResult<ReporteEstudiante[], Error> => {
  return useQuery({
    queryKey: ["getReporteEstdiante"],
    queryFn: async (): Promise<ReporteEstudiante[]> => {
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

// Creamos el contexto con un valor por defecto apropiado
type QueryContextType = {
  useGetReportsMatricula: typeof useGetReportsMatricula,
  useGetReporteMensualidad: typeof useGetReporteMensualidad;
};

const QueryContext = createContext<QueryContextType>({
  useGetReportsMatricula,
  useGetReporteMensualidad
});

//  Hook para usar el contexto
export const useQueryContext = () => useContext(QueryContext);

// Componente `QueryProvider` para proveer React Query
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // Valor que se proveerá en el contexto
  const contextValue = {
    useGetReportsMatricula,
    useGetReporteMensualidad
    
  };

  return (
    <QueryContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryContext.Provider>
  );
};