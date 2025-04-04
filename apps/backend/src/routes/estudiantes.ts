import {Router} from "express"
import {registroEstudiante,
    obtenerEstudiantes,
    obtenerEstudiantePorUuid,
    actualizarEstudiante
} from "@/controller/estudiantes/estudiantesController"

const studentRoute = Router();

studentRoute.post("/registro-estudiante", registroEstudiante)

studentRoute.get("/obtener-estudiantes", obtenerEstudiantes)

studentRoute.get("/obtener-estudiante/:uuid", obtenerEstudiantePorUuid);

studentRoute.put("/actualizar-estudiante/:uuid", actualizarEstudiante);

export default studentRoute