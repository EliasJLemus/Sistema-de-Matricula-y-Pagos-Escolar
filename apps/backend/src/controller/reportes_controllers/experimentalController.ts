import { Request, Response } from "express";
import { ReporteExcepcionalDB } from "@/db/reportes/experimental";
import { antiguedadStructure } from "@/controller/reportes_controllers/structure/structure_experimental/structureAntiguedadEstudiante";
import {getPaginationParams} from "@/controller/utils/pagination"

const reporteExperimentalDB = new ReporteExcepcionalDB();

export const getReporteAntiguedad = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    console.log("limit", limit, "offset", offset);
    
    const data = await reporteExperimentalDB.getAntiguedadEstudiante(limit, offset);

    const total = await reporteExperimentalDB.countAntiguedadEstudiante();

    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json({
        ...antiguedadStructure,
        data,
        pagination: {
          limit,
          offset,
          count: data.length,
          total, // <- ahora sí el total general
        },
      });
    } else {
      res.status(404).json({ message: "No se encontraron datos." });
    }
  } catch (error) {
    console.error("Error fetching antigüedad:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
