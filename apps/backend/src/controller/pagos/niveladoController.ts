import {Response, Request} from "express";
import {PagosNiveladoDB} from "@/db/pagos/niveladoDB";
import {getPaginationParams} from "@/controller/utils/pagination";

const pagosNiveladoDB = new PagosNiveladoDB();

export const getAllNivelado = async (req: Request, res:Response): Promise<void> => {
    try{
        const {limit, offset} = getPaginationParams(req);

        const {nombre, grado, estado, fecha_pago} = req.body;

        const result = await pagosNiveladoDB.getNiveladoAll(
            limit,
            offset,
            nombre,
            grado,
            estado,
            fecha_pago
        )

        if(result){
            res.status(200).json({
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