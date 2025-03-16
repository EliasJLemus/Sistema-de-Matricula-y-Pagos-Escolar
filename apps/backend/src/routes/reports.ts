import { Router } from "express"
import {
    generatePaymentsReport
 } from "../controller/reportsController"

const reportRoute = Router();

reportRoute.get("/download", generatePaymentsReport)

export default reportRoute;