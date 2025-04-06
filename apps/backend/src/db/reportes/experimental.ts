import { Database } from "../service";
import { ReporteAntiguedadEstudiantes } from "@shared/reportsType";

export class ReporteExcepcionalDB {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async getAntiguedadEstudiante(
    limit: number,
    offset: number
  ): Promise<ReporteAntiguedadEstudiantes[]> {
    const client = await this.db.getClient();

    try {
      const query = `
        SELECT 
          codigo_estudiante,
          nombre_estudiante,
          grado,
          seccion,
          fecha_admision,
          antiguedad
        FROM (
          SELECT 
            e.codigo_estudiante,
            CONCAT_WS(' ', ig.primer_nombre, ig.segundo_nombre, ig.primer_apellido, ig.segundo_apellido) AS nombre_estudiante,
            g.nombre_grado AS grado,
            g.seccion,
            e.fecha_admision,
            CASE
              WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_admision)) = 0 THEN 'Menos de un año'
              WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_admision)) = 1 THEN 'Un año'
              ELSE EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_admision))::INT || ' años'
            END AS antiguedad
          FROM "Estudiantes"."Estudiantes" e
          JOIN "Estudiantes"."InformacionGeneral" ig ON e.uuid_info_general = ig.uuid
          JOIN "Administracion"."Grados" g ON e.uuid_grado = g.uuid
          WHERE ig.tipo_persona = 'Estudiante'
        ) AS reporte
        ORDER BY antiguedad ASC
        LIMIT $1 OFFSET $2;
      `;
      const result = await client.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching student seniority:", error);
      throw new Error("Failed to fetch student seniority");
    } finally {
      client.release();
    }
  }

  public async countAntiguedadEstudiante(): Promise<number> {
    const client = await this.db.getClient();
    try {
      const result = await client.query(`
        SELECT COUNT(*) FROM "Estudiantes"."Estudiantes" e
        JOIN "Estudiantes"."InformacionGeneral" ig ON e.uuid_info_general = ig.uuid
        WHERE ig.tipo_persona = 'Estudiante'
      `);
      return parseInt(result.rows[0].count, 10);
    } catch (err) {
      console.error("Error contando antigüedad:", err);
      return 0;
    } finally {
      client.release();
    }
  }
}
