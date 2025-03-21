import { Router } from "express"
import {
    generatePaymentsReport
 } from "../controller/reportsController"
 import {
    getReporteMatricula,
    getReporteMensualidad,
    getReporteEstudiante
 } from "../controller/reportes_controllers/detalladosControllers"

const reportRoute = Router();

reportRoute.get("/download", generatePaymentsReport)

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

reportRoute.get("/estudiante", getReporteEstudiante)

export default reportRoute;