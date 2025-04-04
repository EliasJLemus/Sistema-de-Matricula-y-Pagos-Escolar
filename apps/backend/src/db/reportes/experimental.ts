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
        FROM "Estudiantes".reporte_antiguedad_estudiantes()
        LIMIT $1 OFFSET $2;
      `;
      const result = await client.query(query, [limit, offset]);
      return result.rows as ReporteAntiguedadEstudiantes[];
    } catch (error) {
      console.error("Error fetching student seniority:", error);
      throw new Error("Failed to fetch student seniority");
    } finally {
      client.release();
    }
  }
}
