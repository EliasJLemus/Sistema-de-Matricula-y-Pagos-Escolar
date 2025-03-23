import { ChevronLeft, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

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
}

export function ReportTable<T>({
  title,
  columns,
  data,
  filters
}: ReportTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">Fecha de emisión: {new Date().toLocaleDateString()}</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Descarga
        </Button>
      </div>

      {filters && (
        <div className="flex flex-wrap gap-4">
          {filters}
        </div>
      )}

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
                  {columns.map((col) => (
                    <TableCell key={String(col.name)}>
                      {col.name === "estado" ? (
                        <Badge
                          variant="outline"
                          className={
                            item[col.name] === "Pagado"
                              ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                          }
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
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">Mostrando {data.length} registros</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span>...</span>
            <Button variant="outline" size="sm">Siguiente<ChevronLeft className="h-4 w-4 rotate-180" /></Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
