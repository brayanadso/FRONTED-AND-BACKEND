import mongoose from 'mongoose';

const uri = "mongodb+srv://brayan_ortiz:Brayan1282@cluster0.jl8dqjk.mongodb.net/TIENDA?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(()=> console.log(" ✅ Conectado a la base de datos "))
.catch(err => console.error(" ❌ Error de conexion a la base de datos ", err));