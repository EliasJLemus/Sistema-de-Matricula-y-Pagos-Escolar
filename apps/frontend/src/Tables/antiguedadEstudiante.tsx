"use client";
import { useState } from "react";
import { useGetAntiguedadEstudiante } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { StructureColumn, ReporteAntiguedadEstudiantes } from "@shared/reportsType";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const antiguedadColumns: StructureColumn<ReporteAntiguedadEstudiantes>[] = [
  { name: "id_estudiante", label: "ID Estudiante" },
  { name: "nombre_estudiante", label: "Nombre del Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  { name: "fecha_admision", label: "Fecha de Admisión" },
  { name: "antiguedad", label: "Antigüedad" },
];

export const AntiguedadEstudianteTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, error } = useGetAntiguedadEstudiante();

  const tableData = data?.data ?? [];
  const title = data?.title ?? "Reporte de Antigüedad de Estudiantes";
  const total = data?.pagination?.count ?? 0;
  const pageCount = Math.ceil(total / limit);

  // Extraer el estudiante con mayor antigüedad
  const antiguedadToYears = (value: string): number => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const sortedByAntiguedad = [...tableData].sort(
    (a, b) => antiguedadToYears(b.antiguedad) - antiguedadToYears(a.antiguedad)
  );

  const topEstudiante = sortedByAntiguedad[0];

  const chartData = topEstudiante
    ? [{ name: topEstudiante.nombre_estudiante, años: antiguedadToYears(topEstudiante.antiguedad) }]
    : [];

  return (
    <div className="space-y-8">
      {(isLoading || isFetching) && (
        <div className="text-sm text-muted-foreground animate-pulse">Cargando reporte...</div>
      )}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {/* Mini Chart de Tendencia */}
      {topEstudiante && (
        <Card>
          <CardHeader>
            <CardTitle>Mayor antigüedad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="años" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Antigüedad */}
      <ReportTable<ReporteAntiguedadEstudiantes>
        title={title}
        columns={antiguedadColumns}
        data={tableData}
        pagination={{
          page,
          pageCount,
          onNext: () => setPage((p) => Math.min(p + 1, pageCount)),
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          onPageChange: setPage,
        }}
      />
    </div>
  );
};