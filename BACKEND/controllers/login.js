import bcrypt from "bcrypt";
import User from "../models/user.js";

export const loginUsuario = async (req, res) => {
    try{
        const {Correo, Password} = req.body;

        //validar que todos los campos esten llenos

        if (!Correo || !Password){
            return res.status(400).json({message:"Correo y contraseña obligatorios"});
        }
        //verificar si el usuario si esta registrado
        const usuario = await User.findOne({ Correo });
        if (!usuario){
            return res.status(400).json({message:"Usuario no resgistrado"});
        }
        //comparar la contraseña
        const Passwordvalida = await bcrypt.compare(Password, usuario.Password)
        if (!Passwordvalida){
            return res.status(401).json({message:"Contraseña incorrecta"});
        }
        //Validacion de inicio sesion correcta
        res.status(200).json({message:"Inicio de sesion correcta"});

    } catch (error) { 
        res.status(500).json({message:"Error de inicio de sesion",error: error.message})
    }
}