import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  chatPassActive: { type: Boolean, default: false },
  subscriptionEnd: Date,
  subscriptionPlan: { 
    type: String, 
    enum: ['Weekly Pass', 'Monthly Pass', 'Yearly Pass', null],
    default: null 
  },
  role: { type: String, enum: ['user', 'mentor', 'admin'], default: 'user' }
});

export default mongoose.model('User', userSchema);
