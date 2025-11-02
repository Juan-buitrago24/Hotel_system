import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Accept either MONGODB_URI or MONGO_URI and fall back to a sensible local default
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel';

    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.warn('⚠️ No MONGODB_URI/MONGO_URI provided — falling back to local MongoDB at mongodb://127.0.0.1:27017/hotel');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
