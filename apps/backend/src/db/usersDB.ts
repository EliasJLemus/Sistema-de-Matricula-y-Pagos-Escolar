import {Database} from "@/db/service";
import { AppError } from "@/utils/AppError";

export class UsersDB {
    private db: Database;

    constructor(){
        this.db = new Database();
    }

    public async createUser(nombre_usuario: string, correo: string, password: string, rol: string){
        try{
            const client = await this.db.getClient();
            const query = `INSERT INTO "Administracion"."Usuarios" (nombre_usuario, correo, password, rol, uuid)
                            VALUES ($1, $2, $3, $4, gen_random_uuid())
                            `
                            ;
            
            const values = [nombre_usuario, correo, password, rol];

            await client.query(query, values);
            
            return true;

        }catch(error){
            console.error("Error en la BD autenticacion")
            throw new Error(error.message);
        }
    }
}