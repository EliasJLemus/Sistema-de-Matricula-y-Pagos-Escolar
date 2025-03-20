import express, {json} from "express";
import {Keys} from "./keys";
import reportsRoute from "./routes/reports"
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

app.listen(Keys.Port, ()=> {
    console.log(`Server running on port ${Keys.Port}`);
})