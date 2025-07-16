import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Topic from '../models/Topic.js';

// Delete a topic and remove its reference from the parent course
export const deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Find and delete the topic
        const deletedTopic = await Topic.findByIdAndDelete(topicId);
        if (!deletedTopic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Remove the topic reference from any courses that contain it
        await Course.updateMany(
            { topics: topicId },
            { $pull: { topics: topicId } }
        );

        res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a course and all its associated topics
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course first to get its topics
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Delete all topics associated with the course
        await Topic.deleteMany({ _id: { $in: course.topics } });

        // Delete the course itself
        await Course.findByIdAndDelete(courseId);

        // Remove the course reference from any categories that contain it
        await Category.updateMany(
            { courses: courseId },
            { $pull: { courses: courseId } }
        );

        res.status(200).json({ message: 'Course and associated topics deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category and all its associated courses and topics
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find the category first to get its courses
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // For each course in the category
        for (const courseId of category.courses) {
            // Find the course to get its topics
            const course = await Course.findById(courseId);
            if (course) {
                // Delete all topics associated with the course
                await Topic.deleteMany({ _id: { $in: course.topics } });
            }
        }

        // Delete all courses in the category
        await Course.deleteMany({ _id: { $in: category.courses } });

        // Finally, delete the category itself
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ message: 'Category and all associated content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};