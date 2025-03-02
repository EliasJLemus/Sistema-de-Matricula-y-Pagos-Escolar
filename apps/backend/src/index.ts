import express, {json} from "express";
import {Keys} from "./keys";

const app = express();

app.use(json());

app.use("/", (req, res) => {
    res.json({message: "Probando una ruta random en el backend"})
})

app.listen(Keys.Port, ()=> {
    console.log(`Server running on port ${Keys.Port}`);
})