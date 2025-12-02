// db/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("✅ Conectado a la base de datos MongoDB Atlas");
    } catch (err) {
        console.error("❌ Error de conexión a la base de datos:", err);
        process.exit(1);
    }
};

export default connectDB;