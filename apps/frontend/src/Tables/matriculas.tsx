import { useState } from "react";
import { useGetReportsMatricula } from "@/lib/queries";
import { ReportTable } from "../components/Tables/Table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const MatriculaTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data } = useGetReportsMatricula(page, limit);
  const total = data?.pagination?.total || 0;
  const pageCount = Math.ceil(total / limit);

  return data && data.columns && data.data ? (
    <ReportTable
      title={data.title}
      columns={data.columns}
      data={data.data}
      filters={(
        <>
          <Input placeholder="Nombre" className="w-64" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Grado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kinder">Kinder</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
      pagination={{
        page,
        pageCount,
        onNext: () => setPage(p => Math.min(p + 1, pageCount)),
        onPrev: () => setPage(p => Math.max(p - 1, 1)),
        onPageChange: setPage,
      }}
    />
  ) : (
    <div>Cargando</div>
  );
};
