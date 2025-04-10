import { Request, Response } from "express";
import { getPaginationParams } from "@/controller/utils/pagination";
import { PagosMatriculasDB } from "@/db/pagos/matricula";
import {MatriculaType} from "@shared/pagos"
import { enviarCorreoComprobante } from "@/utils/enviarCorreoComprobante";
import { Database } from "@/db/service";


const pagosMatriculasDB = new PagosMatriculasDB();

export const getMatriculasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const grado = req.query.grado as string | undefined;
    const uuid_estudiante = req.query.uuid_estudiante as string | undefined;
    
    if (year && isNaN(year)) {
      console.log("El año proporcionado no es un número válido:", year);
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
    const { uuid_estudiante, uuid_matricula, fecha_matricula } = req.body;

    if (!uuid_estudiante || !fecha_matricula) {
      console.log("Faltan campos obligatorios:", {
        uuid_estudiante,
        uuid_matricula,
        fecha_matricula,
      });
      res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: uuid_estudiante, uuid_plan_matricula, fecha_matricula",
      });
      return;
    }

    const result = await pagosMatriculasDB.creacionMatricula(uuid_estudiante, uuid_matricula, fecha_matricula);

    if(result.codigo_matricula === null){
      res.status(201).json({
        success: false,
        message: result.mensaje,
      })

      return
    }
    
    console.log("Resultado de la creación de matrícula:", result);

    const datosCorreo = await pagosMatriculasDB.datosCorreoMatricula(uuid_estudiante, result.codigo_matricula);

    if (datosCorreo) {
      await enviarCorreoComprobante(datosCorreo);
    }
    
    res.status(201).json({
      success: true,
      data: `${result.mensaje} el codugo de matrícula es ${result.codigo_matricula}`,
    });
    return;
  } catch (error) {
    console.error("❌ Error en crearMatriculaController:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la matrícula",
    });
  }
};

export const getAllMatriculasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, offset } = getPaginationParams(req);

    const { data, total } = await pagosMatriculasDB.getAllMatriculas(limit, offset);

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
    console.error("❌ Error en getAllMatriculasController:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las matrículas.",
    });
  }
};

export const obtenerMatriculaPorUuid = async (req: Request, res: Response): Promise<void> => {
  const { uuid } = req.params;

  try {
    const data = await pagosMatriculasDB.getMatriculaPorUuid(uuid);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Matrícula no encontrada.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
      message: "Matrícula obtenida correctamente.",
    });
  } catch (error: any) {
    console.error("Error al obtener matrícula:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener la matrícula.",
    });
  }
};

export const actualizarEstadoComprobanteController = async (req: Request, res: Response): Promise<void> => {
  const { uuid } = req.params;
  const { estado } = req.body;

  if (!uuid || !estado || !["Aceptado", "Rechazado"].includes(estado)) {
     res.status(400).json({
      success: false,
      message: "UUID o estado inválido. Estados permitidos: Aceptado, Rechazado.",
    });
    return
  }

  try {
  await pagosMatriculasDB.actualizarEstadoComprobante(uuid, estado);

     res.status(200).json({
      success: true,
      message: `Comprobante ${estado.toLowerCase()} correctamente.`,
    });
    return
  } catch (error) {
    console.error("❌ Error al actualizar estado del comprobante:", error);
     res.status(500).json({
      success: false,
      message: "Error al actualizar estado del comprobante.",
    });
    return
  }
};


export const getPlanPagoDetalladoByEstudiante = async (req: Request, res: Response): Promise<void> => {
  const { uuid  } = req.params;

  try {
    if (!uuid ) {
      res.status(400).json({ success: false, message: "UUID del estudiante requerido" });
      return;
    }

    const db = new Database();

    const result = await db.query(
      `
      SELECT * FROM "Pagos"."VistaDetalleMatriculaEstudiante"
      WHERE uuid_estudiante = $1
      ORDER BY fecha_modificacion DESC
      LIMIT 1
      `,
      [uuid ]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "No se encontró plan de pago detallado para el estudiante.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error: any) {
    console.error("Error al obtener el plan detallado:", error.message);
    res.status(500).json({
      success: false,
      message: "Error interno al obtener plan detallado.",
      detail: error.message,
    });
  }
};