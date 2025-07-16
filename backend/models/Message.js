import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  isFromUser: { 
    type: Boolean, 
    default: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
});

export default mongoose.model('Message', messageSchema);