import {Router} from "express"
import {registroEstudiante} from "@/controller/estudiantes/estudiantesController"

const studentRoute = Router();

studentRoute.post("/registro-estudiante", registroEstudiante)

export default studentRoute