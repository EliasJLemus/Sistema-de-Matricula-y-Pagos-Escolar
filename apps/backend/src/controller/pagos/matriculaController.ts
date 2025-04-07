import { Request, Response } from "express";
import { getPaginationParams } from "@/controller/utils/pagination";
import { PagosMatriculasDB } from "@/db/pagos/matricula";

export interface MatriculaType {
  uuid_matricula: string;
  codigo_estudiante: string;
  nombre_estudiante: string;
  grado: string;
  seccion: string;
  tarifa_base: number;
  beneficio_aplicado: string;
  descuento_aplicado: string;
  total_pagar: number;
  estado: string;
  comprobante: string;
  fecha_matricula: string;
}

const pagosMatriculasDB = new PagosMatriculasDB();

export const getMatriculasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset, page } = getPaginationParams(req);

    const { data, total } = await pagosMatriculasDB.getMatriculas(limit, offset);

    if (!data || data.length === 0) {
      res.status(404).json({ success: false, message: "No se encontraron matrículas." });
      return;
    }

    res.status(200).json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        count: data.length,
        total,
      },
    });
  } catch (error) {
    console.error("❌ Error en getMatriculasController:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las matrículas.",
    });
  }
};
