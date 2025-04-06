import {Database} from "@/db/service";
import { AppError } from "@/utils/AppError";

export class AutBD {
    private db: Database;

    constructor(){
        this.db = new Database();
    }

    public async getUserByEmail(email: string){

        try{
            const client = await this.db.getClient();
        const query = `SELECT * FROM "Administracion"."Usuarios"
                        WHERE correo = $1`;
        
        const values = [email];

        const result = await client.query(query, values);

        if(result.rowCount === 0){
            return false;
        }
        return result.rows[0];
        }catch(error){
            console.error("Error en la BD autenticacion")
            throw new AppError("Hubo un error al momento de iniciar Sesion. favor intente mas tarde", 500, "BDError")
        }

    }
}