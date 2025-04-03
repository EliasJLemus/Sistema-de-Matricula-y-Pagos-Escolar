import express, {json} from "express";
import {Keys} from "./keys";
import reportsRoute from "./routes/reports"
import studentRoute from "@/routes/estudiantes"
import cors from "cors";

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

app.listen(Keys.Port, ()=> {
    console.log(`Server running on port ${Keys.Port}`);
})