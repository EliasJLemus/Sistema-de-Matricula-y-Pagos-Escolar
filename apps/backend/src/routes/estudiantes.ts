import {Router} from "express"
import {registroEstudiante,
    obtenerEstudiantes
} from "@/controller/estudiantes/estudiantesController"

const studentRoute = Router();

studentRoute.post("/registro-estudiante", registroEstudiante)

studentRoute.get("/obtener-estudiantes", obtenerEstudiantes)

export default studentRoute