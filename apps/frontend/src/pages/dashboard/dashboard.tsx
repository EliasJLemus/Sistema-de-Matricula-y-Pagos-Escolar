"use client"

import { useState } from "react"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  DollarSign,
  Download,
  GraduationCap,
  LineChart,
  PieChart,
  Search,
  Users,
} from "lucide-react"
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
} from "recharts"

import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function Dashboard() {
  const [activeReport, setActiveReport] = useState<string | null>(null)

  const handleBackToDashboard = () => {
    setActiveReport(null)
  }

  // Sample data for charts
  const outstandingPaymentsData = [
    { grade: "Primero", averageDebt: 2006.67, totalDebt: 6020 },
    { grade: "Segundo", averageDebt: 1725, totalDebt: 5175 },
  ]

  const financialReportData = [
    { type: "Matrículas", income: 27800, debt: 5865 },
    { type: "Mensualidades", income: 29500, debt: 22500 },
    { type: "Nivelados", income: 11195, debt: 202500 },
  ]

  const studentAttritionData = [
    { level: "Pre-básica", active: 120, retired: 8, rate: "7%" },
    { level: "Básica", active: 280, retired: 8.4, rate: "2.01%" },
    { level: "Secundaria", active: 220, retired: 12.7, rate: "5.8%" },
  ]

  // Dashboard content
  if (!activeReport) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Sunny Path Bilingual School</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar reportes..." className="w-64 pl-8" />
            </div>
            <Select defaultValue="2025">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Fecha de emisión: 03/09/2025</p>
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
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Reporte Financiero Anual</CardTitle>
                    <CardDescription>Ingresos vs Deudas por Cobrar</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <RechartsLineChart data={financialReportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("financial")}>
                      Ver Reporte Completo
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Retiro de Estudiantes</CardTitle>
                    <CardDescription>Estudiantes activos vs retirados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        active: {
                          label: "Estudiantes Activos",
                          color: "hsl(var(--chart-1))",
                        },
                        retired: {
                          label: "Estudiantes Retirados",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="aspect-[4/3]"
                    >
                      <RechartsBarChart
                        data={studentAttritionData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="level" type="category" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="active" fill="var(--color-active)" name="Activos" />
                        <Bar dataKey="retired" fill="var(--color-retired)" name="Retirados" />
                      </RechartsBarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("attrition")}>
                      Ver Reporte Completo
                    </Button>
                  </CardFooter>
                </Card>
              </div>

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
                  <CardContent>
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
                        {outstandingPaymentsData.map((item) => (
                          <TableRow key={item.grade}>
                            <TableCell className="font-medium">{item.grade}</TableCell>
                            <TableCell>L. {item.averageDebt.toFixed(2)}</TableCell>
                            <TableCell>L. {item.totalDebt.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={item.averageDebt > 2000 ? "destructive" : "outline"}>
                                {item.averageDebt > 2000 ? "Alto" : "Normal"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
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

            <TabsContent value="financial" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos por Matrículas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">L. 27,800</div>
                    <p className="text-sm text-muted-foreground">Deudas por cobrar: L. 5,865</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("tuition")}>
                      Ver Reporte de Matrícula
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos por Mensualidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">L. 29,500</div>
                    <p className="text-sm text-muted-foreground">Deudas por cobrar: L. 22,500</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("monthly")}>
                      Ver Reporte de Mensualidades
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos por Nivelados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">L. 11,195</div>
                    <p className="text-sm text-muted-foreground">Deudas por cobrar: L. 202,500</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("financial")}>
                      Ver Reporte Financiero
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reporte Financiero Anual</CardTitle>
                  <CardDescription>Ingresos vs Deudas por Cobrar</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={financialReportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveReport("financial")}>
                    Ver Reporte Completo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Estudiantes Matriculados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">620</div>
                    <p className="text-sm text-muted-foreground">+5% desde el año pasado</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("tuition")}>
                      Ver Reporte de Matrícula
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Estudiantes con Becas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-sm text-muted-foreground">6.8% del total de estudiantes</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("discounts")}>
                      Ver Reporte de Becas
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Estudiantes Retirados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">29</div>
                    <p className="text-sm text-muted-foreground">4.6% tasa de retiro</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveReport("attrition")}>
                      Ver Reporte de Retiro
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Retiro de Estudiantes</CardTitle>
                  <CardDescription>Estudiantes activos vs retirados por nivel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      active: {
                        label: "Estudiantes Activos",
                        color: "hsl(var(--chart-1))",
                      },
                      retired: {
                        label: "Estudiantes Retirados",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <RechartsBarChart data={studentAttritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="active" fill="var(--color-active)" name="Activos" />
                      <Bar dataKey="retired" fill="var(--color-retired)" name="Retirados" />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveReport("attrition")}>
                    Ver Reporte Completo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }

  // Individual report views
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
        {activeReport === "tuition" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Matrícula 2025</h2>
                <p className="text-muted-foreground">No. Reporte 01011 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Nombre" className="w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinder">Kinder</SelectItem>
                    <SelectItem value="primero">Primero</SelectItem>
                    <SelectItem value="segundo">Segundo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagado">Pagado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre de estudiante</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Tarifa de matrícula</TableHead>
                      <TableHead>Beneficio aplicado</TableHead>
                      <TableHead>Descuento</TableHead>
                      <TableHead>Total a Pagar</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de matrícula</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Abigail Lopez</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>Ninguno</TableCell>
                      <TableCell>Cero</TableCell>
                      <TableCell>5000.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Pagado
                        </Badge>
                      </TableCell>
                      <TableCell>01/05/2025</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Anna Mejia</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>Beca</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Pagado
                        </Badge>
                      </TableCell>
                      <TableCell>01/05/2025</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Berenice Corrales</TableCell>
                      <TableCell>Primero</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>Descuento hermanos</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>3750.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                        >
                          Pendiente
                        </Badge>
                      </TableCell>
                      <TableCell>01/07/2025</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Carlos Lopez</TableCell>
                      <TableCell>Primero</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>Descuento hermanos</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>3750.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                        >
                          Pendiente
                        </Badge>
                      </TableCell>
                      <TableCell>01/07/2025</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">Mostrando 1-4 de 68 estudiantes</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="outline" size="sm">
                    68
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeReport === "monthly" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Mensualidades</h2>
                <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Estudiante" className="w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinder">Kinder</SelectItem>
                    <SelectItem value="primero">Primero</SelectItem>
                    <SelectItem value="segundo">Segundo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Input type="date" className="w-40" />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Descuento</TableHead>
                      <TableHead>Fecha de inicio</TableHead>
                      <TableHead>Fecha de vencimiento</TableHead>
                      <TableHead>Saldo Total</TableHead>
                      <TableHead>Saldo Pagado</TableHead>
                      <TableHead>Saldo Pendiente</TableHead>
                      <TableHead>Recargo</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Abigail Fajardo</TableCell>
                      <TableCell>Sexto</TableCell>
                      <TableCell>Ninguno</TableCell>
                      <TableCell>02/01/2025</TableCell>
                      <TableCell>03/01/2025</TableCell>
                      <TableCell>L.5000</TableCell>
                      <TableCell>L.2500</TableCell>
                      <TableCell>L.2500</TableCell>
                      <TableCell>L.100</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                        >
                          Pendiente
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Allan Fernandez</TableCell>
                      <TableCell>Primero</TableCell>
                      <TableCell>Descuento %25</TableCell>
                      <TableCell>02/01/2025</TableCell>
                      <TableCell>03/01/2025</TableCell>
                      <TableCell>L.3750</TableCell>
                      <TableCell>L.3750</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Pagado
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Angel Velasquez</TableCell>
                      <TableCell>Noveno</TableCell>
                      <TableCell>Beca</TableCell>
                      <TableCell>02/01/2025</TableCell>
                      <TableCell>03/01/2025</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>L.0.00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Pagado
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">Mostrando 1-3 de 68 estudiantes</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="outline" size="sm">
                    68
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeReport === "discounts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Descuentos y Becas 2025</h2>
                <p className="text-muted-foreground">No. Reporte 01018 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Nombre" className="w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="ID_estudiante" className="w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinder">Kinder</SelectItem>
                    <SelectItem value="primero">Primero</SelectItem>
                    <SelectItem value="segundo">Segundo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo de beneficio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beca">Beca</SelectItem>
                    <SelectItem value="descuento">Descuento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Nombre del estudiante</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Fecha de admisión</TableHead>
                      <TableHead>Tipo de beneficio</TableHead>
                      <TableHead>Porcentaje de beneficio</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell className="font-medium">Abigail Medrano</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>01/06/2025</TableCell>
                      <TableCell>Beca</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Activa
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell className="font-medium">Alicia Keys</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>01/25/2025</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>75%</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Activa
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell className="font-medium">Alicia Machado</TableCell>
                      <TableCell>Primero</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>01/22/2025</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Activa
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">Mostrando 1-3 de 68 estudiantes</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="outline" size="sm">
                    68
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeReport === "outstanding" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Promedios de Pagos Pendientes</h2>
                <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grado</TableHead>
                        <TableHead>Promedio de Deuda por Estudiante</TableHead>
                        <TableHead>Total de deudas</TableHead>
                        <TableHead>Deuda Total del Grado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Primero</TableCell>
                        <TableCell>L. 2,006.67</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>L. 6,020</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Segundo</TableCell>
                        <TableCell>L. 1,725</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>L. 5,175</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Promedio y Total de Deuda por Grado</h3>
                  <ChartContainer
                    config={{
                      average: {
                        label: "Promedio de Deuda por Estudiante",
                        color: "hsl(var(--chart-1))",
                      },
                      total: {
                        label: "Deuda Total del Grado",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <RechartsBarChart
                      data={outstandingPaymentsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="averageDebt" fill="var(--color-average)" name="Promedio" />
                      <Bar dataKey="totalDebt" fill="var(--color-total)" name="Total" />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeReport === "financial" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Reporte Financiero Anual de Ingreso vs Deudas por Cobrar
                </h2>
                <p className="text-muted-foreground">No. Reporte 010107 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de pago</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Deudas por cobrar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Matrículas</TableCell>
                        <TableCell>$ 27,800</TableCell>
                        <TableCell>$ 5,865</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Mensualidades</TableCell>
                        <TableCell>$ 29,500</TableCell>
                        <TableCell>$ 22,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Nivelados</TableCell>
                        <TableCell>$ 11,195</TableCell>
                        <TableCell>$ 202,500</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Reporte Financiero Anual de Ingreso VS Deudas por cobrar - Gráfica
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={financialReportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            </Card>
          </div>
        )}

        {activeReport === "attrition" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Retiro de Estudiantes</h2>
                <p className="text-muted-foreground">No. Reporte 01011 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grado</TableHead>
                        <TableHead>Estudiantes activos</TableHead>
                        <TableHead>Estudiantes retirados</TableHead>
                        <TableHead>Tasa retiro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Pre-básica</TableCell>
                        <TableCell>120</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>7%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Básica</TableCell>
                        <TableCell>280</TableCell>
                        <TableCell>8.4</TableCell>
                        <TableCell>2.01%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Secundaria</TableCell>
                        <TableCell>220</TableCell>
                        <TableCell>12.7</TableCell>
                        <TableCell>5.8%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Comparación de estudiantes activos vs estudiantes retirados
                  </h3>
                  <ChartContainer
                    config={{
                      active: {
                        label: "Estudiantes Activos",
                        color: "hsl(var(--chart-1))",
                      },
                      retired: {
                        label: "Estudiantes Retirados",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <RechartsBarChart data={studentAttritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="active" fill="var(--color-active)" name="Activos" />
                      <Bar dataKey="retired" fill="var(--color-retired)" name="Retirados" />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeReport === "seniority" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reporte de Antigüedad de Estudiantes</h2>
                <p className="text-muted-foreground">No. Reporte 01017 | Fecha de emisión: 03/09/2025</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Antigüedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un-año">Un año</SelectItem>
                    <SelectItem value="dos-años">Dos años</SelectItem>
                    <SelectItem value="tres-años">Tres años</SelectItem>
                    <SelectItem value="cuatro-años">Cuatro años</SelectItem>
                    <SelectItem value="cinco-años">Cinco años o más</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Estudiante</TableHead>
                      <TableHead>Nombre de estudiante</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Fecha de admisión</TableHead>
                      <TableHead>Antigüedad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>01</TableCell>
                      <TableCell className="font-medium">Aaron Felipe Castr</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>01/24/2024</TableCell>
                      <TableCell>Un año</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>02</TableCell>
                      <TableCell className="font-medium">Abigail Lopez Lopez</TableCell>
                      <TableCell>Kinder</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>01/15/2024</TableCell>
                      <TableCell>Un año</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>03</TableCell>
                      <TableCell className="font-medium">Allan Machado</TableCell>
                      <TableCell>Primero</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>01/06/2022</TableCell>
                      <TableCell>Tres años</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>04</TableCell>
                      <TableCell className="font-medium">Berenice Figueroa</TableCell>
                      <TableCell>Quinto</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>01/19/2018</TableCell>
                      <TableCell>Siete años</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">Mostrando 1-4 de 68 estudiantes</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="outline" size="sm">
                    68
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

