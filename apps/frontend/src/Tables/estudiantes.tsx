import { useState } from "react";
import { useGetReporteEstudiante } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EstudianteTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetReporteEstudiante(page, limit);

  const total = data?.pagination?.total || 0;
  const pageCount = Math.ceil(total / limit);

  const handleNext = () => setPage((p) => Math.min(p + 1, pageCount));
  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));

  return data && data.columns && data.data ? (
    <ReportTable
      title={data.title}
      columns={data.columns}
      data={data.data}
      filters={
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
      }
      pagination={{
        page,
        pageCount,
        onNext: handleNext,
        onPrev: handlePrev,
        onPageChange: setPage,
      }}
    />
  ) : (
    <div>No hay datos</div>
  );
};
