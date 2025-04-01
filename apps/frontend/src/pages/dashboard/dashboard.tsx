"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  DollarSign,
  GraduationCap,
  LineChart,
  PieChart,
  Users,
  School,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ReportCard } from "@/components/Card/cardReport";

import { EstudianteTable } from "@/Tables/estudiantes";
import { MatriculaTable } from "@/Tables/matriculas";
import { MensualidadTable } from "@/Tables/mensualidad";
import { BecaTable } from "@/Tables/becas";
import { PagosPendientesTable } from "@/Tables/pagosPendientes";
import { RetirosTable } from "@/Tables/retiroEstudiante";
import { FinancieroAnualTable } from "@/Tables/financieroAnual";
import { AntiguedadEstudianteTable } from "@/Tables/antiguedadEstudiante";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const handleBackToDashboard = () => setActiveReport(null);

  if (activeReport) {
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
          {activeReport === "financial" && <FinancieroAnualTable />}  
          {activeReport === "attrition" && <RetirosTable />}  
          {activeReport === "seniority" && <AntiguedadEstudianteTable />}  
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-6 py-8 space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">620</div>
            <p className="text-sm text-muted-foreground">+85 desde el año pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. 3,100,000</div>
            <p className="text-sm text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <LineChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. 85,000</div>
            <p className="text-sm text-muted-foreground">-5% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.3%</div>
            <p className="text-sm text-muted-foreground">+2.5% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-gray-100 border border-gray-300 rounded-md p-1 w-fit">
          <TabsTrigger value="overview" className="px-4 py-1 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Vista General</TabsTrigger>
          <TabsTrigger value="financial" className="px-4 py-1 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Financiero</TabsTrigger>
          <TabsTrigger value="students" className="px-4 py-1 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">Estudiantes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ReportCard title="Reporte Mensualidades" description="Seguimiento de pagos realizados y pendientes" icon={<DollarSign className="h-5 w-5" />} stats={[{ label: "Pagados", value: 450 }, { label: "Pendientes", value: 170 }]} onClick={() => setActiveReport("monthly")} />
            <ReportCard title="Pagos Pendientes" description="Promedio de deuda por estudiante" icon={<LineChart className="h-5 w-5" />} stats={[{ label: "Promedio", value: "L. 1,500" }, { label: "Total", value: "L. 85,000" }]} onClick={() => setActiveReport("outstanding")} />
            <ReportCard title="Reporte Financiero Anual" description="Evaluación de ingresos y deudas por cobrar" icon={<BarChart3 className="h-5 w-5" />} stats={[{ label: "Ingresos", value: "L. 3,100,000" }, { label: "Deudas", value: "L. 85,000" }]} onClick={() => setActiveReport("financial")} />
            <ReportCard title="Reporte Matrícula Año 2025" description="Control de matrícula de los estudiantes" icon={<Calendar className="h-5 w-5" />} stats={[{ label: "Total", value: 620 }, { label: "Nuevos", value: 85 }]} onClick={() => setActiveReport("tuition")} />
            <ReportCard title="Reporte Estudiante" description="Supervisión de la información del estudiante" icon={<School className="h-5 w-5" />} stats={[{ label: "Activos", value: 620 }, { label: "Distribución", value: "310M / 310F" }]} onClick={() => setActiveReport("student")} />
            <ReportCard title="Retiros" description="Estudiantes que se han retirado" icon={<PieChart className="h-5 w-5" />} stats={[{ label: "Retiros", value: 34 }]} onClick={() => setActiveReport("attrition")} />
            <ReportCard title="Antigüedad Estudiantil" description="Historial de permanencia en la institución" icon={<GraduationCap className="h-5 w-5" />} stats={[{ label: "+5 años", value: 124 }]} onClick={() => setActiveReport("seniority")} />
            <ReportCard title="Descuentos y Becas" description="Verificación de beneficios otorgados" icon={<BookOpen className="h-5 w-5" />} stats={[{ label: "Becas", value: 45 }, { label: "Descuentos", value: 120 }]} onClick={() => setActiveReport("discounts")} />
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ReportCard title="Reporte Mensualidades" description="Seguimiento de pagos realizados y pendientes" icon={<DollarSign className="h-5 w-5" />} stats={[{ label: "Pagados", value: 450 }, { label: "Pendientes", value: 170 }]} onClick={() => setActiveReport("monthly")} />
            <ReportCard title="Pagos Pendientes" description="Promedio de deuda por estudiante" icon={<LineChart className="h-5 w-5" />} stats={[{ label: "Promedio", value: "L. 1,500" }, { label: "Total", value: "L. 85,000" }]} onClick={() => setActiveReport("outstanding")} />
            <ReportCard title="Reporte Financiero Anual" description="Evaluación de ingresos y deudas por cobrar" icon={<BarChart3 className="h-5 w-5" />} stats={[{ label: "Ingresos", value: "L. 3,100,000" }, { label: "Deudas", value: "L. 85,000" }]} onClick={() => setActiveReport("financial")} />
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ReportCard title="Reporte Matrícula Año 2025" description="Control de matrícula de los estudiantes" icon={<Calendar className="h-5 w-5" />} stats={[{ label: "Total", value: 620 }, { label: "Nuevos", value: 85 }]} onClick={() => setActiveReport("tuition")} />
            <ReportCard title="Reporte Estudiante" description="Supervisión de la información del estudiante" icon={<School className="h-5 w-5" />} stats={[{ label: "Activos", value: 620 }, { label: "Distribución", value: "310M / 310F" }]} onClick={() => setActiveReport("student")} />
            <ReportCard title="Retiros" description="Estudiantes que se han retirado" icon={<PieChart className="h-5 w-5" />} stats={[{ label: "Retiros", value: 34 }]} onClick={() => setActiveReport("attrition")} />
            <ReportCard title="Antigüedad Estudiantil" description="Historial de permanencia en la institución" icon={<GraduationCap className="h-5 w-5" />} stats={[{ label: "+5 años", value: 124 }]} onClick={() => setActiveReport("seniority")} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}