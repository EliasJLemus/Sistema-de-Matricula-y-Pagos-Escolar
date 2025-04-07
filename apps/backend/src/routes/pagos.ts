import {Router} from "express"
import {getMatriculasController} from "@/controller/pagos/matriculaController"

const pagosRoute = Router();


pagosRoute.get("/obtener-matricula", getMatriculasController);

export default pagosRoute