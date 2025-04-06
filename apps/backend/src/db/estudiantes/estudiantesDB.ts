import { EstudiantesTablaType } from "@shared/estudiantesType";
import { Database } from "../service";
import { AppError } from "@/utils/AppError";

export class Estudiantes {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  // REGISTRAR ESTUDIANTE
  public async registrarEstudiante(
    uuid,
    uuidInfoGeneral,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    identidad,
    nacionalidad,
    genero,
    fecha_nacimiento,
    edad,
    direccion,
    nombre_grado,
    seccion,
    es_zurdo,
    dif_educacion_fisica,
    reaccion_alergica,
    descripcion_alergica,
    tipo_persona,
    fecha_admision,
    tipo_pago?
  ) {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT * FROM "Estudiantes".registrar_estudiante(
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20
        );
      `;

      const values = [
        uuid,
        uuidInfoGeneral,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        identidad,
        nacionalidad,
        genero,
        fecha_nacimiento,
        edad,
        direccion,
        nombre_grado,
        seccion,
        es_zurdo,
        dif_educacion_fisica,
        reaccion_alergica,
        descripcion_alergica,
        tipo_persona,
        fecha_admision,
      ];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new AppError("No se pudo registrar el estudiante", 500);
      }

      return result.rows[0];
    } catch (error: any) {
      console.log(error.code);
      if (error.code === "P0001") {
        throw new AppError("Ya existe un estudiante con esta identidad", 409);
      }
      throw new AppError(error.message || "Error al registrar estudiante", 500);
    } finally {
      client.release();
    }
  }

  // OBTENER ESTUDIANTES
  public async obtenerEstudiantes(
    limite: number,
    offset: number,
    filters: { nombre?: string; grado?: string; estado?: string }
  ): Promise<EstudiantesTablaType[]> {
    const client = await this.db.getClient();
    try {
      let baseQuery = `SELECT * FROM "Estudiantes".vw_estudiantes`;
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (filters.nombre) {
        conditions.push(`(primer_nombre ILIKE $${idx} OR segundo_nombre ILIKE $${idx} OR primer_apellido ILIKE $${idx} OR segundo_apellido ILIKE $${idx})`);
        values.push(`%${filters.nombre}%`);
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

      baseQuery += " ORDER BY codigo_estudiante DESC";
      baseQuery += ` LIMIT $${idx} OFFSET $${idx + 1}`;
      values.push(limite, offset);

      const result = await client.query(baseQuery, values);
      return result.rows;
    } catch (error: any) {
      console.error(error);
      throw new AppError("Error al obtener estudiantes", 500);
    } finally {
      client.release();
    }
  }

  // CONTAR ESTUDIANTES
  public async countEstudiantes(
    filters: { estudiante?: string; grado?: string; fecha?: string; estado?: string } = {}
  ): Promise<number> {
    const client = await this.db.getClient();
    try {
      const where: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (filters.estudiante) {
        where.push(`(unaccent(primer_nombre) ILIKE unaccent($${paramIndex}) OR unaccent(primer_apellido) ILIKE unaccent($${paramIndex}))`);
        values.push(`%${filters.estudiante}%`);
        paramIndex++;
      }

      if (filters.grado) {
        where.push(`grado = $${paramIndex}`);
        values.push(filters.grado);
        paramIndex++;
      }

      if (filters.fecha) {
        where.push(`fecha_admision = $${paramIndex}`);
        values.push(filters.fecha);
        paramIndex++;
      }

      if (filters.estado) {
        where.push(`estado = $${paramIndex}`);
        values.push(filters.estado);
        paramIndex++;
      }

      const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
      const query = `SELECT COUNT(*) as total FROM "Estudiantes".vw_estudiantes ${whereClause};`;
      const result = await client.query(query, values);
      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error("Error al obtener el total de estudiantes:", error);
      throw new AppError("Error al obtener el total de estudiantes", 500);
    } finally {
      client.release();
    }
  }

  // OBTENER ESTUDIANTE POR UUID
  public async obtenerEstudiantePorUuid(uuid: string): Promise<EstudiantesTablaType> {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT *
        FROM "Estudiantes".vw_estudiantes
        WHERE uuid = $1;
      `;
      const result = await client.query(query, [uuid]);
      if (result.rowCount === 0) {
        throw new AppError("Estudiante no encontrado", 404);
      }
      return result.rows[0] as EstudiantesTablaType;
    } catch (error) {
      console.error("Error al obtener el estudiante por UUID:", error);
      throw new AppError("Error al obtener el estudiante", 500);
    } finally {
      client.release();
    }
  }

  // ACTUALIZAR ESTUDIANTE
  public async actualizarEstudiante(
    uuid_estudiante: string,
    primer_nombre: string,
    segundo_nombre: string,
    primer_apellido: string,
    segundo_apellido: string,
    nacionalidad: string,
    identidad: string,
    genero: string,
    fecha_nacimiento: Date,
    edad: number,
    direccion: string,
    nombre_grado: string,
    seccion: string,
    es_zurdo: boolean,
    dif_educacion_fisica: boolean,
    reaccion_alergica: boolean,
    descripcion_alergica: string,
    tipo_persona: string,
    fecha_admision: Date,
    estado: string
  ): Promise<void> {
    const client = await this.db.getClient();
    try {
      const query = `
        SELECT * FROM "Estudiantes".actualizar_estudiante(
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20
        )
      `;
      const values = [
        uuid_estudiante,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        nacionalidad,
        identidad,
        genero,
        fecha_nacimiento,
        edad,
        direccion,
        nombre_grado,
        seccion,
        es_zurdo,
        dif_educacion_fisica,
        reaccion_alergica,
        descripcion_alergica,
        tipo_persona,
        fecha_admision,
        estado,
      ];
      await client.query(query, values);
    } catch (error: any) {
      if (error.code === 'P0001') {
        throw new AppError("El estudiante no fue encontrado.", 404);
      }
      if (error.code === 'P0002') {
        throw new AppError("Grado y sección no válidos.", 400);
      }
      throw new AppError("Error al actualizar estudiante.", 500);
    } finally {
      client.release();
    }
  }
}
