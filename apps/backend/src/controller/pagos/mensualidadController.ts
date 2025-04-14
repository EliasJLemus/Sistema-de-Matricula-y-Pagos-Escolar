import { Response, Request } from "express";
import {getPaginationParams} from "@/controller/utils/pagination";
import {PagosMensualidadDB} from "@/db/pagos/mensualidadDB";

const mensualidadDB = new PagosMensualidadDB()

export const getAllMensualidades = async(req: Request, res: Response): Promise<void> => {
    try{
        const {limit, offset} = getPaginationParams(req);

        const { nombre, grado, estado, fecha_vencimiento } = req.query;

        const result = await mensualidadDB.getMensualidadAll(limit,
            offset,
            nombre as string | undefined,
            grado as string | undefined,
            estado as string | undefined,
            fecha_vencimiento as string | undefined
        )

        if(result){
            res.status(201).json({
                success: true,
                data: result.data,
                pagination: {
                    limit,
                    offset,
                    count: result.data.length,
                    total: result.total
                }
            });
            return;
        }

        res.status(201).json({
            success: false,
            message: "No hay registros"
        })

    }catch(error){
        console.error("Error al obtener los datos de mensualidad:", error);
        res.status(500).json({ message: "Error al obtener los datos de mensualidad" });
    }
}