import {Database} from "@/db/service"
import { AppError } from "@/utils/AppError";

export class Apoderados {
  private db: Database;

  constructor(){
    this.db = new Database();
  }

  //Obtener Apoderados
  public async getApoderados(
    limit: number,
    offset: number,
  )
  {
    try{

      const client = await this.db.getClient();

      const query = `SELECT * FROM "Estudiantes".obtener_apoderados_tabla($1, $2)
      ORDER BY codigo_encargado
      LIMIT $1 OFFSET $2
      ;`

      const countQuery = `SELECT COUNT(*) FROM "Estudiantes".obtener_apoderados_tabla()`

      const [result, countResult] = await Promise.all([
        client.query(query, [limit, offset]),
        client.query(countQuery)
      ]);

      client.release();

      return {
        data: result.rows,
        total: parseInt(countResult.rows[0].count)
      }
    }catch(error){
      console.error("Error al obtener apoderados:", error);
      throw new AppError("Error al obtener apoderados", 500);
    }
  }

    //Registrar Apoderados
    public async reistrarApoderado(
      primer_nombre: string,
      segundo_nombre: string,
      primer_apellido: string,
      segundo_apellido: string,
      identidad: string,
      genero: string,
      fecha_nacimiento: string,
      correo: string,
      telefono: string,
      es_apoderado: boolean,
      parentesco: string,
      uuid_estudiante: string
    ){
      try{
        const client = await this.db.getClient();
        const query = `SELECT * FROM "Estudiantes".registrar_encargado(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12
        )`;

        const values = [
          primer_nombre,
          segundo_nombre,
          primer_apellido,
          segundo_apellido,
          identidad,
          genero,
          fecha_nacimiento,
          correo,
          telefono,
          es_apoderado,
          parentesco,
          uuid_estudiante
        ];

        const result = await client.query(query, values);

        if(result.rowCount === 0){
          throw new AppError("No se pudo registrar el apoderado", 400);
        }

        return result.rows[0];
      }catch(error){
        console.error("Error al registrar apoderado:", error);
        throw new AppError("Error al registrar apoderado", 500);
      }
    }
}