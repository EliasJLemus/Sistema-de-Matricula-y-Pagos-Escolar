import { useGetReporteEstudiante } from "@/lib/queries";
import { ReportTable } from "@/components/Tables/Table"; 
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EstudianteTable: React.FC = () => {
    const {data} = useGetReporteEstudiante();

    console.log(data);

    return data && data.columns && data.data ? (
        <ReportTable
        title={data.title}
      columns={data.columns}
        data={data.data}
        filters = {
            (
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
            )
        }
        />
    ): (
        <div>No hay datos</div>
    )
}