import {Database} from "../service"
import {
    ReportePagosPendientesType,
    ReporteFinancieroAnualType,
    ReporteRetiroEstudiantesType
} from "@shared/reportsType";

class ReporteSintetizadoDB {
    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getReportePagosPendientes (): Promise<ReportePagosPendientesType[] | Error> {
        try {
            const client = await this.db.getClient();

            const query = `
            SELECT 
            grado,
            estudiantes_morosos,
            total_estudiantes,
            porcentaje_morosidad,
            deuda_total,
            promedio_deuda_moroso
            FROM "Pagos".reporte_morosidad_por_grado(2025)
            `

            const result = await client.query(query);

            if(result.rows.length === 0) {
                throw new Error("No se encontraron datos");
            }
            
            return result.rows as ReportePagosPendientesType[];
        } catch (error) {
            throw error;    
        }
    }

    public async getReporteFinancieroAnual (): Promise<ReporteFinancieroAnualType[] | Error> {
        try{
            const client = await this.db.getClient();

            const query = `
            SELECT 
            tipo_pago,
            ingresos,
            deudas_por_cobrar
            FROM "Pagos".reporte_financiero_anual(2025);
            `

            const result = await client.query(query)

            if(result.rows.length === 0){
                throw new Error("No se encontraron datos");
            }

            return result.rows as ReporteFinancieroAnualType[];

        }catch(error){
            throw error
        }
    }

    public async getReporteRetiroEstudiante (): Promise<ReporteRetiroEstudiantesType[] | Error> {
        try {
            const client = await this.db.getClient();

            const query = `SELECT 
                        nivel,
                        estudiantes_activos,
                        estudiantes_retirados,
                        tasa_retiro
                        FROM "Estudiantes".reporte_retiro_estudiantes(
                        2025,                    -- p_anio (año lectivo)
                        '2025-01-01',            -- p_fecha_inicio (inicio del rango de fechas de retiro)
                        '2025-12-31'             -- p_fecha_fin (fin del rango de fechas de retiro)
                        )
                        `;

            const result = await client.query(query);

            if (result.rows.length === 0) {
                throw new Error("No se encontraron datos");
            }

            return result.rows as ReporteRetiroEstudiantesType[];
        } catch (error) {
            throw error;
        }
    }
}

export  {ReporteSintetizadoDB};