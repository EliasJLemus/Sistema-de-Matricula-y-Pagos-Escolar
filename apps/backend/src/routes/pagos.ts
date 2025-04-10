import {Router} from "express"
import {getMatriculasController,
    getMatriculaByEstudianteAndYearController,
    crearMatriculaController,
    getAllMatriculasController,
    obtenerMatriculaPorUuid,
    actualizarEstadoComprobanteController,
    getPlanPagoDetalladoByEstudiante
} from "@/controller/pagos/matriculaController"

const pagosRoute = Router();


pagosRoute.get("/obtener-matricula", getMatriculasController);

pagosRoute.get("/matriculaByUuid/:uuid_estudiante", getMatriculaByEstudianteAndYearController);

pagosRoute.post("/creacion-matricula", crearMatriculaController)

pagosRoute.get("/matriculas", getAllMatriculasController);

pagosRoute.get("/matricula/:uuid", obtenerMatriculaPorUuid);

pagosRoute.patch("/comprobante/:uuid", actualizarEstadoComprobanteController);

pagosRoute.get("/plan-detallado/:uuid", getPlanPagoDetalladoByEstudiante);



export default pagosRoute