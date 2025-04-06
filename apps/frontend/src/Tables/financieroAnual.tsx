"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { useChartData } from "../hooks/useChartData";
import * as pdfUtils from "@/utils/pdfutils";

export const FinancieroAnualTable: React.FC = () => {
  const { chartData, data, isLoading } = useChartData();

  if (isLoading || !data || !data.columns || !data.data) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1363]">  
            {data.title}
          </h2>
          <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: {new Date().toLocaleDateString()}</p>
        </div>
        <Button 
          onClick={() => pdfUtils.generatePDF(data.title, data.columns, data.data)}
          className="bg-[#1A1363] hover:bg-[#13104d] text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-[#0c0a33] active:shadow-inner flex items-center gap-2 hover:-translate-y-1 hover:scale-[1.02] transform-gpu group"
          style={{
            boxShadow: '0px 4px 10px rgba(26, 19, 99, 0.3)',
            willChange: 'transform'
          }}
        >
          <Download className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span className="transition-all duration-200">Descargar</span>
        </Button>
      </div>

      {/* Tabla */}
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
                    <TableCell className="text-[#4D4D4D] border-0">{row.tipo_pago}</TableCell>
                    <TableCell className="text-[#4D4D4D] border-0">$ {row.ingresos}</TableCell>
                    <TableCell className="text-[#4D4D4D] border-0">$ {row.deudas_por_cobrar}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>

        {!data.data.length && (
          <div className="p-6 text-center text-muted-foreground rounded-b-lg border border-t-0 border-[#edad4c]">
            No se encontraron registros para los filtros aplicados.
          </div>
        )}
      </Card>

      {/* Gráfico */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Reporte Financiero Anual de Ingreso VS Deudas por cobrar - Gráfica</h3>
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Contenedor con sombreado */}
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              style={{
                filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))' /* Sombreado suave */
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip 
                wrapperStyle={{
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Ingresos ($)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="debt" 
                name="Deudas ($)" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CardFooter>
        <div className="text-sm text-muted-foreground">Total registros: {data.data.length}</div>
      </CardFooter>
    </div>
  );
};