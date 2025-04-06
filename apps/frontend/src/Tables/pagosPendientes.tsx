"use client"

import { useGetReportePagosPendientes } from "../lib/queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import * as pdfUtils from "@/utils/pdfutils";

export const PagosPendientesTable: React.FC = () => {
  const { data } = useGetReportePagosPendientes();

  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
      grado: item.grado,
      totalDeudas: item.deuda_total,
      promedioDeuda: item.promedio_deuda_moroso,
      deudaTotal: item.porcentaje_morosidad,
    }));
  }, [data]);

  return data && data.columns && data.data ? (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1363]">
            {data.title}
          </h2>
          <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: {new Date().toLocaleDateString()}</p>
        </div>
        <Button 
          onClick={() => pdfUtils.generatePDF(data.title, data.columns, data.data)}
          className="bg-[#1A1363] hover:bg-[#13104d] text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-[#0c0a33] active:shadow-inner flex items-center gap-2 hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
          style={{
            boxShadow: '0px 4px 10px rgba(26, 19, 99, 0.3)',
            willChange: 'transform'
          }}
        >
          <Download className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span className="transition-all duration-200">Descargar</span>
        </Button>
      </div>

      {/* Tabla con borde redondeado completo */}
      <Card className="border-0 shadow-none">
        <div className="overflow-hidden rounded-lg border border-[#edad4c]">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#edad4c]">
                <TableRow>
                  {data.columns.map((col) => (
                    <TableHead
                      key={col.name}
                      className="text-white border-0 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"
                    } border-0`}
                  >
                    <TableCell className="text-[#4D4D4D] border-0">{row.grado}</TableCell>
                    <TableCell className="text-[#4D4D4D] border-0">{row.deuda_total}</TableCell>
                    <TableCell className="text-[#4D4D4D] border-0">$ {row.promedio_deuda_moroso}</TableCell>
                    <TableCell className="text-[#4D4D4D] border-0">$ {row.porcentaje_morosidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>

        {/* Mensaje cuando no hay datos */}
        {!data.data.length && (
          <div className="p-6 text-center text-muted-foreground rounded-b-lg border border-t-0 border-[#edad4c]">
            No se encontraron registros para los filtros aplicados.
          </div>
        )}
      </Card>

      {/* Gráfico */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-center">Promedio y Total de Deuda por Grado</h3>
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Contenedor con sombreado */}
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
            className="h-[400px] mx-auto" /* mx-auto para centrar */
          >
            <ResponsiveContainer width="100%" height={400}>
              <RechartsBarChart 
                data={chartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{
                  filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))' /* Sombreado suave */
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} /> {/* Quité las líneas verticales */}
                <XAxis dataKey="grado" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  wrapperStyle={{
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}
                />
                <Bar 
                  dataKey="promedioDeuda" 
                  fill="var(--color-promedioDeuda)" 
                  name="Promedio" 
                  radius={[4, 4, 0, 0]} /* Esquinas redondeadas en las barras */
                />
                <Bar 
                  dataKey="deudaTotal" 
                  fill="var(--color-deudaTotal)" 
                  name="Total" 
                  radius={[4, 4, 0, 0]} /* Esquinas redondeadas en las barras */
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  ) : (
    <div>Cargando...</div>
  );
};