"use client";

import { useGetReportePagosPendientes } from "../lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegendContent,
} from "@/components/ui/chart";
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
    return (
      data?.data.map((item) => {
        const porcentajeMorosos = parseFloat(item.porcentaje_morosidad ?? "0");
        return {
          grado: item.grado,
          morosos: porcentajeMorosos,
          noMorosos: 100 - porcentajeMorosos,
        };
      }) ?? []
    );
  }, [data]);

  return data ? (
    <div className="space-y-6">
      {/* Tabla */}
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

      {/* Gráfica */}
      <div className="bg-white rounded-xl p-6 shadow-md border">
        <h3 className="text-lg font-semibold text-[#1A1363] mb-4">
          Porcentaje de Morosidad por Grado
        </h3>

        <ChartContainer
          className="h-[500px]"
          config={{
            morosos: { label: "Morosos", color: "#fbbf24",  },
            noMorosos: { label: "No morosos", color: "#a7f3d0" },
          }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 70, bottom: 20 }}
            barCategoryGap="15%"
          >
            <CartesianGrid stroke="#87898b76" strokeWidth={1.5} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#4b5563", fontSize: 12 }}
              axisLine={{ stroke: "#9ca3af", strokeWidth: 1.5 }}
              tickLine={{ stroke: "#9ca3af", strokeWidth: 1.5 }}
            />
            <YAxis
              dataKey="grado"
              type="category"
              tick={{ fill: "#1f2937", fontSize: 13 }}
              width={110}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegendContent />
            <Bar
              dataKey="morosos"
              name="Morosos"
              fill="#fbbf24"
              barSize={42}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="noMorosos"
              name="No morosos"
              fill="#a7f3d0"
              barSize={42}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">Cargando reporte...</div>
  );
};
