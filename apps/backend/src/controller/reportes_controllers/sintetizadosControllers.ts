import { Request, Response } from "express";
import { ReporteSintetizadoDB } from "@/db/reportes/sintetizadosDB";
import {
  pagosPendientesStructure,
  financieroAnualStructure,
  retiroEstudiantesStructure,
} from "@/controller/reportes_controllers/structure/structure_sintetizado";
import {getPaginationParams} from "@/controller/utils/pagination";

const reporteSintetizadoDB = new ReporteSintetizadoDB();

export const getReportePagosPendientes = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = getPaginationParams(req);
    const result = await reporteSintetizadoDB.getReportePagosPendientes(limit, offset);

    if (Array.isArray(result.data) && result.data.length > 0) {
      pagosPendientesStructure.data = result.data;
      pagosPendientesStructure.pagination = {
        limit,
        offset,
        count: result.data.length,
        total: result.total,
      };

      res.status(200).json(pagosPendientesStructure);
      return;
    }

    res.status(404).json({ message: "No se encontraron datos" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReporteFinancieroAnual = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await reporteSintetizadoDB.getReporteFinancieroAnual();

    if (Array.isArray(result) && result.length > 0) {
      financieroAnualStructure.data = result;

      res.status(200).json(financieroAnualStructure);
      return;
    }

    res.status(404).json({ message: "No se encontraron datos." });
    return;
  } catch (error) {
    throw error;
  }
};

export const getReporteRetiroEstudiante = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await reporteSintetizadoDB.getReporteRetiroEstudiante();

    if (Array.isArray(result) && result.length > 0) {
      retiroEstudiantesStructure.data = result;

      res.status(200).json(retiroEstudiantesStructure);
      return;
    }

    res.status(404).json({ message: "No se encontraron datos." });
    return;
  } catch (error) {
    throw error;
  }
};