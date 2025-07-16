import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalType, setModalType] = useState("category");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    courseName: "",
    topic: {
      title: "",
      description: "",
      videoLink: "",
      documentHead: "",
      documentBody: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/get-courses-info`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/create-or-update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete category");
      await fetchCategories(); 
    } catch (error) {
      console.error("Error deleting category:", error);
      
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      await fetchCategories(); 
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete topic");
      await fetchCategories(); 
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setModalMode("view");
  };

  const renderForm = () => (
    <Formik initialValues={formData} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <Field
              type="text"
              name="categoryName"
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <Field
              type="text"
              name="courseName"
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500  focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Topic Title
            </label>
            <Field
              type="text"
              name="topic.title"
              className="mt-1 block w-full focus:outline-none rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Topic Description
            </label>
            <Field
              as="textarea"
              name="topic.description"
              className="mt-1 block w-full focus:outline-none rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video Link
            </label>
            <Field
              type="text"
              name="topic.videoLink"
              className="mt-1 block w-full rounded-md focus:outline-none border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Head
            </label>
            <Field
              as="textarea"
              name="topic.documentHead"
              className="mt-1 block w-full rounded-md border-gray-300 focus:outline-none text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Body
            </label>
            <Field
              as="textarea"
              name="topic.documentBody"
              className="mt-1 block w-full rounded-md border-gray-300 focus:outline-none text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  const renderTopicsModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCategory?.categoryName} - Topics
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedCategory(null);
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {selectedCategory?.courses?.map((course) => (
            <div key={course._id} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {course.courseName}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {course.topics?.map((topic) => (
                  <div key={topic._id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      {topic.title}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Description:</span>{" "}
                        {topic.description}
                      </p>
                      {topic.videoLink && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Video Link:</span>{" "}
                          <a
                            href={topic.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {topic.videoLink}
                          </a>
                        </p>
                      )}
                      {topic.documentHead && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Document Head:</span>
                          <div className="mt-1 bg-white p-2 rounded">
                            {topic.documentHead}
                          </div>
                        </div>
                      )}
                      {topic.documentBody && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Document Body:</span>
                          <div className="mt-1 bg-white p-2 rounded">
                            {topic.documentBody}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!course.topics || course.topics.length === 0) && (
                  <p className="text-sm text-gray-500 italic">
                    No topics available for this course
                  </p>
                )}
              </div>
            </div>
          ))}
          {(!selectedCategory?.courses ||
            selectedCategory.courses.length === 0) && (
            <p className="text-sm text-gray-500 italic">
              No courses available in this category
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Topics
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.categoryName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {category.courses?.length || 0} courses
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {category.courses?.reduce(
                      (total, course) => total + (course.topics?.length || 0),
                      0
                    )}{" "}
                    topics
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      handleViewDetails(category);
                      setModalType("category");
                      setModalMode("view");
                      setFormData({
                        categoryName: category.categoryName,
                      });
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category._id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {category.categoryName}
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Total Courses: {category.courses?.length || 0}
              </p>
              <p className="text-sm text-gray-500">
                Total Topics:{" "}
                {category.courses?.reduce(
                  (total, course) => total + (course.topics?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="space-y-2">
              {category.courses?.map((course) => (
                <div key={course._id} className="text-sm">
                  <p className="font-medium text-gray-900">
                    {course.courseName}
                  </p>
                  <p className="text-gray-500 ml-4">
                    Topics: {course.topics?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                List View
              </button>
            </div>
            <button
              onClick={() => {
                setModalType("category");
                setModalMode("add");
                setFormData({
                  categoryName: "",
                  courseName: "",
                  topic: {
                    title: "",
                    description: "",
                    videoLink: "",
                    documentHead: "",
                    documentBody: "",
                  },
                });
                setShowModal(true);
              }}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Category
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                className="inline-flex items-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Remove Items
              </button>

              {showDeleteMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        setDeleteModalContent("category");
                        setShowDeleteMenu(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Delete Category
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModalContent("course");
                        setShowDeleteMenu(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Delete Course
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModalContent("topic");
                        setShowDeleteMenu(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Delete Topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-semibold text-blue-600">
                {categories.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Courses</p>
              <p className="text-2xl font-semibold text-green-600">
                {categories.reduce(
                  (total, category) => total + (category.courses?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Topics</p>
              <p className="text-2xl font-semibold text-purple-600">
                {categories.reduce(
                  (total, category) =>
                    total +
                      category.courses?.reduce(
                        (courseTotal, course) =>
                          courseTotal + (course.topics?.length || 0),
                        0
                      ) || 0,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "list" ? renderListView() : renderGridView()}

      {showModal && modalMode === "view"
        ? renderTopicsModal()
        : showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 my-10">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalMode === "add"
                      ? "Add New"
                      : modalMode === "edit"
                      ? "Edit"
                      : "View"}{" "}
                    {modalType}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4">{renderForm()}</div>
              </div>
            </div>
          )}

      {deleteModalContent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete {deleteModalContent}
              </h3>
              <div className="mt-4">
                <select className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500">
                  {deleteModalContent === "category" &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  {deleteModalContent === "course" &&
                    categories.flatMap((category) =>
                      category.courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.courseName} (in {category.categoryName})
                        </option>
                      ))
                    )}
                  {deleteModalContent === "topic" &&
                    categories.flatMap((category) =>
                      category.courses.flatMap((course) =>
                        course.topics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.title} (in {course.courseName})
                          </option>
                        ))
                      )
                    )}
                </select>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteModalContent(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const select = document.querySelector("select");
                      const id = select.value;
                      if (deleteModalContent === "category") {
                        await handleDeleteCategory(id);
                      } else if (deleteModalContent === "course") {
                        await handleDeleteCourse(id);
                      } else if (deleteModalContent === "topic") {
                        await handleDeleteTopic(id);
                      }
                      setDeleteModalContent(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
