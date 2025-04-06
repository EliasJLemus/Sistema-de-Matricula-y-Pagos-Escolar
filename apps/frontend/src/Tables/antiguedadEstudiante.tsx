"use client";

import { useState } from "react";
import { useGetAntiguedadEstudiante } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { StructureColumn, ReporteAntiguedadEstudiantes } from "@shared/reportsType";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const antiguedadColumns: StructureColumn<ReporteAntiguedadEstudiantes>[] = [
  { name: "codigo_estudiante", label: "Código Estudiante" },
  { name: "nombre_estudiante", label: "Nombre del Estudiante" },
  { name: "grado", label: "Grado" },
  { name: "seccion", label: "Sección" },
  { name: "fecha_admision", label: "Fecha de Admisión", type: "date" },
  { name: "antiguedad", label: "Antigüedad" },
];

export const AntiguedadEstudianteTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, error } = useGetAntiguedadEstudiante(page, limit);
  const tableData = data?.data ?? [];
  const title = data?.title ?? "Reporte de Antigüedad de Estudiantes";
  const total = data?.pagination?.total ?? 0;
  const pageCount = Math.ceil(total / limit);

  const antiguedadToYears = (value: string): number => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const sortedByAntiguedad = [...tableData].sort(
    (a, b) => antiguedadToYears(b.antiguedad) - antiguedadToYears(a.antiguedad)
  );

  const topEstudiante = sortedByAntiguedad[0];

  return (
    <div className="space-y-8">
      {(isLoading || isFetching) && (
        <div className="text-sm text-muted-foreground animate-pulse">Cargando reporte...</div>
      )}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {topEstudiante && (
        <div className="flex justify-center">
          <Card className="w-full max-w-lg bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl rounded-xl border border-slate-300">
            <CardHeader className="text-center px-6 pt-6">
              <CardTitle className="text-xl font-extrabold tracking-tight text-gray-800">
                👑 Estudiante con Mayor Antigüedad
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">Orgullo académico del año</p>
            </CardHeader>
            <CardContent className="px-8 py-6 space-y-4 text-base text-gray-700 font-medium">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="text-right">{topEstudiante.nombre_estudiante}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grado:</span>
                <span className="text-right">
                  {topEstudiante.grado} - {topEstudiante.seccion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de Admisión:</span>
                <span className="text-right">{topEstudiante.fecha_admision}</span>
              </div>
              <div className="flex justify-between text-blue-600 text-lg font-bold">
                <span>Antigüedad:</span>
                <span className="text-right">{topEstudiante.antiguedad}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
