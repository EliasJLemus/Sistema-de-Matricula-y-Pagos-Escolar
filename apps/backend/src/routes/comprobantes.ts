import {Router} from "express"

const comprobanteRoute = Router()

import {getInfoParaComprobanteController} from "@/controller/comprobantes/matriculaComprobanteController"


comprobanteRoute.get("/comprobante-matricula/:uuid_comprobante", getInfoParaComprobanteController)

export default comprobanteRoute