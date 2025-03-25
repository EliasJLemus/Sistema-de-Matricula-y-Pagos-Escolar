import { useMemo } from "react";
import { useGetReporteFinancieroAnual, useGetReportePagosPendientes, useGetReporteRetiroEstudiantes } from "../lib/queries";

export const useChartData = () => {
  const { data, isLoading } = useGetReporteFinancieroAnual();

  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      type: item.tipo_pago,
      income: item.ingresos,
      debt: item.deudas_por_cobrar,
    }));
  }, [data]);

  return { chartData, data, isLoading };
};

export const usePagosPendientesChartData = () => {
  const { data, isLoading } = useGetReportePagosPendientes();

  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.grado,
      promedioDeuda: item.promedio_deuda_por_estudiante,
      deudaTotal: item.deuda_total_del_grado,
    }));
  }, [data]);

  return { chartData, isLoading };
};

export const useRetirosChartData = () => {
  const { data, isLoading } = useGetReporteRetiroEstudiantes();

  const chartDataRetiro = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.grado,
      estudiantesActivos: Number(item.estudiantes_activos),
      estudiantesRetirados: Number(item.estudiantes_retirados),
      tasaRetiro: parseFloat(item.tasa_retiro.replace("%", "")), // Convertir porcentaje string a número
    }));
  }, [data]);

  return { chartDataRetiro, data, isLoading };
};
