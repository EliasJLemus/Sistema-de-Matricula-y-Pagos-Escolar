import {Database} from "@/db/service"
import { AppError } from "@/utils/AppError";

export class Apoderados {
  private db: Database;

  constructor(){
    this.db = new Database();
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