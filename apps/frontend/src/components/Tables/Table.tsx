import { ChevronLeft, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
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
  type?: string; // "number" | "date" | "text"
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
  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            Fecha de emisión: {new Date().toLocaleDateString("es-HN")}
          </p>
        </div>

        <Button onClick={() => pdfUtils.generatePDF(title, columns, data)}>
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>

      {/* Filtros */}
      {filters && <div className="flex flex-wrap gap-4">{filters}</div>}

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={String(col.name)}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((col) => {
                    const value = item[col.name];
                    const renderValue = () => {
                      if (col.name === "estado") {
                        return (
                          <Badge
                            variant="outline"
                            className={
                              value === "Pagado"
                                ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                            }
                          >
                            {String(value)}
                          </Badge>
                        );
                      }

                      if (col.type === "number") {
                        return `L. ${Number(value).toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`;
                      }

                      if (col.type === "date") {
                        try {
                          const parsedDate = new Date(value as string | number | Date);
                          return parsedDate.toLocaleDateString("es-HN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });
                        } catch {
                          return String(value);
                        }
                      }

                      return String(value);
                    };

                    return (
                      <TableCell key={String(col.name)}>{renderValue()}</TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Paginación */}
        {pagination && (
          <CardFooter className="flex items-center justify-between border-t p-4">
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
                  buttons.push(<span key="start">...</span>);
                }

                for (let i = start; i <= end; i++) {
                  buttons.push(
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => pagination.onPageChange(i)}
                      className={pagination.page === i ? "bg-muted" : ""}
                    >
                      {i}
                    </Button>
                  );
                }

                if (end < pagination.pageCount) {
                  buttons.push(<span key="end">...</span>);
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
