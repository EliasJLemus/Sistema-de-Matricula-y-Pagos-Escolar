import { Router } from "express"
import {
    generatePaymentsReport
 } from "../controller/reportsController"
 import {
    getReporteMatricula
 } from "../controller/reportes_controllers/detalladosControllers"

const reportRoute = Router();

reportRoute.get("/download", generatePaymentsReport)

reportRoute.get("/reporte-matricula", getReporteMatricula)

export default reportRoute;