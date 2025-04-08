import {Router} from "express"
import {getMatriculasController,
    getMatriculaByEstudianteAndYearController,
    crearMatriculaController
} from "@/controller/pagos/matriculaController"

const pagosRoute = Router();


pagosRoute.get("/obtener-matricula", getMatriculasController);

pagosRoute.get("/matriculaByUuid/:uuid_estudiante", getMatriculaByEstudianteAndYearController);

pagosRoute.post("/creacion-matricula", crearMatriculaController)

export default pagosRoute