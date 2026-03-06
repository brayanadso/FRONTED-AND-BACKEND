import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    await mongoose.connect(uri);
    console.log("✅ Conectado a la base de datos MongoDB Atlas");
};

export default connectDB;