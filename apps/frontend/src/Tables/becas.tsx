import { useState } from "react";
import { useGetReporteBeca } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BecaTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data } = useGetReporteBeca(page, limit);
  const total = data?.pagination?.total || 0;
  const pageCount = Math.ceil(total / limit);

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
            <Input placeholder="Tipo beneficio" className="w-64" />
          </div>
        </div>
      }
      pagination={{
        page,
        pageCount,
        onNext: () => setPage(p => Math.min(p + 1, pageCount)),
        onPrev: () => setPage(p => Math.max(p - 1, 1)),
        onPageChange: setPage,
      }}
    />
  ) : (
    <div>No hay datos</div>
  );
};
