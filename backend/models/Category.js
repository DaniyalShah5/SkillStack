import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

export default mongoose.model('Category', categoriesSchema);
