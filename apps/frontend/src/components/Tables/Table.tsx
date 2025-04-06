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

const fontFamily = "'Nunito', sans-serif";

type Column<T> = {
  name: keyof T;
  label: string;
  type?: string;
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
    <div className="space-y-4 text-sm text-gray-800" style={{ fontFamily }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1A1363]">{title}</h2>
          <p className="text-muted-foreground">
            Fecha de emisión: {new Date().toLocaleDateString("es-HN")}
          </p>
        </div>
        <Button
          className="bg-blue-800 text-white hover:bg-blue-900"
          onClick={() => pdfUtils.generatePDF(title, columns, data)}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>

      {/* Filtros */}
      {filters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-muted flex flex-wrap gap-4">
          {filters}
        </div>
      )}

      {/* Tabla */}
      <Card className="rounded-xl shadow-md border border-muted bg-white overflow-x-auto">
        <CardContent className="p-0">
          <Table className="bg-[#fff9db]">
            <TableHeader className="bg-[#edad4c] text-white">
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={String(col.name)}
                    className="text-white font-bold text-center"
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
                  } hover:bg-[#e7f5e8] cursor-pointer transition-colors`}
                >
                  {columns.map((col) => {
                    const value = item[col.name];
                    const renderValue = () => {
                      if (col.name === "estado") {
                        return (
                          <Badge
                            variant="outline"
                            className={`rounded-full px-2 py-1 text-xs font-semibold w-20 justify-center ${
                              value === "Pagado"
                                ? "bg-green-100 text-green-700"
                                : value === "Mora"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-800"
                            }`}
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
                          const parsed = new Date(value as string | number | Date);
                          return parsed.toLocaleDateString("es-HN", {
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
                      <TableCell
                        key={String(col.name)}
                        className="text-center align-middle"
                      >
                        {renderValue()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Paginación */}
        {pagination && (
          <CardFooter className="flex items-center justify-between border-t p-4 bg-white">
            <div className="text-sm text-muted-foreground">
              Mostrando {data.length} registros
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onPrev}
                disabled={pagination.page <= 1}
                className="rounded-md bg-[#F38223] text-white hover:bg-[#e67615]"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {[...Array(Math.min(5, pagination.pageCount))].map((_, i) => {
                const pageNum =
                  pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
                if (pageNum <= pagination.pageCount) {
                  return (
                    <Button
                      key={i}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={`rounded-md ${
                        pageNum === pagination.page
                          ? "bg-[#538A3E] text-white"
                          : "bg-white"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onNext}
                disabled={pagination.page >= pagination.pageCount}
                className="rounded-md bg-[#F38223] text-white hover:bg-[#e67615]"
              >
                Siguiente
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {!data.length && (
        <div className="p-6 text-center text-muted-foreground rounded-xl border shadow-sm bg-white">
          No se encontraron registros para los filtros aplicados.
        </div>
      )}
    </div>
  );
}
