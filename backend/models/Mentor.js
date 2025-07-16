// models/Mentor.js
import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: [String],
  activeChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }]
});

export default mongoose.model('Mentor', mentorSchema);