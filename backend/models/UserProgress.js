import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  completed: { type: Boolean, default: false },
  lastWatched: { type: Date, default: Date.now },
});

export default mongoose.model('UserProgress', userProgressSchema);



