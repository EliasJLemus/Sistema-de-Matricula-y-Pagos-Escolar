import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AutBD } from "@/db/authDB";
import { AppError } from "@/utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";
const authBD = new AutBD();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await authBD.getUserByEmail(email);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
      return;
    }

    const user = result;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user.password !== password ) {
      res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
      return;
    }

    const payload = {
      uuid: user.uuid,
      usuario: user.nombre_usuario,
      rol: user.rol,
      codigo: user.codigo_usuario
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token
    });

  } catch (error) {
    console.error("Error en el login:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error inesperado al iniciar sesión. Intente más tarde."
      });
    }
  }
};
