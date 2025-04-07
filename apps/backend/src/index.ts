import express, {json} from "express";
import {Keys} from "./keys";
import reportsRoute from "./routes/reports"
import studentRoute from "@/routes/estudiantes"
import cors from "cors";
import {login} from "@/controller/autController"
import pagosRoute from "@/routes/pagos"
// import "../src/db/estudiantes/apoderadosDB"

const app = express();

app.use(json());

app.use(cors({
    origin: "*"
}))

// app.use("/", (req, res) => {
//     res.json({message: "Probando una ruta random en el backend"})
// })

app.use("/reportes", reportsRoute);

app.use("/estudiantes", studentRoute)

app.use("/pagos", pagosRoute)

app.use("/login", login)

app.listen(Keys.Port, ()=> {
    console.log(`Server running on port ${Keys.Port}`);
})