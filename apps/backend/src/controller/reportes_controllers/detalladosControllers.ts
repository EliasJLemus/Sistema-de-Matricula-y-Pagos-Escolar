import { Request, Response } from "express";
import { ReporteDetalladoDB } from "../../db/reportes/detalladosDB";
import {
  ReporteMatriculaType,
  ReporteMatriculaDBType,
} from "@shared/reportsType";
import {
  matriculaStructure,
  mensualidadStructure,
  estudianteStructure,
  becaStructure,
} from "@/controller/reportes_controllers/structure/structure_detalle";

const reporteDetalladoDB = new ReporteDetalladoDB();

// Utils para manejar paginación (default)
const getPaginationParams = (req: Request) => {
  const getAll = req.query.getAll === "true";
  const page = parseInt(req.query.page as string) || 1;
  const limit = getAll ? 10000 : parseInt(req.query.limit as string) || 10;
  const offset = getAll ? 0 : (page - 1) * limit;

  return { limit, offset, getAll, page };
};

export const getReporteMatricula = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    const { nombre, grado, estado } = req.query;

    const filters = {
      nombre: nombre as string,
      grado: grado as string,
      estado: estado as string,
    };

    const result = await reporteDetalladoDB.getReporteMatricula(
      limit,
      offset,
      filters
    );
    const total = await reporteDetalladoDB.countReporteMatricula(filters);
    
    if (Array.isArray(result) && result.length > 0) {
      const report = result.map((row) => ({
        nombreEstudiante: row.nombre_estudiante,
        grado: row.grado,
        seccion: row.seccion,
        tarifaMatricula: row.tarifa_matricula,
        beneficioAplicado: row.beneficio_aplicado,
        descuento: row.porcentaje_descuento,
        totalPagar: row.total_pagar,
        estado: row.estado,
        fechaMatricula: row.fecha_matricula,
        tipoPlan: row.tipo_plan
      }));

      res.status(200).json({
        ...matriculaStructure,
        data: report,
        pagination: { limit, offset, count: result.length, total },
      });
    } else {
      res.status(404).json({ message: "No se encontraron datos." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor.", error: error });
  }
};

export const getReporteMensualidad = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    const { estudiante, grado, fecha } = req.query;

    const filters = {
      estudiante: estudiante as string,
      grado: grado as string,
      fecha: fecha as string,
    };

    const result = await reporteDetalladoDB.getReporteMensualidad(
      limit,
      offset,
      filters
    );
    const total = await reporteDetalladoDB.countReporteMensualidad(filters);

    if (Array.isArray(result) && result.length > 0) {
      mensualidadStructure.data = result;
      mensualidadStructure.pagination = {
        limit,
        offset,
        count: result.length,
        total,
      };
      console.log(mensualidadStructure);
      res.status(200).json(mensualidadStructure);
      return;
    }

    res.status(404).json({ message: "No se encontraron datos." });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor.", error:error});
  }
};

export const getReporteEstudiante = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    const { estudiante, grado, fecha, estado } = req.query;

    const filters = {
      estudiante: estudiante as string,
      grado: grado as string,
      fecha: fecha as string,
      estado: estado as string,
    };
    const result = await reporteDetalladoDB.getReporteEstudiante(
      limit,
      offset,
      filters
    );
    const total = await reporteDetalladoDB.countReporteEstudiante(filters);

    if (Array.isArray(result) && result.length > 0) {
      estudianteStructure.data = result;
      estudianteStructure.pagination = {
        limit,
        offset,
        count: result.length,
        total,
      };
      res.status(200).json(estudianteStructure);
      return;
    }

    res.status(404).json({ message: "No se encontraron datos." });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const getReporteBeca = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    const { nombre_estudiante, grado, tipo_beneficio } = req.query;
    const filters = {
      nombre_estudiante: nombre_estudiante as string,
      grado: grado as string,
      tipo_beneficio: tipo_beneficio as string,
    };

    const result = await reporteDetalladoDB.getReporteBeca(
      limit,
      offset,
      filters
    );
    const total = await reporteDetalladoDB.countReporteBeca(filters);

    if (Array.isArray(result) && result.length > 0) {
      becaStructure.data = result;
      becaStructure.pagination = { limit, offset, count: result.length, total };
      res.status(200).json(becaStructure);
      return;
    }
    res.status(404).json({ message: "No se encontraron datos." });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor." });
  }
};
