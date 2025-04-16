import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import {UsersDB} from "@/db/usersDB";

const usersDB = new UsersDB();

export const createUserController = async (req: Request, res: Response) => {
    try{
        const {nombre_usuario, correo, password, rol} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await usersDB.createUser(nombre_usuario, correo, hashedPassword, rol);

        if(user){
            res.status(201).json({
                success: true,
                message: "Usuario creado correctamente",
                user: {
                    nombre_usuario,
                    correo,
                    rol
                }
            })
            return;
        }
        
        res.status(400).json({
            success: false,
            message: "Error al crear el usuario"
        })

    }catch(error){
        console.error("Error en el controlador de usuarios", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        })
    }
}