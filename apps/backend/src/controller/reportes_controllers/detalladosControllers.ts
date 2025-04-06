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
import {getPaginationParams} from "@/controller/utils/pagination";


const reporteDetalladoDB = new ReporteDetalladoDB();


export const getReporteMatricula = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);
    const { nombre, grado, estado, year } = req.query;

    const filters = {
      nombre: nombre as string,
      grado: grado as string,
      estado: estado as string,
      year: year as string,
    };
 console.log("filters", filters)
    const result = await reporteDetalladoDB.getReporteMatricula(
      limit,
      offset,
      filters
    );
    const total = await reporteDetalladoDB.countReporteMatricula(filters);
    
    if (Array.isArray(result) && result.length > 0) {
      const report = result.map((row) => ({
        codigo_matricula: row.codigo_matricula,
        nombreEstudiante: row.nombre_estudiante,
        grado: row.grado,
        seccion: row.seccion,
        tarifaMatricula: row.tarifa_matricula,
        beneficioAplicado: row.beneficio_aplicado,
        descuento: row.porcentaje_descuento,
        totalPagar: row.total_a_pagar,
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
    const { estudiante = "", grado = "", fechaInicio = "", fechaFin = "" } = req.query;

    const filters = {
      estudiante: String(estudiante).trim(),
      grado: String(grado).trim(),
      fechaInicio: String(fechaInicio).trim(),
      fechaFin: String(fechaFin).trim(),
    };

    // Construir el título dinámico
    let dynamicTitle = "Reporte de Mensualidad";

    if (filters.fechaInicio && filters.fechaFin) {
      dynamicTitle += ` del ${filters.fechaInicio} al ${filters.fechaFin}`;
    } else if (filters.fechaInicio) {
      dynamicTitle += ` desde ${filters.fechaInicio}`;
    } else if (filters.fechaFin) {
      dynamicTitle += ` hasta ${filters.fechaFin}`;
    }

    const result = await reporteDetalladoDB.getReporteMensualidad(
      limit,
      offset,
      filters
    );

    const total = await reporteDetalladoDB.countReporteMensualidad(filters);

    if (Array.isArray(result) && result.length > 0) {
      const responseData = {
        ...mensualidadStructure,
        title: dynamicTitle,
        data: result,
        pagination: {
          limit,
          offset,
          count: result.length,
          total,
        },
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Reporte Mensualidad:", responseData);
      }

      res.status(200).json(responseData);
    } else {
      res.status(200).json({
        ...mensualidadStructure,
        title: dynamicTitle,
        data: [],
        pagination: {
          limit,
          offset,
          count: 0,
          total: 0,
        },
        message: "No se encontraron datos.",
      });
    }
  } catch (error) {
    console.error("❌ Error en getReporteMensualidad:", error);
    res.status(500).json({
      message: "Error interno del servidor.",
      error: (error as Error).message,
    });
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