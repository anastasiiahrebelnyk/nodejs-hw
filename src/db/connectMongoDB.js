import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log('Successfully connect database');
  } catch (error) {
    console.log('Failed connect database', error.message);
    // throw error;
    process.exit(1);
  }
};
