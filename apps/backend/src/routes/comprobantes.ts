import {Router} from "express"
import multer from "multer";
import path from "path";
import { subirComprobanteMatriculaController } from "@/controller/comprobantes/matriculaComprobanteController";


const comprobanteRoute = Router()

//Configuracion
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads/comprobantesMatricula"),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `comprobante-${timestamp}${ext}`);
    },
  });

  const upload = multer({storage})

import {getInfoParaComprobanteController} from "@/controller/comprobantes/matriculaComprobanteController"


comprobanteRoute.get("/comprobante-matricula/:uuid_comprobante", getInfoParaComprobanteController)

comprobanteRoute.post(
    "/subir-comprobante-matricula/:uuid_comprobante",
    upload.single("comprobante"),
    subirComprobanteMatriculaController
  );

export default comprobanteRoute