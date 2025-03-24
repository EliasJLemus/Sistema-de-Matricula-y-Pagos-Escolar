import { Request, Response } from "express";
import { ReporteDetalladoDB } from "../../db/reportes/detalladosDB";
import { ReporteMatriculaType, ReporteMatriculaDBType } from "@shared/reportsType";
import {
  matriculaStructure,
  mensualidadStructure,
  estudianteStructure,
  becaStructure
  
} from "@/controller/reportes_controllers/structure/structure_detalle";

const reporteDetalladoDB = new ReporteDetalladoDB();

// Utils para manejar paginación (default)
const getPaginationParams = (req: Request) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  return { limit, offset };
};

export const getReporteMatricula = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const result = await reporteDetalladoDB.getReporteMatricula(limit, offset);
    const total = await reporteDetalladoDB.countReporteMatricula();

    if (Array.isArray(result)) {
      const report: ReporteMatriculaType[] = result.map((row: ReporteMatriculaDBType) => ({
        nombreEstudiante: row.nombre_estudiante,
        grado: row.grado,
        seccion: row.seccion,
        tarifaMatricula: row.tarifa_matricula,
        beneficioAplicado: row.beneficio_aplicado,
        descuento: row.descuento,
        totalPagar: row.total_pagar,
        estado: row.estado,
        fechaMatricula: row.fecha_matricula
      }));

      if (report.length > 0) {
        matriculaStructure.data = report;
        matriculaStructure.pagination = { limit, offset, count: report.length, total };
        res.status(200).json(matriculaStructure);
        return;
      }
      res.status(404).json({ message: "No se encontraron datos" });
      return;
    } else {
      res.status(500).json({ message: "Error en el servidor" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getReporteMensualidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const result = await reporteDetalladoDB.getReporteMensualidad(limit, offset);
    const total = await reporteDetalladoDB.countReporteMensualidad();

    if (Array.isArray(result) && result.length > 0) {
      mensualidadStructure.data = result;
      mensualidadStructure.pagination = { limit, offset, count: result.length, total };
      res.status(200).json(mensualidadStructure);
      return;
    }
    res.status(404).json({ message: "No se encontraron datos" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
    return;
  }
};

export const getReporteEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const result = await reporteDetalladoDB.getReporteEstudiante(limit, offset);
    const total = await reporteDetalladoDB.countReporteEstudiante();

    if (Array.isArray(result) && result.length > 0) {
      estudianteStructure.data = result;
      estudianteStructure.pagination = { limit, offset, count: result.length, total };
      res.status(200).json(estudianteStructure);
      return;
    }
    res.status(404).json({ message: "No se encontraron datos" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
    return;
  }
};

export const getReporteBeca = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const result = await reporteDetalladoDB.getReporteBeca(limit, offset);
    const total = await reporteDetalladoDB.countReporteBeca();

    if (Array.isArray(result) && result.length > 0) {
      becaStructure.data = result;
      becaStructure.pagination = { limit, offset, count: result.length, total };
      res.status(200).json(becaStructure);
      return;
    }
    res.status(404).json({ message: "No se encontraron datos" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
    return;
  }
};
