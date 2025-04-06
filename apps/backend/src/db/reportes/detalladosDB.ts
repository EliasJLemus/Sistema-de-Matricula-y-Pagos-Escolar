import { Database } from "../service";
import {
  ReporteMatriculaDBType,
  ReporteEstudianteType,
  ReporteMensualidadType,
  ReporteBecaType,
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
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
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
      SELECT codigo_matricula, nombre_estudiante, grado, seccion, tarifa_matricula,
             beneficio_aplicado, porcentaje_descuento, total_a_pagar,
             estado, fecha_matricula, tipo_plan
      FROM "Pagos".reporte_matricula_por_anio(2025)
      ${whereClause}
      ORDER BY fecha_matricula DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await client.query(query, values);
      return result.rows as ReporteMatriculaDBType[];
    } catch (error) {
      console.error("Error ejecutando getReporteMatricula:", error);
      throw new Error("Error obteniendo el reporte de matrícula.");
    } finally {
      client.release();
    }
  }

  public async countReporteMatricula(
    filters: { nombre?: string; grado?: string; estado?: string }
  ): Promise<number> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.nombre) {
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
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
      SELECT COUNT(*) FROM (
        SELECT * FROM "Pagos".reporte_matricula_por_anio(2025)
      ) AS reporte
      ${whereClause}
    `;

    try {
      const result = await client.query(query, values);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error("Error en countReporteMatricula:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ======= MENSUALIDAD =======
  public async getReporteMensualidad(
    limite: number,
    offset: number,
    filters: {
      estudiante?: string;
      grado?: string;
      fechaInicio?: string;
      fechaFin?: string;
      estado?: string;
    }
  ): Promise<ReporteMensualidadType[]> {
    const client = await this.db.getClient();
  
    try {
      // Validar fechas, usar NULL si no vienen
      const fechaInicio = filters.fechaInicio ? `'${filters.fechaInicio}'` : 'NULL';
      const fechaFin = filters.fechaFin ? `'${filters.fechaFin}'` : 'NULL';
  
      let baseQuery = `
        SELECT 
          codigo_mensualidad,
          nombre_estudiante,
          grado,
          beneficio_aplicado,
          porcentaje_descuento,
          fecha_inicio,
          fecha_vencimiento,
          subtotal,
          saldo_pendiente,
          saldo_pagado,
          recargo,
          estado
        FROM "Pagos".reporte_mensualidades(NULL, NULL, ${fechaInicio}, ${fechaFin})
      `;
  
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;
  
      if (filters.estudiante) {
        conditions.push(`nombre_estudiante ILIKE $${idx}`);
        values.push(`%${filters.estudiante}%`);
        idx++;
      }
  
      if (filters.grado) {
        conditions.push(`grado ILIKE $${idx}`);
        values.push(`%${filters.grado}%`);
        idx++;
      }
  
      if (filters.estado) {
        conditions.push(`estado ILIKE $${idx}`);
        values.push(`%${filters.estado}%`);
        idx++;
      }
  
      if (conditions.length > 0) {
        baseQuery += " WHERE " + conditions.join(" AND ");
      }
  
      baseQuery += ` ORDER BY fecha_vencimiento DESC LIMIT $${idx} OFFSET $${idx + 1}`;
      values.push(limite, offset);
  
      console.log("Query ejecutada:", baseQuery);
      console.log("Valores:", values);
  
      const result = await client.query(baseQuery, values);
      return result.rows;
    } catch (error: any) {
      console.error("Error en getReporteMensualidad:", error);
      throw new Error("No se pudo obtener el reporte de mensualidades.");
    } finally {
      client.release();
    }
  }
  
  
  public async countReporteMensualidad(
    filters: { estudiante?: string; grado?: string; fechaInicio?: string; fechaFin?: string }
  ): Promise<number> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
  
    // Prepara los valores de fecha para la función SQL
    const fechaInicio = filters.fechaInicio ? `'${filters.fechaInicio}'` : 'NULL';
    const fechaFin = filters.fechaFin ? `'${filters.fechaFin}'` : 'NULL';
  
    if (filters.estudiante) {
      where.push(`nombre_estudiante ILIKE $${paramIndex++}`);
      values.push(`%${filters.estudiante}%`);
    }
  
    if (filters.grado) {
      where.push(`grado ILIKE $${paramIndex++}`);
      values.push(`%${filters.grado}%`);
    }
  
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  
    const query = `
      SELECT COUNT(*) 
      FROM "Pagos".reporte_mensualidades(
        NULL::uuid, 
        NULL::estado_pagos, 
        ${fechaInicio}::date, 
        ${fechaFin}::date
      )
      ${whereClause};
    `;
  
    try {
      const result = await client.query(query, values);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error("Error en countReporteMensualidad:", error);
      throw new Error("No se pudo contar los registros del reporte de mensualidades.");
    } finally {
      client.release();
    }
  }
  

  // ======= BECA =======
  public async getReporteBeca(
    limit: number,
    offset: number,
    filters: { nombre_estudiante?: string; grado?: string; tipo_beneficio?: string } = {}
  ): Promise<ReporteBecaType[]> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [limit, offset];
    let paramIndex = 3;

    if (filters.nombre_estudiante) {
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
      values.push(`%${filters.nombre_estudiante}%`);
    }
    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }
    if (filters.tipo_beneficio) {
      where.push(`nombre_beca = $${paramIndex++}`);
      values.push(filters.tipo_beneficio);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT 
        codigo_beca,
        nombre_estudiante,
        grado,
        seccion,
        fecha_admision,
        nombre_beca,
        porcentaje_beca,
        tipo_aplicacion,
        estado,
        nombre_encargado,
        fecha_aplicacion
      FROM "Pagos".reporte_becas_aplicadas(NULL, NULL, NULL)
      ${whereClause}
      ORDER BY porcentaje_beca DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error en getReporteBeca:", error);
      throw new Error("Error al obtener el reporte de becas");
    } finally {
      client.release();
    }
  }

  public async countReporteBeca(filters: { nombre_estudiante?: string; grado?: string; tipo_beneficio?: string }): Promise<number> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.nombre_estudiante) {
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
      values.push(`%${filters.nombre_estudiante}%`);
    }
    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }
    if (filters.tipo_beneficio) {
      where.push(`nombre_beca = $${paramIndex++}`);
      values.push(filters.tipo_beneficio);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT COUNT(*) FROM (
        SELECT * FROM "Pagos".reporte_becas_aplicadas(NULL, NULL, NULL)
      ) AS sub
      ${whereClause}
    `;

    try {
      const result = await client.query(query, values);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error("Error en countReporteBeca:", error);
      throw new Error("Error al contar el reporte de becas");
    } finally {
      client.release();
    }
  }

  // ======= ESTUDIANTE =======
  public async getReporteEstudiante(
    limit: number,
    offset: number,
    filters: { estudiante?: string; grado?: string; fecha?: string; estado?: string } = {}
  ): Promise<ReporteEstudianteType[]> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [limit, offset];
    let paramIndex = 3;

    if (filters.estudiante) {
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
      values.push(`%${filters.estudiante}%`);
    }

    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }

    if (filters.fecha) {
      where.push(`fecha_admision = $${paramIndex++}`);
      values.push(filters.fecha);
    }

    if (filters.estado) {
      where.push(`estado = $${paramIndex++}`);
      values.push(filters.estado);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT
        codigo_estudiante,
        nombre_estudiante,
        identidad,
        genero,
        edad,
        alergias,
        zurdo,
        discapacidad,
        grado,
        estado,
        plan_pago,
        encargado_principal,
        parentesco_principal,
        telefono_principal,
        encargado_secundario,
        parentesco_secundario,
        telefono_secundario
      FROM "Estudiantes".reporte_estudiantes(NULL, NULL, NULL)
      ${whereClause}
      ORDER BY nombre_estudiante ASC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener reporte de estudiantes:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async countReporteEstudiante(
    filters: { estudiante?: string; grado?: string; fecha?: string; estado?: string } = {}
  ): Promise<number> {
    const client = await this.db.getClient();
    const where: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.estudiante) {
      where.push(`unaccent(nombre_estudiante) ILIKE unaccent($${paramIndex++})`);
      values.push(`%${filters.estudiante}%`);
    }

    if (filters.grado) {
      where.push(`grado = $${paramIndex++}`);
      values.push(filters.grado);
    }

    if (filters.fecha) {
      where.push(`fecha_admision = $${paramIndex++}`);
      values.push(filters.fecha);
    }

    if (filters.estado) {
      where.push(`estado = $${paramIndex++}`);
      values.push(filters.estado);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT COUNT(*) FROM (
        SELECT * FROM "Estudiantes".reporte_estudiantes(NULL, NULL, NULL)
      ) t
      ${whereClause}
    `;

    try {
      const result = await client.query(query, values);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error("Error al contar reporte de estudiantes:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
