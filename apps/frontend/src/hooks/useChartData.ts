import { useMemo } from "react";
import { useGetReporteFinancieroAnual } from "../lib/queries";

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
