"use client";

import { ReportTable } from "@/components/Tables/Table";
import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { useMemo } from "react";
import { useChartData } from "../hooks/useChartData";
import { StructureColumn, ReporteFinancieroAnualType } from "@shared/reportsType";

const columns: StructureColumn<ReporteFinancieroAnualType>[] = [
  { name: "tipo_pago", label: "Tipo de Pago" },
  { name: "ingresos", label: "Ingresos" },
  { name: "deudas_por_cobrar", label: "Deudas por Cobrar" },
];

export const FinancieroAnualTable: React.FC = () => {
  const { chartData, data, isLoading } = useChartData();

  const formattedChartData = useMemo(() => {
    return chartData.map((item) => ({
      type: item.type,
      income: Number(item.income),
      debt: Number(item.debt),
    }));
  }, [chartData]);

  if (isLoading || !data || !data.columns || !data.data) {
    return <div className="text-sm text-muted-foreground">Cargando reporte...</div>;
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1363]">
            {data.title}
          </h2>
          <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: 03/09/2025</p>
        </div>
      </div> */}

      <ReportTable<ReporteFinancieroAnualType>
        title={data.title}
        columns={columns}
        data={data.data}
      />

      <div className="bg-white rounded-xl p-6 shadow-md border">
        <h3 className="text-lg font-semibold text-[#1A1363] mb-4">
          Reporte Financiero Anual de Ingresos vs Deudas por Cobrar
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={formattedChartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid stroke="#d1d5db" strokeDasharray="4 4" />
            <XAxis
              dataKey="type"
              tick={{ fill: "#1f2937", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4b5563", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value) => (
                <span style={{ fontWeight: 500, color: value === "Ingresos ($)" ? "#16a34a" : "#b91c1c" }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Ingresos ($)"
              stroke="#136632"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="debt"
              name="Deudas ($)"
              stroke="#812222ba"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
