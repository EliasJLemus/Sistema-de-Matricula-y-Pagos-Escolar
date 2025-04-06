"use client";

import { useGetReportePagosPendientes } from "../lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { ResponsiveContainer, CartesianGrid, Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { useMemo, useState } from "react";
import { StructureColumn, ReportePagosPendientesType } from "@shared/reportsType";

const columns: StructureColumn<ReportePagosPendientesType>[] = [
  { name: "grado", label: "Grado" },
  { name: "estudiantes_morosos", label: "Cantidad Morosos" },
  { name: "total_estudiantes", label: "Total Estudiantes en el Grado" },
  { name: "porcentaje_morosidad", label: "Porcentaje Morosidad" },
  { name: "deuda_total", label: "Deuda Total" },
  { name: "promedio_deuda_moroso", label: "Promedio Deuda Moroso" },
];

export const PagosPendientesTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data } = useGetReportePagosPendientes(page, limit);
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const chartData = useMemo(() => {
    return data?.data.map((item) => ({
      grado: item.grado,
      porcentaje: parseFloat(item.porcentaje_morosidad ?? "0"),
    })) ?? [];
  }, [data]);

  return data ? (
    <div className="space-y-6">
      {/* Tabla primero */}
      <ReportTable<ReportePagosPendientesType>
        title={data.title}
        columns={columns}
        data={data.data}
        pagination={{
          page,
          pageCount,
          onNext: () => setPage((p) => Math.min(p + 1, pageCount)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          onPageChange: (newPage) => setPage(newPage),
        }}
      />

      {/* Luego la gráfica */}
      <div className="bg-white rounded-xl p-6 shadow-md border">
        <h3 className="text-lg font-semibold text-[#1A1363] mb-4">
          Porcentaje de Morosidad por Grado
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="grado"
              type="category"
              tick={{ fill: "#6b7280", fontSize: 13 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Porcentaje"]}
              labelStyle={{ fontWeight: 500 }}
            />
            <Bar
              dataKey="porcentaje"
              fill="hsl(var(--chart-1))"
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">Cargando reporte...</div>
  );
};
