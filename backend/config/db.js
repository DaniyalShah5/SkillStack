import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = 'mongodb+srv://daniyalhcj:Daniyal19981@cluster0.btgpq.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
