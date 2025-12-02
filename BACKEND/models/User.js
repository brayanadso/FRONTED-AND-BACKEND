// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true,
        trim: true
    },
    Apellido: {
        type: String,
        required: true,
        trim: true
    },
    Correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    Password: {
        type: String,
        required: true
    },
    Telefono: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    versionKey: false
});

// Método para no devolver la contraseña en las respuestas
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.Password;
    return user;
};

export default mongoose.model('User', userSchema, 'Usuarios');