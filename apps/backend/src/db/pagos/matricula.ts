import { Database } from "../service";

export class PagosMatriculasDB {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async getMatriculas(
    limit: number,
    offset: number,
    year?: number,
    grado?: string,
    uuid_estudiante?: string
  ) {
    try {
      const client = await this.db.getClient();
  
      // ============ WHERE dinámico para el query principal ============
      const conditions: string[] = [];
      const values: any[] = [limit, offset];
      let paramIndex = 3;
  
      // ============ WHERE dinámico para el count ============
      const countConditions: string[] = [];
      const countValues: any[] = [];
      let countParamIndex = 1;
  
      if (year) {
        conditions.push(`year_academico = $${paramIndex++}`);
        values.push(year);
  
        countConditions.push(`year_academico = $${countParamIndex++}`);
        countValues.push(year);
      }
  
      if (grado) {
        conditions.push(`grado ILIKE $${paramIndex++}`);
        values.push(grado);
  
        countConditions.push(`grado ILIKE $${countParamIndex++}`);
        countValues.push(grado);
      }
  
      if (uuid_estudiante) {
        conditions.push(`uuid_estudiante = $${paramIndex++}`);
        values.push(uuid_estudiante);
  
        countConditions.push(`uuid_estudiante = $${countParamIndex++}`);
        countValues.push(uuid_estudiante);
      }
  
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const countWhereClause = countConditions.length > 0 ? `WHERE ${countConditions.join(" AND ")}` : "";
  
      const query = `
        SELECT * FROM "Pagos"."VistaDetalleMatricula"
        ${whereClause}
        ORDER BY fecha_matricula ASC
        LIMIT $1 OFFSET $2
      `;
  
      const countQuery = `
        SELECT COUNT(*) FROM "Pagos"."VistaDetalleMatricula"
        ${countWhereClause}
      `;
  
      const [result, countResult] = await Promise.all([
        client.query(query, values),
        client.query(countQuery, countValues),
      ]);
  
      client.release();
  
      return {
        data: result.rows,
        total: parseInt(countResult.rows[0].count),
      };
    } catch (error) {
      console.error("❌ Error al obtener las matrículas:", error);
      throw new Error("Error al obtener las matrículas");
    }
  }
  
  public async getMatriculaByEstudianteAndYear(uuidEstudiante: string, year: number) {
    try {
      const client = await this.db.getClient();
  
      const query = `
        SELECT * FROM "Pagos"."VistaDetalleMatricula"
        WHERE uuid_estudiante = $1 AND year_academico = $2
        LIMIT 1
      `;
  
      const result = await client.query(query, [uuidEstudiante, year]);
  
      client.release();
  
      if (result.rows.length === 0) {
        return null;
      }
  
      return result.rows[0];
    } catch (error) {
      console.error("Error al obtener matrícula por estudiante y año:", error);
      throw new Error("Error al obtener matrícula del estudiante");
    }
  }
  
  public async creacionMatricula(
    p_uuid: string,
    v_uuid_plan_matricula: string,
    p_fecha_admision: string // formato 'YYYY-MM-DD'
  ): Promise<{
    codigo_matricula?: string;
    mensaje: string;
  }> {
    const client = await this.db.getClient();
  
    try {
      const response =await client.query(
        `
      SELECT * FROM "Pagos".registrar_matricula_estudiante(
        $1,
        $2
      );
      `,
        [p_uuid, p_fecha_admision]
      );

      return response.rows[0];
  
      client.release();
    } catch (error) {
      console.error("❌ Error al crear matrícula:", error);
      throw new Error("Error al crear la matrícula");
    }
  }
  

