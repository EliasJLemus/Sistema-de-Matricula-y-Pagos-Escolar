import { Router } from "express"

 import {
    getReporteMatricula,
    getReporteMensualidad,
    getReporteEstudiante,
    getReporteBeca
 } from "../controller/reportes_controllers/detalladosControllers"

 import {getReportePagosPendientes,
   getReporteFinancieroAnual,
   getReporteRetiroEstudiante
 } from "@/controller/reportes_controllers/sintetizadosControllers"

 import {getReporteAntiguedad} from "@/controller/reportes_controllers/experimentalController"

const reportRoute = Router();

reportRoute.get("/matricula", getReporteMatricula)

reportRoute.get("/mensualidad", getReporteMensualidad)

reportRoute.get("/estudiante", getReporteEstudiante)

reportRoute.get("/beca", getReporteBeca)

/**Sintetizados */
reportRoute.get("/pagos-pendientes", getReportePagosPendientes)

reportRoute.get("/financiero-anual", getReporteFinancieroAnual)

reportRoute.get("/retiro-estudiante", getReporteRetiroEstudiante)

//antiguedad
reportRoute.get("/antiguedad-estudiante", getReporteAntiguedad)

export default reportRoute;