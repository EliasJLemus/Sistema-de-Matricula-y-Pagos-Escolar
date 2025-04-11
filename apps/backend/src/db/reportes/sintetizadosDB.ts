import { Database } from "../service";
import {
  ReportePagosPendientesType,
  ReporteFinancieroAnualType,
  ReporteRetiroEstudiantesType,
} from "@shared/reportsType";

class ReporteSintetizadoDB {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async getReportePagosPendientes(limit: number, offset: number): Promise<{ data: ReportePagosPendientesType[]; total: number }> {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT 
          grado,
          estudiantes_morosos,
          total_estudiantes,
          porcentaje_morosidad,
          deuda_total,
          promedio_deuda_moroso
        FROM "Pagos".reporte_morosidad_por_grado(2025)
        ORDER BY grado
        LIMIT $1 OFFSET $2;
      `;
  
      const countQuery = `SELECT COUNT(*) FROM "Pagos".reporte_morosidad_por_grado(2025);`;
  
      const [dataResult, countResult] = await Promise.all([
        client.query(query, [limit, offset]),
        client.query(countQuery),
      ]);
  
      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count, 10),
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
  

  public async getReporteFinancieroAnual(): Promise<ReporteFinancieroAnualType[]> {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT 
          tipo_pago,
          ingresos,
          deudas_por_cobrar
        FROM "Pagos".reporte_financiero_anual(2025);
      `;

      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error("No se encontraron datos");
      }

      return result.rows as ReporteFinancieroAnualType[];
    } catch (error) {
      console.error("Error en getReporteFinancieroAnual:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getReporteRetiroEstudiante(): Promise<ReporteRetiroEstudiantesType[]> {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT 
          nivel,
          estudiantes_activos,
          estudiantes_retirados,
          tasa_retiro
        FROM "Estudiantes".reporte_retiro_estudiantes(
          2025,                    -- p_anio (año lectivo)
          '2020-01-01',            -- p_fecha_inicio
          '2030-12-31'             -- p_fecha_fin
        )
      `;

      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error("No se encontraron datos");
      }

      return result.rows as ReporteRetiroEstudiantesType[];
    } catch (error) {
      console.error("Error en getReporteRetiroEstudiante:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export { ReporteSintetizadoDB };
