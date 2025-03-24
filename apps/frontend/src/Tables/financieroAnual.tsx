"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { useChartData } from "../hooks/useChartData";

export const FinancieroAnualTable: React.FC = () => {
  const { chartData, data, isLoading } = useChartData();

  if (isLoading || !data || !data.columns || !data.data) {
    return <div>Cargando...</div>;
  }

  return (
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
                  <TableCell>{row.tipo_pago}</TableCell>
                  <TableCell>$ {row.ingresos}</TableCell>
                  <TableCell>$ {row.deudas_por_cobrar}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Reporte Financiero Anual de Ingreso VS Deudas por cobrar - Gráfica</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Ingresos ($)"
                  stroke="hsl(var(--chart-1))"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="debt" name="Deudas ($)" stroke="hsl(var(--chart-2))" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">Total registros: {data.data.length}</div>
        </CardFooter>
      </Card>
    </div>
  );
};
