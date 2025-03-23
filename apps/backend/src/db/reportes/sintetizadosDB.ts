import {Database} from "../service"
import {
    ReportePagosPendientesType,
    ReporteFinancieroAnualType
} from "@shared/reportsType";

class ReporteSintetizadoDB {
    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getReportePagosPendientes (): Promise<ReportePagosPendientesType[] | Error> {
        try {
            const client = await this.db.getClient();

            const query = `SELECT grado, 
            total_deudas, promedio_deuda_por_estudiante, 
            deuda_total_del_grado
	        FROM sistema.reporte_pagos_pendientes;`

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

            const query = `SELECT tipo_pago, ingresos, deudas_por_cobrar
	        FROM sistema.reporte_financiero_anual;`

            const result = await client.query(query)

            if(result.rows.length === 0){
                throw new Error("No se encontraron datos");
            }

            return result.rows as ReporteFinancieroAnualType[];

        }catch(error){
            throw error
        }
    }
}

export  {ReporteSintetizadoDB};