import {Database} from "../service"
import {ReporteMatriculaDBType} from "../../controller/reportes_controllers/types/matriculaType";


export class ReporteDetalladoDB {

    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getReporteMatricula(){
        try{

            const client = await this.db.getClient();

            const query = `
                SELECT 
                nombre_estudiante, 
                grado, seccion, 
                tarifa_matricula, beneficio_aplicado, descuento, total_pagar, estado, fecha_matricula
	            FROM sistema.reporte_matricula
            `

            const result = await client.query(query);

            return result

        }catch(error){
            throw error;
        }
    }
}