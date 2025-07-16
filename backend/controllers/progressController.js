import UserProgress from '../models/UserProgress.js';


export const updateProgress = async (req, res) => {
  try {
    const { userId, topicId, completed } = req.body;
    const progress = await UserProgress.findOneAndUpdate(
      { userId, topicId },
      { completed, lastWatched: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.find({ userId })
      .populate({
        path: 'topicId',
        select: 'title',
        populate: {
          path: 'course',
          select: 'courseName category'
        }
      });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};