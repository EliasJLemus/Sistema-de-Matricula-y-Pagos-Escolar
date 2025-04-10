import { Request, Response } from "express";
import { Apoderados } from "@/db/estudiantes/apoderadosDB";
import { registrarEncargadoSchema } from "@/controller/schema/apoderadosSchema"

const apoderadoDB = new Apoderados();

export const registrarApoderado = async(req: Request, res: Response): Promise<void>=>{
    try{
        const parsed = registrarEncargadoSchema.parse(req.body);

        const result = await apoderadoDB.reistrarApoderado(
            parsed.primer_nombre,
            parsed.segundo_nombre,
            parsed.primer_apellido,
            parsed.segundo_apellido,
            parsed.identidad,
            parsed.genero,
            parsed.fecha_nacimiento,
            parsed.correo,
            parsed.telefono,
            parsed.es_principal,
            parsed.parentesco,
            parsed.uuid
        );

        if(result.codigo_generado === null){
            res.status(201).json({
                success: false,
                message: result.mensaje
            });
            return;
        }
        res.status(201).json(
            {
                success: true,
                data: `${result.mensaje} El codigo del encargado es: ${result.codigo_generado}`,
            }
        )
        
    }catch(error){
        res.status(500).json({
            success: false,
            message:error.message,
            detail: error.message,
        });
    }
}