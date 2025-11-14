import User from "../models/user.js"; 
import bcrypt from "bcrypt";


export const registrarUser = async (req, res) => {
     try {
        const {Nombre,Apellido,Telefono,Correo,Password}=req.body;

//validar que no falte ningun campo

         if (!Nombre || !Apellido || !Telefono || !Correo || !Password){
        return res.status(400).json({message:"Todos los campos son obligatorio"});
    }
    //verificar si el usuario ya existe
    const existeUser = await User.findOne({ Correo });
    if (existeUser){
        return res.status(400).json({message:"El usuario ya existe"});
    }
    //Ebcriptar la contraseña
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    //crear y guardar el nuevo usuario

    const nuevoUsuario = new User({Nombre,Apellido,Telefono,Correo,Password:hashedPassword});
    await nuevoUsuario.save();
    res.status(201).json({message:"Usuario registrado correctamente"});

} catch (error) {
    res.status(500).json({message:"Error al registrar el usuario", error: error.message});
    }
};

