import {Router} from "express"
import {getMatriculasController,
    getMatriculaByEstudianteAndYearController,
    crearMatriculaController,
    getAllMatriculasController
} from "@/controller/pagos/matriculaController"

const pagosRoute = Router();


pagosRoute.get("/obtener-matricula", getMatriculasController);

pagosRoute.get("/matriculaByUuid/:uuid_estudiante", getMatriculaByEstudianteAndYearController);

pagosRoute.post("/creacion-matricula", crearMatriculaController)

pagosRoute.get("/matriculas", getAllMatriculasController);

export default pagosRoute