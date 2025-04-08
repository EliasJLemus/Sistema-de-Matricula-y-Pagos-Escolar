import { Database } from "@/db/service";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

// controlador en Express
export const getInfoParaComprobanteController = async (req: Request, res: Response): Promise<void> => {
    const { uuid_comprobante } = req.params;
  
    try {
      const db = new Database();
      const query = `
        SELECT 
          e.codigo_estudiante,
          i.primer_nombre || ' ' || i.primer_apellido AS nombre_estudiante,
          i2.primer_nombre || ' ' || i2.primer_apellido AS nombre_encargado,
          enc.correo_electronico,
          g.nombre_grado,
          g.seccion
        FROM "Pagos"."Matricula" m
        JOIN "Estudiantes"."Estudiantes" e ON e.uuid = m.uuid_estudiante
        JOIN "Estudiantes"."InformacionGeneral" i ON e.uuid_info_general = i.uuid
        JOIN "Estudiantes"."EstudianteEncargado" ee ON ee.uuid_estudiante = e.uuid AND ee.es_principal = true
        JOIN "Estudiantes"."Encargados" enc ON enc.uuid = ee.uuid_encargado
        JOIN "Estudiantes"."InformacionGeneral" i2 ON i2.uuid = enc.uuid_info_general
        JOIN "Administracion"."Grados" g ON g.uuid = e.uuid_grado
        WHERE m.uuid_comprobante = $1
        LIMIT 1;
      `;
      const result = await db.query(query, [uuid_comprobante]);
  
      if (result.rows.length === 0) {
         res.status(404).json({ success: false, message: "No se encontró matrícula con ese comprobante." });
         return
      }
  
      res.json({ success: true, data: result.rows[0] });
      return
    } catch (err) {
      console.error("❌ Error al obtener info del comprobante:", err);
      res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
  };
  

  interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }
  

  export const subirComprobanteMatriculaController = async (req: MulterRequest, res: Response): Promise<void> => {
    const { uuid_comprobante } = req.params;
  
    if (!req.file) {
      res.status(400).json({ success: false, message: "No se adjuntó ninguna imagen." });
      return;
    }
  
    const rutaLocal = req.file.path.replace(/\\/g, "/"); 
    const db = new Database();
  
    try {
      const updateQuery = `
        UPDATE "Pagos"."ComprobantePago"
        SET url_imagen = $1,
            estado = 'Enviado',
            fecha_subida = CURRENT_TIMESTAMP
        WHERE uuid = $2
      `;
      await db.query(updateQuery, [rutaLocal, uuid_comprobante]);
  
      res.json({ success: true, message: "Comprobante actualizado con éxito." });
    } catch (err) {
      console.error("❌ Error al guardar comprobante:", err);
      fs.unlinkSync(req.file.path); 
      res.status(500).json({ success: false, message: "Error al guardar el comprobante." });
    }
  };