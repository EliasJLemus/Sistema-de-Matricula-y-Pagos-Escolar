import {Database} from "../service"
import {ReporteMatriculaDBType, ReporteMensualidadDBType, ReporteEstudianteDBType} from "../../controller/reportes_controllers/types/matriculaType";
import { QueryResult } from "pg";


export class ReporteDetalladoDB {

    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getReporteMatricula(): Promise<ReporteMatriculaDBType[]| Error> {
        try{

            const client = await this.db.getClient();

            const query = `
                SELECT 
                nombre_estudiante, 
                grado, seccion, 
                tarifa_matricula, beneficio_aplicado, descuento, total_pagar, estado, fecha_matricula
	            FROM sistema.reporte_matricula
            `

            const result = await client.query(query);

            return result.rows as ReporteMatriculaDBType[];

        }catch(error){
            throw error;
        }
    }

    public async getReporteMensualidad(): Promise<ReporteMensualidadDBType[] | Error> {
        try{
            const client = await this.db.getClient();

            const query = `SELECT estudiante, 
            grado, descuento, fecha_inicio, 
            fecha_vencimiento, saldo_total, saldo_pagado, 
            saldo_pendiente, recargo, estado
	        FROM sistema.reporte_mensualidades`

            const result = await client.query(query);
            
            return result.rows as ReporteMensualidadDBType[];
        }catch(error){
            throw error;
        }
    }

    public async getReporteEstudiante(): Promise<ReporteEstudianteDBType[] | Error>{
        try{
            const client = await this.db.getClient();

            const query = `SELECT 
                estudiante, identidad,
                genero, alergias, zurdo, grado, estado, plan_pago, 
                encargado, parentesco, telefono
	            FROM sistema.reporte_estudiantes;`

            const result = await client.query(query);

            return result.rows as ReporteEstudianteDBType[];
        }catch(error){
            throw error;
        }   
    }
}