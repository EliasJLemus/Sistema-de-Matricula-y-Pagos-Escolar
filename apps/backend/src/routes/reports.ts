import { Router } from "express"
import {
    generatePaymentsReport
 } from "../controller/reportsController"
 import {
    getReporteMatricula,
    getReporteMensualidad
 } from "../controller/reportes_controllers/detalladosControllers"

const reportRoute = Router();

reportRoute.get("/download", generatePaymentsReport)

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

export default reportRoute;