  public async datosCorreoMatricula(uuidEstudiante: string, codigo_matricula: string) {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT 
          e.codigo_estudiante,
          i.primer_nombre || ' ' || i.primer_apellido AS nombre_estudiante,
          i2.primer_nombre || ' ' || i2.primer_apellido AS nombre_encargado,
          enc.correo_electronico AS correo,
          g.nombre_grado,
          g.seccion,
          ppm.tarifa AS tarifa_base,
          COALESCE(b.descuento, 0) AS descuento_aplicado,
          (ppm.tarifa - COALESCE(b.descuento, 0)) AS total,
          m.fecha_matricula,
          m.codigo_matricula,
          cp.uuid AS uuid_comprobante
        FROM "Pagos"."Matricula" m
        JOIN "Pagos"."PlanPagoMatricula" ppm ON ppm.uuid = m.uuid_plan_matricula
        JOIN "Estudiantes"."Estudiantes" e ON e.uuid = m.uuid_estudiante
        JOIN "Estudiantes"."InformacionGeneral" i ON e.uuid_info_general = i.uuid
        JOIN "Estudiantes"."EstudianteEncargado" ee ON ee.uuid_estudiante = e.uuid AND ee.es_principal = true
        JOIN "Estudiantes"."Encargados" enc ON enc.uuid = ee.uuid_encargado
        JOIN "Estudiantes"."InformacionGeneral" i2 ON i2.uuid = enc.uuid_info_general
        JOIN "Administracion"."Grados" g ON g.uuid = e.uuid_grado
        LEFT JOIN "Pagos"."Becas" b ON b.uuid = ppm.uuid
        JOIN "Pagos"."ComprobantePago" cp ON cp.uuid = m.uuid_comprobante
        WHERE cp.estado = 'Pendiente'
          AND m.uuid_estudiante = $1
          AND m.codigo_matricula = $2
        LIMIT 1;
      `;
  
      const result = await client.query(query, [uuidEstudiante, codigo_matricula]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error al obtener datos para correo de matrícula:", error);
      throw new Error("Error al obtener datos de matrícula para el correo");
    } finally {
      client.release();
    }
  }
  
  public async getAllMatriculas(limit: number, offset: number) {
    try {
      const client = await this.db.getClient();

      const query = `
       SELECT 
        m.codigo_matricula,
        e.codigo_estudiante,
        i.primer_nombre || ' ' || i.primer_apellido AS nombre_estudiante,
        g.nombre_grado,
        g.seccion,
        ppm.tarifa,
        COALESCE(b.nombre_beca, 'Sin beneficio') AS beneficio,
        COALESCE(b.descuento, 0) AS descuento,
        (ppm.tarifa - (ppm.tarifa * COALESCE(b.descuento, 0) / 100)) AS total,
        m.estado,
        cp.estado AS estado_comprobante,
        m.fecha_matricula
      FROM "Pagos"."Matricula" m
      JOIN "Estudiantes"."Estudiantes" e ON e.uuid = m.uuid_estudiante
      JOIN "Estudiantes"."InformacionGeneral" i ON i.uuid = e.uuid_info_general
      JOIN "Administracion"."Grados" g ON g.uuid = e.uuid_grado
      JOIN "Pagos"."PlanPagoMatricula" ppm ON ppm.uuid = m.uuid_plan_matricula
      LEFT JOIN "Pagos"."PlanPagoDetallado" pd ON pd.uuid_estudiante = e.uuid AND pd.uuid_plan_matricula = ppm.uuid
      LEFT JOIN "Pagos"."Becas" b ON b.uuid = m.uuid_beca
      LEFT JOIN "Pagos"."ComprobantePago" cp ON cp.uuid = m.uuid_comprobante
      ORDER BY m.fecha_matricula ASC
              LIMIT $1 OFFSET $2;
      `;

      const countQuery = `
        SELECT COUNT(*) FROM "Pagos"."Matricula"
      `;

      const [result, countResult] = await Promise.all([
        client.query(query, [limit, offset]),
        client.query(countQuery),
      ]);

      client.release();

      return {
        data: result.rows,
        total: parseInt(countResult.rows[0].count),
      };
    } catch (error) {
      console.error("❌ Error al obtener todas las matrículas:", error);
      throw new Error("Error al obtener las matrículas.");
    }
  }

  public async getMatriculaPorUuid(uuid_matricula: string) {
    try {
      const client = await this.db.getClient();
  
      const result = await client.query(
        `
        SELECT
          m.uuid AS uuid_matricula,
          m.codigo_matricula,
          m.fecha_matricula,
          m.estado,
          m.year_academico,
  
          e.uuid AS uuid_estudiante,
          e.codigo_estudiante,
          ig.primer_nombre || ' ' || ig.primer_apellido AS nombre_estudiante,
  
          g.nombre_grado,
          g.seccion,
  
          ppm.tarifa AS tarifa_base,
  
          co.estado AS estado_comprobante,
  
          enc.codigo_encargado AS codigo_encargado_principal,
          ieg.primer_nombre || ' ' || ieg.primer_apellido AS nombre_encargado_principal,
  
          -- ✅ Se reemplaza la ruta absoluta con una ruta accesible desde el frontend
          CONCAT('/uploads/comprobantesMatricula/', REGEXP_REPLACE(co.url_imagen, '^.*[\\/]', '')) AS url_imagen
  
        FROM "Pagos"."Matricula" m
        JOIN "Estudiantes"."Estudiantes" e ON e.uuid = m.uuid_estudiante
        JOIN "Estudiantes"."InformacionGeneral" ig ON ig.uuid = e.uuid_info_general
  
        LEFT JOIN "Administracion"."Grados" g ON g.uuid = e.uuid_grado
        LEFT JOIN "Pagos"."PlanPagoMatricula" ppm ON ppm.uuid = m.uuid_plan_matricula
        LEFT JOIN "Pagos"."ComprobantePago" co ON co.uuid = m.uuid_comprobante
  
        LEFT JOIN "Estudiantes"."EstudianteEncargado" ee ON ee.uuid_estudiante = e.uuid AND ee.es_principal = true
        LEFT JOIN "Estudiantes"."Encargados" enc ON enc.uuid = ee.uuid_encargado
        LEFT JOIN "Estudiantes"."InformacionGeneral" ieg ON ieg.uuid = enc.uuid_info_general
        
        WHERE m.uuid = $1
        `,
        [uuid_matricula]
      );
  
      return result.rows[0];
    } catch (error) {
      console.error("Error en getMatriculaPorUuid:", error);
      throw new Error("No se pudo obtener la matrícula");
    }
  }
  

}
