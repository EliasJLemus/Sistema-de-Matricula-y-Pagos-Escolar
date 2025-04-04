import { Request, Response } from "express";
import { Estudiantes } from "@/db/estudiantes/estudiantesDB";
import { v4 as uuidv4 } from 'uuid';
import { registrarEstudianteSchema } from "../schema/estudianteSchema";
import { ZodError } from "zod";
import {getPaginationParams} from "@/controller/utils/pagination";

const estudianteDB = new Estudiantes();

export const registroEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid_estudiante = uuidv4();
    const uuid_info_general = uuidv4();

    const parsed = registrarEstudianteSchema.parse({
      uuid: uuid_estudiante,
      uuid_info_general: uuid_info_general,
      ...req.body,
    });

    const result = await estudianteDB.registrarEstudiante(
      parsed.uuid,
      parsed.uuid_info_general,
      parsed.primer_nombre,
      parsed.segundo_nombre,
      parsed.primer_apellido,
      parsed.segundo_apellido,
      parsed.identidad,
      parsed.nacionalidad,
      parsed.genero,
      parsed.fecha_nacimiento,
      parsed.edad,
      parsed.direccion,
      parsed.nombre_grado,
      parsed.seccion,
      parsed.es_zurdo,
      parsed.dif_educacion_fisica,
      parsed.reaccion_alergica,
      parsed.descripcion_alergica,
      parsed.tipo_persona,
      parsed.fecha_admision
    );

    res.status(201).json({
      success: true,
      data: `Registro exitoso. El codigo del estudiante es: ${result.codigo_estudiante}`, 
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Error de validación de datos.",
        errors: error.errors,
      });
      return;
    }

    if (error.code === "P0001") {
      res.status(409).json({
        success: false,
        message: "La identidad ya está registrada.",
      });
      return;
    }

    if (error.code === "P0002") {
      res.status(500).json({
        success: false,
        message: "Error interno: no se pudo recuperar la información general.",
      });
      return;
    }

    if (error.code === "P0003") {
      res.status(404).json({
        success: false,
        message: "No se encontró el grado y sección especificados.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      detail: error.message,
    });
  }
};

//Obtener registros

export const obtenerEstudiantes = async (req: Request, res: Response): Promise<void> => {
  try{

    const { limit, offset } = getPaginationParams(req);
    const { nombre, grado, estado } = req.query;

    const filters = {
      nombre: nombre as string,
      grado: grado as string,
      estado: estado as string,
    };

    const result = await estudianteDB.obtenerEstudiantes(limit, offset, filters);
    const total = await estudianteDB.countEstudiantes(filters);

    if (Array.isArray(result) && result.length > 0) {
      res.status(200).json({
        success: true,
        data: result,
        pagination: {
          limit,
          offset,
          count: result.length,
          total,
        },
      });
      return;
    }
    res.status(404).json({
      success: false,
      message: "No se encontraron datos.",
    });
    return;

  }catch(error: any) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      detail: error.message,
    });

    return;
  }
}
