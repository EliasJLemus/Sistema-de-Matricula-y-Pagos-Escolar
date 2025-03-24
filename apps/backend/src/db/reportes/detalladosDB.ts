import { Database } from "../service";
import {
  ReporteMatriculaDBType,
  ReporteEstudianteType,
  ReporteMensualidadType,
  ReporteBecaType
} from "@shared/reportsType";

export class ReporteDetalladoDB {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  // ======= MATRICULA =======
  public async getReporteMatricula(
    limit: number,
    offset: number,
    filters: { nombre?: string; grado?: string; estado?: string }
  ): Promise<ReporteMatriculaDBType[]> {
    const client = await this.db.getClient();
  
    const where: string[] = [];
    const values: any[] = [limit, offset];
    let paramIndex = 3;
  
    if (filters.nombre) {
      where.push(`LOWER(nombre_estudiante) LIKE LOWER($${paramIndex++})`);
      values.push(`%${filters.nombre}%`);
    }
    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }
    if (filters.estado) {
      where.push(`estado = $${paramIndex++}`);
      values.push(filters.estado);
    }
  
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  
    const query = `
      SELECT nombre_estudiante, grado, seccion, tarifa_matricula, beneficio_aplicado, descuento, total_pagar, estado, fecha_matricula
      FROM sistema.reporte_matricula
      ${whereClause}
      ORDER BY fecha_matricula DESC
      LIMIT $1 OFFSET $2
    `;
  
    const result = await client.query(query, values);
    return result.rows;
  }
  

  public async countReporteMatricula(filters: { nombre?: string; grado?: string; estado?: string }): Promise<number> {
    const client = await this.db.getClient();
  
    const where: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
  
    if (filters.nombre) {
      where.push(`LOWER(nombre_estudiante) LIKE LOWER($${paramIndex++})`);
      values.push(`%${filters.nombre}%`);
    }
    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }
    if (filters.estado) {
      where.push(`estado = $${paramIndex++}`);
      values.push(filters.estado);
    }
  
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  
    const query = `SELECT COUNT(*) FROM sistema.reporte_matricula ${whereClause}`;
    const result = await client.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }
  

  // ======= MENSUALIDAD =======
  public async getReporteMensualidad(limit: number, offset: number): Promise<ReporteMensualidadType[]> {
    const client = await this.db.getClient();

    const query = `
      SELECT estudiante, grado, descuento, fecha_inicio, fecha_vencimiento, saldo_total, saldo_pagado, saldo_pendiente, recargo, estado
      FROM sistema.reporte_mensualidades
      ORDER BY fecha_vencimiento DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, [limit, offset]);
    return result.rows;
  }

  public async countReporteMensualidad(): Promise<number> {
    const client = await this.db.getClient();
    const query = `SELECT COUNT(*) FROM sistema.reporte_mensualidades`;
    const result = await client.query(query);
    return parseInt(result.rows[0].count, 10);
  }

  // ======= ESTUDIANTE =======
  public async getReporteEstudiante(limit: number, offset: number): Promise<ReporteEstudianteType[]> {
    const client = await this.db.getClient();

    const query = `
      SELECT estudiante, identidad, genero, alergias, zurdo, grado, estado, plan_pago, encargado, parentesco, telefono
      FROM sistema.reporte_estudiantes
      ORDER BY estudiante ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, [limit, offset]);
    return result.rows;
  }

  public async countReporteEstudiante(): Promise<number> {
    const client = await this.db.getClient();
    const query = `SELECT COUNT(*) FROM sistema.reporte_estudiantes`;
    const result = await client.query(query);
    return parseInt(result.rows[0].count, 10);
  }

  // ======= BECA =======
  public async getReporteBeca(limit: number, offset: number): Promise<ReporteBecaType[]> {
    const client = await this.db.getClient();

    const query = `
      SELECT id_estudiante, nombre_estudiante, grado, seccion, fecha_admision, tipo_beneficio, porcentaje_beneficio, estado
      FROM sistema.reporte_becas_descuentos
      ORDER BY porcentaje_beneficio DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, [limit, offset]);
    return result.rows;
  }

  public async countReporteBeca(): Promise<number> {
    const client = await this.db.getClient();
    const query = `SELECT COUNT(*) FROM sistema.reporte_becas_descuentos`;
    const result = await client.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}
