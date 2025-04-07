import { Database } from "../service";

export class PagosMatriculasDB {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async getMatriculas(limit: number, offset: number) {
    try {
      const client = await this.db.getClient();

      const query = `
        SELECT 
          m.uuid AS uuid_matricula,
          e.codigo_estudiante,
          CONCAT(ig.primer_nombre, ' ', ig.primer_apellido) AS nombre_estudiante,
          g.nombre_grado AS grado,
          g.seccion,
          ppm.tarifa AS tarifa_base,
          COALESCE(b.nombre_beca, 'Sin beneficio') AS beneficio_aplicado,
          CONCAT(COALESCE(b.descuento, 0), '%') AS descuento_aplicado,
          ROUND(ppm.tarifa * (1 - COALESCE(b.descuento, 0) / 100.0), 2) AS total_pagar,
          m.estado,
          cp.estado AS comprobante,
          TO_CHAR(m.fecha_matricula, 'DD/MM/YYYY') AS fecha_matricula
        FROM "Pagos"."Matricula" m
        JOIN "Estudiantes"."Estudiantes" e ON m.uuid_estudiante = e.uuid
        JOIN "Estudiantes"."InformacionGeneral" ig ON e.uuid_info_general = ig.uuid
        JOIN "Administracion"."Grados" g ON e.uuid_grado = g.uuid
        JOIN "Pagos"."PlanPagoMatricula" ppm ON m.uuid_plan_matricula = ppm.uuid
        LEFT JOIN "Pagos"."ComprobantePago" cp ON m.uuid_comprobante = cp.uuid
        LEFT JOIN "Pagos"."Mensualidad" mn ON mn.uuid_estudiante = e.uuid
        LEFT JOIN "Pagos"."Becas" b ON mn.uuid_beca = b.uuid
        WHERE m.year_academico = 2025
        ORDER BY m.fecha_matricula ASC
        LIMIT $1 OFFSET $2
      `;

      const countQuery = `
        SELECT COUNT(*) FROM "Pagos"."Matricula" WHERE year_academico = 2025
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
      console.error("Error al obtener las matrículas:", error);
      throw new Error("Error al obtener las matrículas");
    }
  }
}
