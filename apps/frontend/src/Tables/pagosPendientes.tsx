"use client"

import { useGetReportePagosPendientes } from "../lib/queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const PagosPendientesTable: React.FC = () => {
  const { data } = useGetReportePagosPendientes();

  
  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.grado,
      totalDeudas: item.total_deudas,
      promedioDeuda: item.promedio_deuda_por_estudiante,
      deudaTotal: item.deuda_total_del_grado,
    }));
  }, [data]);

  return data && data.columns && data.data ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {data.title}
          </h2>
          <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: 03/09/2025</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                {data.columns.map((col) => (
                  <TableHead key={col.name}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.grado}</TableCell>
                  <TableCell>{row.total_deudas}</TableCell>
                  <TableCell>$ {row.promedio_deuda_por_estudiante}</TableCell>
                  <TableCell>$ {row.deuda_total_del_grado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Promedio y Total de Deuda por Grado</h3>
            <ChartContainer
              config={{
                promedioDeuda: {
                  label: "Promedio de Deuda por Estudiante",
                  color: "hsl(var(--chart-1))",
                },
                deudaTotal: {
                  label: "Deuda Total del Grado",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grado" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="promedioDeuda" fill="var(--color-promedioDeuda)" name="Promedio" />
                  <Bar dataKey="deudaTotal" fill="var(--color-deudaTotal)" name="Total" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">Total registros: {data.data.length}</div>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div>Cargando...</div>
  );
};
