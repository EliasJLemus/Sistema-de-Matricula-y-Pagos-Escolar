import {Database} from "../service"
import {NiveladoTableType} from "@shared/pagos"

export class PagosNiveladoDB {
    private db: Database;

    constructor (){
        this.db = new Database();
    }

    public async getNiveladoAll(
        limit?: number,
        offset?: number,
        nombre?: string,
        grado?: string,
        estado? : string,
        fecha_pago?: string
    ):Promise<{
        data: NiveladoTableType[],
        total: number
    }>{
        try{
            const client = await this.db.getClient();

            const query = `SELECT * FROM "Pagos".nivelado_tabla_detalle($3, $4, $5, $6)
            LIMIT $1 OFFSET $2
            ;`
            const countQuery = `SELECT COUNT(*) FROM "Pagos".nivelado_tabla_detalle($1, $2, $3, $4)`

            const values = [
                limit,
                offset,
                nombre,
                grado,
                estado,
                fecha_pago
            ]
            const countValues = [
                nombre,
                grado,
                estado,
                fecha_pago
            ]

            const [result, countResult] = await Promise.all([
                client.query(query, values),
                client.query(countQuery, countValues)
            ]);

            client.release();

            if(result.rows.length === 0){
                return null;
            }
            return {
                data: result.rows,
                total: parseInt(countResult.rows[0].count)
            }
        }catch(error){
            console.error("Error al obtener los datos de la tabla Nivelado")
            throw new Error("Error al obtener los datos de la tabla Nivelado")
        }
    }
}