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
  const { data, isLoading } = useGetReportePagosPendientes(1, 10); // Example: page = 1, limit = 10

  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.grado,
      promedioDeuda: item.promedio_deuda_moroso,
      deudaTotal: item.deuda_total,
    }));
  }, [data]);

  return { chartData, isLoading };
};

export const useRetirosChartData = () => {
  const { data, isLoading } = useGetReporteRetiroEstudiantes();
  console.log("data", data);
  const chartDataRetiro = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.nivel,
      estudiantesActivos: Number(item.estudiantes_activos),
      estudiantesRetirados: Number(item.estudiantes_retirados),
      tasaRetiro: item.tasa_retiro
        ? parseFloat(item.tasa_retiro.toString().replace("%", ""))
        : 0,
    }));
  }, [data]);

  return { chartDataRetiro, data, isLoading };
};