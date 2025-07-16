import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Topic from '../models/Topic.js';

export const createOrUpdate = async (req, res) => {
  const { categoryName, courseName, topic } = req.body;

  try {
    let category = await Category.findOne({ categoryName });
    if (!category) {
      category = new Category({ categoryName, courses: [] });
      await category.save();
    }

    let course = await Course.findOne({ courseName });
    if (!course) {
      course = new Course({ courseName, description: topic?.description || "", topics: [] });
      await course.save();

      if (!category.courses.includes(course._id)) {
        category.courses.push(course._id);
        await category.save();
      }
    }

    let topicRecord = await Topic.findOne({ title: topic?.title });
    if (!topicRecord) {
      topicRecord = new Topic({ title: topic?.title, description: topic?.description || "", videoLink: topic?.videoLink || "" , documentHead: topic?.documentHead || "" , documentBody: topic?.documentBody || ""});
      await topicRecord.save();

      if (!course.topics.includes(topicRecord._id)) {
        course.topics.push(topicRecord._id);
        await course.save();
      }
    }

    res.status(201).json({ message: "Data processed successfully", category, course, topic: topicRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAll = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({ path: 'courses', populate: { path: 'topics' } })
      .exec();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourseDescription = async(req, res) =>{
  try{
    const { courseId} = req.params;
    const {description} = req.body;
    if(!description){
      return res.status(400).json({error:'Description is required'})
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {description},
      {new:true}
    )
    if(!updatedCourse){
      return res.status(400).json({error:'Course not found'})
    }
    res.status(200).json({
      message:'Course description updated successfully',
      course: updatedCourse
    })
  }catch(error){
    console.error('Error updating course description:', error);
        res.status(500).json({ error: 'Failed to update course description' });
  }
}

export const getCourseDescription =async(req, res)=>{
  try{
    const {courseId} = req.params;
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(400).json({error:'Course not found'})
    }
    res.status(200).json({
      description: course.description,
      courseName: course.courseName
  });
  }catch(error){
    console.error('Error fetching course description:', error);
    res.status(500).json({ error: 'Failed to fetch course description' });
  }
}
