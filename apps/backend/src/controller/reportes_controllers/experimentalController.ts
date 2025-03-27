import { Request, Response } from "express";
import { ReporteExcepcionalDB } from "@/db/reportes/experimental";
import { antiguedadStructure } from "@/controller/reportes_controllers/structure/structure_experimental/structureAntiguedadEstudiante";

const reporteExperimentalDB = new ReporteExcepcionalDB();

// Función para obtener parámetros de paginación
const getPaginationParams = (req: Request) => {
  const getAll = req.query.getAll === "true";
  const page = parseInt(req.query.page as string) || 1;
  const limit = getAll ? 10000 : parseInt(req.query.limit as string) || 10;
  const offset = getAll ? 0 : (page - 1) * limit;

  return { limit, offset, getAll, page };
};

export const getReporteAntiguedad = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Obtener parámetros de paginación desde la query
    const { limit, offset } = getPaginationParams(req);

    // Obtener los datos del reporte de antigüedad de estudiantes desde la base de datos
    const result = await reporteExperimentalDB.getAntiguedadEstudiante(
      limit,
      offset
    );
    console.log(result);
    // Comprobar si se encontraron resultados
    if (Array.isArray(result) && result.length > 0) {
      // Enviar respuesta con los datos del reporte y la paginación
      res.status(200).json({
        ...antiguedadStructure,
        data: result,
        pagination: { limit, offset, count: result.length },
      });
    } else {
      // Si no se encontraron datos, retornar un mensaje de error
      res.status(404).json({ message: "No se encontraron datos." });
    }
  } catch (error) {
    // Manejo de errores en el servidor
    console.error("Error fetching student seniority:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
