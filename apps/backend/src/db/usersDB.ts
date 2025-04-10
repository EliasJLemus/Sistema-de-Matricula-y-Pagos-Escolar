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
            const query = `INSERT INTO "Administracion"."Usuarios" (nombre_usuario, correo, password, rol)
                            VALUES ($1, $2, $3, $4)
                            `
                            
                            ;
            
            const values = [nombre_usuario, correo, password, rol];

            await client.query(query, values);
            
            return true;

        }catch(error){
            console.error("Error en la BD autenticacion")
            throw new AppError("Hubo un error al momento de crear el usuario. favor intente mas tarde", 500, "BDError")
        }
    }
}