import { useMemo } from "react";
import { useGetReporteFinancieroAnual, useGetReportePagosPendientes } from "../lib/queries";

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

