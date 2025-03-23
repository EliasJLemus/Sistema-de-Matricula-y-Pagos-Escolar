import {
    Request, 
    Response
} from "express";
import {ReporteDetalladoDB} from "../../db/reportes/detalladosDB";
import {ReporteMatricula, ReporteMatriculaDBType} from "../reportes_controllers/types/matriculaType";
import {
    matriculaStructure,
    mensualidadStructure,
    estudianteStructure
} from "./structure"

const reporteDetalladoDB = new ReporteDetalladoDB();

export const getReporteMatricula = async(
    req: Request,
    res: Response
): Promise<void> => {
    try{
        
        const result = await reporteDetalladoDB.getReporteMatricula();
        
        
        if (Array.isArray(result)) {
            const report: ReporteMatricula[] = result.map((row: ReporteMatriculaDBType) => {
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
            }) as ReporteMatricula[];

            if (report.length > 0) {

                matriculaStructure.data = report; 

                res.status(200).json(matriculaStructure);
                return;
            }
            res.status(404).json({ message: "No se encontraron datos" });
            return;
        } else {
            res.status(500).json({ message: "Error en el servidor" });
            return;
        }

    }catch(error){
         res.status(500).json({message: "Error en el servidor"});
         return;
    }
}

export const getReporteMensualidad = async (
    req: Request,
    res: Response
): Promise<void> => {
    try{

        const result = await reporteDetalladoDB.getReporteMensualidad();
        
        if (Array.isArray(result) && result.length > 0) {
            mensualidadStructure.data = result;
            res.status(200).json(mensualidadStructure);
            return
        }
        res.status(404).json({message: "No se encontraron datos"});
        return
        
    }catch(error){
        res.status(500).json({message: "Error en el servidor"});
        return
    }
}

export const getReporteEstudiante = async (
    req:Request,
    res:Response
): Promise<void> => {
    try{

        const result = await reporteDetalladoDB.getReporteEstudiante();
        
        if (Array.isArray(result) && result.length > 0) {
            estudianteStructure.data = result
            res.status(200).json(estudianteStructure);
            return
        }
        res.status(404).json({message: "No se encontraron datos"});
        return

    }catch(error){
        res.status(500).json({message: "Error en el servidor"});
        return
    }
}
