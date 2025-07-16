import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Topic from '../models/Topic.js';


export const deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        const deletedTopic = await Topic.findByIdAndDelete(topicId);
        if (!deletedTopic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        await Course.updateMany(
            { topics: topicId },
            { $pull: { topics: topicId } }
        );

        res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await Topic.deleteMany({ _id: { $in: course.topics } });

        await Course.findByIdAndDelete(courseId);

        await Category.updateMany(
            { courses: courseId },
            { $pull: { courses: courseId } }
        );

        res.status(200).json({ message: 'Course and associated topics deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        for (const courseId of category.courses) {
            const course = await Course.findById(courseId);
            if (course) {
                await Topic.deleteMany({ _id: { $in: course.topics } });
            }
        }

        await Course.deleteMany({ _id: { $in: category.courses } });

        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ message: 'Category and all associated content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};