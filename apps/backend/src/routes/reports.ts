import { Router } from "express"

 import {
    getReporteMatricula,
    getReporteMensualidad,
    getReporteEstudiante,
    getReporteBeca
 } from "../controller/reportes_controllers/detalladosControllers"

 import {getReportePagosPendientes,
   getReporteFinancieroAnual,

 } from "@/controller/reportes_controllers/sintetizadosControllers"

const reportRoute = Router();

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

reportRoute.get("/estudiante", getReporteEstudiante)

reportRoute.get("/beca", getReporteBeca)

/**Sintetizados */
reportRoute.get("/pagos-pendientes", getReportePagosPendientes)

reportRoute.get("/financiero-anual", getReporteFinancieroAnual)

export default reportRoute;