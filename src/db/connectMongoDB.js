import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log('Successfully connect database');
  } catch (error) {
    console.log('Failed connect database', error.message);
    throw error;
  }
};

export default connectDatabase;
