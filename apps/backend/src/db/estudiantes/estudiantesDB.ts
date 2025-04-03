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
    fecha_admision
  ) {
    try {
      const client = await this.db.getClient();

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
        console.log(error.code)
      if (error.code === "P0001") {
        throw new AppError("Ya existe un estudiante con esta identidad", 409);
      }

      throw new AppError(error.message || "Error al registrar estudiante", 500);
    }
  }
}
