"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  DollarSign,
  Download,
  GraduationCap,
  LineChart,
  PieChart,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { MatriculaTable } from "@/Tables/matriculas";
import { MensualidadTable } from "@/Tables/mensualidad";
import { EstudianteTable } from "@/Tables/estudiantes";
import { BecaTable } from "@/Tables/becas";
import { FinancieroAnualTable } from "@/Tables/financieroAnual";
import { PagosPendientesTable } from "@/Tables/pagosPendientes";
import { useChartData, useRetirosChartData } from "@/hooks/useChartData";
import { useGetReportePagosPendientes } from "@/lib/queries";
import { RetirosTable } from "@/Tables/retiroEstudiante";
import { AntiguedadEstudianteTable } from "@/Tables/antiguedadEstudiante";

export default function Dashboard() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const { chartData, isLoading } = useChartData();
  const { data: pagosPendientesData, isLoading: isLoadingPagos } = useGetReportePagosPendientes();
  const { chartDataRetiro, isLoading: isLoadingRetiros } = useRetirosChartData();

  const handleBackToDashboard = () => {
    setActiveReport(null);
  };

  if (!activeReport) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="financial">Financiero</TabsTrigger>
              <TabsTrigger value="students">Estudiantes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">620</div>
                    <p className="text-xs text-muted-foreground">+5% desde el año pasado</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">L. 68,495</div>
                    <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deudas por Cobrar</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">L. 230,865</div>
                    <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasa de Retiro</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.6%</div>
                    <p className="text-xs text-muted-foreground">-0.5% desde el año pasado</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Reporte Financiero */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Reporte Financiero Anual</CardTitle>
                    <CardDescription>Ingresos vs Deudas por Cobrar</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {isLoading ? (
                      <div className="h-[350px] flex items-center justify-center">Cargando...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="income"
                            name="Ingresos (L)"
                            stroke="hsl(var(--chart-1))"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="debt" name="Deudas (L)" stroke="hsl(var(--chart-2))" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("financial")}>
                      Ver Reporte Completo
                    </Button>
                  </CardFooter>
                </Card>

                {/* Retiro de Estudiantes */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Retiro de Estudiantes</CardTitle>
                    <CardDescription>Estudiantes activos vs retirados</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {isLoadingRetiros ? (
                      <div className="h-[350px] flex items-center justify-center">Cargando...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart
                          data={chartDataRetiro}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="grado" type="category" width={100} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="estudiantesActivos" fill="hsl(var(--chart-1))" name="Activos" />
                          <Bar dataKey="estudiantesRetirados" fill="hsl(var(--chart-2))" name="Retirados" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("attrition")}>
                      Ver Reporte Completo
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Pagos Pendientes */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle>Pagos Pendientes</CardTitle>
                      <CardDescription>Promedio de deuda por estudiante</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => setActiveReport("outstanding")}
                    >
                      Ver todo
                    </Button>
                  </CardHeader>
                  <CardContent className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grado</TableHead>
                          <TableHead>Promedio de Deuda</TableHead>
                          <TableHead>Deuda Total</TableHead>
                          <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingPagos ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">Cargando...</TableCell>
                          </TableRow>
                        ) : pagosPendientesData && pagosPendientesData.data && pagosPendientesData.data.length > 0 ? (
                          pagosPendientesData.data.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.grado}</TableCell>
                              <TableCell>L. {Number(item.promedio_deuda_por_estudiante).toFixed(2)}</TableCell>
                              <TableCell>L. {Number(item.deuda_total_del_grado).toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant={item.promedio_deuda_por_estudiante > 2000 ? "destructive" : "outline"}>
                                  {item.promedio_deuda_por_estudiante > 2000 ? "Alto" : "Normal"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">Sin datos</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reportes Disponibles</CardTitle>
                    <CardDescription>Acceso rápido a todos los reportes</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => setActiveReport("student")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Reporte de Estudiante
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveReport("tuition")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Reporte de Matrícula
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveReport("monthly")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reporte de Mensualidades
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveReport("discounts")}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Reporte de Descuentos y Becas
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveReport("seniority")}>
                      <Users className="mr-2 h-4 w-4" />
                      Reporte de Antigüedad
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // Render individual reports
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Sunny Path Bilingual School</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        {activeReport === "student" && <EstudianteTable />}
        {activeReport === "tuition" && <MatriculaTable />}
        {activeReport === "monthly" && <MensualidadTable />}
        {activeReport === "discounts" && <BecaTable />}
        {activeReport === "outstanding" && <PagosPendientesTable />}
        {activeReport === "financial" && (
          <div className="space-y-4">
            <FinancieroAnualTable />
          </div>
        )}
        {activeReport === "attrition" && (
          <RetirosTable />
        )}
        {activeReport === "seniority" && <AntiguedadEstudianteTable/>}
      </main>
    </div>
  );
}
