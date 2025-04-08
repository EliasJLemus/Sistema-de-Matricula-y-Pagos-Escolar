import { Request, Response } from "express";
import { getPaginationParams } from "@/controller/utils/pagination";
import { PagosMatriculasDB } from "@/db/pagos/matricula";
import {MatriculaType} from "@shared/pagos"

const pagosMatriculasDB = new PagosMatriculasDB();

export const getMatriculasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const grado = req.query.grado as string | undefined;
    const uuid_estudiante = req.query.uuid_estudiante as string | undefined;

    if (year && isNaN(year)) {
      res.status(400).json({
        success: false,
        message: "El año proporcionado no es válido.",
      });
      return;
    }

    const { data, total } = await pagosMatriculasDB.getMatriculas(limit, offset, year, grado, uuid_estudiante);

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

export const getMatriculaByEstudianteAndYearController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uuid_estudiante } = req.params;
    const year = parseInt(req.query.year as string, 10);

    if (!uuid_estudiante || isNaN(year)) {
      res.status(400).json({
        success: false,
        message: "Parámetros inválidos. Se requiere uuid_estudiante y year.",
      });
      return;
    }

    const matricula = await pagosMatriculasDB.getMatriculaByEstudianteAndYear(uuid_estudiante, year);

    if (!matricula) {
      res.status(404).json({
        success: false,
        message: "No se encontró matrícula para el estudiante en el año especificado.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: matricula,
    });
  } catch (error) {
    console.error("❌ Error en getMatriculaByEstudianteAndYearController:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la matrícula del estudiante.",
    });
  }
};

export const crearMatriculaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid_estudiante, uuid_plan_matricula, fecha_matricula } = req.body;

    if (!uuid_estudiante || !uuid_plan_matricula || !fecha_matricula) {
      res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: uuid_estudiante, uuid_plan_matricula, fecha_matricula",
      });
      return;
    }

    await pagosMatriculasDB.creacionMatricula(uuid_estudiante, uuid_plan_matricula, fecha_matricula);

    res.status(201).json({
      success: true,
      message: "Matrícula creada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error en crearMatriculaController:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la matrícula",
    });
  }
};

