import {
    Request, 
    Response
} from "express";
import {ReporteDetalladoDB} from "../../db/reportes/detalladosDB";
import {ReporteMatriculaDBType} from "../reportes_controllers/types/matriculaType";

export const getReporteMatricula = async(
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const reporteDetalladoDB = new ReporteDetalladoDB();
        const result = await reporteDetalladoDB.getReporteMatricula();
        const report =  result.rows.map((row: ReporteMatriculaDBType) => {
            return {
                nombreEstudiante: row.nombre_estudiante,
                grado: row.grado,
                seccion: row.seccion,
                tarifaMatricula: row.tarifa_matricula,
                beneficioAplicado: row.beneficio_aplicado,
                descuento: row.descuento,
                totalPagar: row.total_pagar,
                estado: row.estado,
                fechaMatricula: row.fecha_matricula
            }
        });

        if(report.length > 0){
            res.status(200).json(report);
            return;
        }
         res.status(404).json({message: "No se encontraron datos"});
         return

    }catch(error){
         res.status(500).json({message: "Error en el servidor"});
         return;
    }
}

