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
    },

    rol : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Nuevos campos para la recuperación de contraseña
    resetPasswordCode: String, // Para almacenar el código de 6 dígitos
    resetPasswordExpires: Date // Para almacenar el tiempo de expiración
}, {
    timestamps: true,
    versionKey: false
});

// Método para no devolver la contraseña en las respuestas
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.Password;
    // Opcional: también podrías eliminar los campos de código temporal si no quieres exponerlos
    delete user.resetPasswordCode;
    delete user.resetPasswordExpires;
    return user;
};

export default mongoose.model('User', userSchema, 'Usuarios');