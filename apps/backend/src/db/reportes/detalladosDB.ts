import {Database} from "../service"
import {
    ReporteMatriculaDBType, 
    ReporteEstudiante, 
    ReporteMensualidad, 
    ReporteBeca} from "@shared/reportsType";
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

    public async getReporteMensualidad(): Promise<ReporteMensualidad[] | Error> {
        try{
            const client = await this.db.getClient();

            const query = `SELECT estudiante, 
            grado, descuento, fecha_inicio, 
            fecha_vencimiento, saldo_total, saldo_pagado, 
            saldo_pendiente, recargo, estado
	        FROM sistema.reporte_mensualidades`

            const result = await client.query(query);
            
            return result.rows as ReporteMensualidad[];
        }catch(error){
            throw error;
        }
    }

    public async getReporteEstudiante(): Promise<ReporteEstudiante[] | Error>{
        try{
            const client = await this.db.getClient();

            const query = `SELECT 
                estudiante, identidad,
                genero, alergias, zurdo, grado, estado, plan_pago, 
                encargado, parentesco, telefono
	            FROM sistema.reporte_estudiantes;`

            const result = await client.query(query);

            return result.rows as ReporteEstudiante[];
        }catch(error){
            throw error;
        }   
    }

    public async getReporteBeca(): Promise<ReporteBeca[] | Error> {
        try{
            const client = await this.db.getClient();

            const query  = `SELECT id_estudiante,
                 nombre_estudiante, 
                 grado, seccion, fecha_admision,
                  tipo_beneficio, porcentaje_beneficio, estado
	            FROM sistema.reporte_becas_descuentos`

            const result = await client.query(query);
            
            if(result.rows.length === 0){
                return new Error("No se encontraron resultados");
            }

            return result.rows  as ReporteBeca[];
        }catch(error){
            throw error;
        }
    }
}