import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
});

export default mongoose.model('Course', coursesSchema);
