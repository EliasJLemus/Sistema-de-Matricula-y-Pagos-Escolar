import { off } from "process";
import {Database} from "../service";
import {MensualidadTableType} from "@shared/pagos"

export class PagosMensualidadDB {
    private db: Database;

     constructor(){
        this.db = new Database();
     }

     public async getMensualidadAll (
        limit?: number,
        offset?: number,
        nombre?: string,
        grado?: string,
        estado?: string,
        fecha_vencimiento?: string
     ): Promise<{
        data: MensualidadTableType[]
        total: number
     }> {
        try{
            const client = await this.db.getClient();

            const query = `SELECT * FROM 
            "Pagos".mensualidad_tabla_detalle($3, $4, $5, $6)
            LIMIT $1 OFFSET $2
            ;
            `
            const countQuery = `SELECT COUNT(*) FROM "Pagos".mensualidad_tabla_detalle($1, $2, $3, $4);`
           
            const values = [limit,
                offset,
                nombre,
                grado,
                estado,
                fecha_vencimiento
            ]
        const countValues = [
            nombre,
            grado,
            estado,
            fecha_vencimiento
        ]

           const [result, countResult] = await Promise.all([
            client.query(query, values),
            client.query(countQuery, countValues)
           ])

           client.release();

            if(result.rows.length === 0 ){
                return null;
            }

            return {
                data: result.rows,
                total: parseInt(countResult.rows[0].count)
            };

        }catch(error){
            console.error("Error al obtener los datos de mensualidad:", error);
            throw new Error("Error al obtener los datos de mensualidad");
        }
     }
}