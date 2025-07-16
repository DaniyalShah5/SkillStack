import mongoose from 'mongoose';

const topicsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoLink: { type: String },
  documentHead:{type : String},
  documentBody:{type: String},
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
});

export default mongoose.model('Topic', topicsSchema);
