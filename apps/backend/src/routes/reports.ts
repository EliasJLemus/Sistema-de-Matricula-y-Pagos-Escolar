import { Router } from "express"

 import {
    getReporteMatricula,
    getReporteMensualidad,
    getReporteEstudiante,
    getReporteBeca
 } from "../controller/reportes_controllers/detalladosControllers"

const reportRoute = Router();

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

reportRoute.get("/estudiante", getReporteEstudiante)

reportRoute.get("/beca", getReporteBeca)

export default reportRoute;