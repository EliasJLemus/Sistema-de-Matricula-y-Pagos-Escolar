import { Router } from "express"

 import {
    getReporteMatricula,
    getReporteMensualidad,
    getReporteEstudiante
 } from "../controller/reportes_controllers/detalladosControllers"

const reportRoute = Router();

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

reportRoute.get("/estudiante", getReporteEstudiante)

export default reportRoute;