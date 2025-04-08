import {Router} from "express"
import {registroEstudiante,
    obtenerEstudiantes,
    obtenerEstudiantePorUuid,
    actualizarEstudiante,

} from "@/controller/estudiantes/estudiantesController"

import {registrarApoderado} from "@/controller/estudiantes/apoderadosController"

const studentRoute = Router();

studentRoute.post("/registro-estudiante", registroEstudiante)

studentRoute.get("/obtener-estudiantes", obtenerEstudiantes)

studentRoute.get("/obtener-estudiante/:uuid", obtenerEstudiantePorUuid);

studentRoute.put("/actualizar-estudiante/:uuid", actualizarEstudiante);

//**Apoderados */

studentRoute.post("/registro-apoderado", registrarApoderado)

export default studentRoute