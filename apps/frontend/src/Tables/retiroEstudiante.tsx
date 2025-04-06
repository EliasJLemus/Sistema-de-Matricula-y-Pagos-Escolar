"use client";

import { ReportTable } from "@/components/Tables/Table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { useRetirosChartData } from "@/hooks/useChartData";
import { StructureColumn, ReporteRetiroEstudiantesType } from "@shared/reportsType";

const columns: StructureColumn<ReporteRetiroEstudiantesType>[] = [
  { name: "nivel", label: "Nivel" },
  { name: "estudiantes_activos", label: "Estudiantes Activos" },
  { name: "estudiantes_retirados", label: "Estudiantes Retirados" },
  { name: "tasa_retiro", label: "Tasa de Retiro (%)" },
];

export const RetirosTable: React.FC = () => {
  const { chartDataRetiro, data } = useRetirosChartData();

  return data && data.columns && data.data ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          <p className="text-muted-foreground">
            No. Reporte 010109 | Fecha de emisión: 03/09/2025
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Tabla con diseño estilizado */}
          <ReportTable<ReporteRetiroEstudiantesType>
            title=""
            columns={columns}
            data={data.data}
          />

          {/* Gráfica sin modificar */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Reporte de Retiro de Estudiantes - Gráfica
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartDataRetiro}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grado" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="estudiantesRetirados"
                  fill="hsl(var(--chart-1))"
                  name="Estudiantes Retirados"
                />
                <Bar
                  dataKey="estudiantesActivos"
                  fill="hsl(var(--chart-2))"
                  name="Estudiantes Activos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total registros: {data.data.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">Cargando reporte...</div>
  );
};
