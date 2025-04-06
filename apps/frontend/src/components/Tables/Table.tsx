import { ChevronLeft, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import * as pdfUtils from "@/utils/pdfutils";

type Column<T> = {
  name: keyof T;
  label: string;
  type?: string;
  render?: (value: any, row?: T) => React.ReactNode;
};

interface ReportTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  filters?: React.ReactNode;
  pagination?: {
    page: number;
    pageCount: number;
    onNext: () => void;
    onPrev: () => void;
    onPageChange: (page: number) => void;
  };
}

export function ReportTable<T>({
  title,
  columns,
  data,
  filters,
  pagination,
}: ReportTableProps<T>) {
  const getStatusBadgeStyle = (status: string) => {
    const isPositive = ["Pagado", "Activo", "Activa"].includes(status);
    return isPositive
      ? "bg-[#E7F5E8] text-[#538A3E] hover:bg-[#E7F5E8] hover:text-[#538A3E] border-[#538A3E]"
      : "bg-[#FFF3E8] text-[#F38223] hover:bg-[#FFF3E8] hover:text-[#F38223] border-[#F38223]";
  };

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1363]">{title}</h2>
          <p className="text-muted-foreground">
            Fecha de emisión: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Button 
          onClick={() => pdfUtils.generatePDF(title, columns, data)}
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

      {/* Filtros */}
      {filters && <div className="flex flex-wrap gap-4">{filters}</div>}

      {/* Tabla */}
      <Card className="border-0 shadow-none">
        <div className="overflow-hidden rounded-lg border border-[#edad4c]">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#edad4c]">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={String(col.name)}
                      className="text-white border-0 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"
                    } border-0`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.name)}
                        className="text-[#4D4D4D] border-0"
                      >
                        {col.render ? (
                          col.render(item[col.name], item)
                        ) : col.name === "estado" ? (
                          <Badge
                            variant="outline"
                            className={`${getStatusBadgeStyle(
                              String(item[col.name])
                            )} min-w-[80px] justify-center font-nunito font-semibold px-3 py-1 rounded-md`}
                          >
                            {String(item[col.name])}
                          </Badge>
                        ) : col.type === "number" ? (
                          <>L. {item[col.name]}</>
                        ) : (
                          String(item[col.name])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>

        {/* No hay datos */}
        {!data.length && (
          <div className="p-6 text-center text-muted-foreground rounded-b-lg border border-t-0 border-[#edad4c]">
            No se encontraron registros para los filtros aplicados.
          </div>
        )}
      </Card>

      {/* Paginación */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {data.length} registros
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onPrev}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {(() => {
              const buttons = [];
              const maxVisible = 5;
              const half = Math.floor(maxVisible / 2);
              let start = Math.max(1, pagination.page - half);
              let end = Math.min(pagination.pageCount, start + maxVisible - 1);

              if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
              }

              if (start > 1) {
                buttons.push(
                  <span key="start" className="px-2 py-1">
                    ...
                  </span>
                );
              }

              for (let i = start; i <= end; i++) {
                buttons.push(
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(i)}
                    className={
                      pagination.page === i
                        ? "bg-[#edad4c] text-white hover:bg-[#edad4c] hover:text-white"
                        : ""
                    }
                  >
                    {i}
                  </Button>
                );
              }

              if (end < pagination.pageCount) {
                buttons.push(
                  <span key="end" className="px-2 py-1">
                    ...
                  </span>
                );
              }

              return buttons;
            })()}

            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onNext}
              disabled={pagination.page >= pagination.pageCount}
            >
              Siguiente
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
