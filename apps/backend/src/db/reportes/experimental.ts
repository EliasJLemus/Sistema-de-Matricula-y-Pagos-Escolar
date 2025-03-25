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
    ): Promise<ReporteAntiguedadEstudiantes[] | Error> {
        try {
            const query = `
                SELECT id_estudiante, nombre_estudiante, grado, seccion, fecha_admision, antiguedad
                FROM sistema.reporte_antiguedad_estudiantes
                ORDER BY antiguedad DESC
                LIMIT $1 OFFSET $2;
            `;
            const results = await this.db.query(query, [limit, offset]);
            return results.rows as ReporteAntiguedadEstudiantes[];
        } catch (error) {
            console.error("Error fetching student seniority:", error);
            throw new Error("Failed to fetch student seniority");
        }
    }
}
