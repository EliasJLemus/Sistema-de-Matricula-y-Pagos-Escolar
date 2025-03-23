import { ChevronLeft, Download } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { useGetReportsMatricula } from "../../lib/queries"



export const MatriculaTable: React.FC = () =>{

    const {data, isLoading, isError} = useGetReportsMatricula();

    return (<div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reporte de Matrícula 2025</h2>
            <p className="text-muted-foreground">No. Reporte 01011 | Fecha de emisión</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descarga
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Nombre" className="w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grado" />
              </SelectTrigger>
              <SelectContent>
                
                <SelectItem value="Kinder">Kinder</SelectItem>
                
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre de estudiante</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Tarifa de matrícula</TableHead>
                  <TableHead>Beneficio aplicado</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Total a Pagar</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de matrícula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => {
                  console.log(data)
                  return (
                    <TableRow>
                      <TableCell className="font-medium">{item.nombreEstudiante}</TableCell>
                      <TableCell>{item.grado}</TableCell>
                      <TableCell>{item.seccion}</TableCell>
                      <TableCell>L. {item.tarifaMatricula}</TableCell>
                      <TableCell>{item.beneficioAplicado}</TableCell>
                      <TableCell>{item.descuento}</TableCell>
                      <TableCell>L. {item.totalPagar}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.estado === "Pagado"
                            ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                          }
                        >
                          {item.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.fechaMatricula}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">Mostrando 1-4 de 68 estudiantes</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span>...</span>
              <Button variant="outline" size="sm">
                68
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>)
}