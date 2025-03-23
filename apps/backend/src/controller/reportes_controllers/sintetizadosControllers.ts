import {
    Request, 
    Response
} from "express";
import {ReporteSintetizadoDB} from "@/db/reportes/sintetizadosDB";
import {pagosPendientesStructure} from "@/controller/reportes_controllers/structure/structure_sintetizado"

const reporteSintetizadoDB = new ReporteSintetizadoDB();

export const getReportePagosPendientes = async(req: Request, res: Response) => {
    try{

        const result = await reporteSintetizadoDB.getReportePagosPendientes();

        if(Array.isArray(result) && result.length > 0){

            pagosPendientesStructure.data = result;

            res.status(200).json(pagosPendientesStructure);
            return;
        }

        res.status(404).json({message: "No se encontraron datos"});
        return;

    }catch(error){

    }
}