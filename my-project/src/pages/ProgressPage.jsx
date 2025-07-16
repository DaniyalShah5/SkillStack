import {useState,useEffect} from 'react';
import {useUser} from "../context/UserContext"
import axios from 'axios';

function ProgressPage() {
    const { user } = useUser();
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchProgress();
    }, []);
  
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/progress/${user.id}`);
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) return <div>Loading...</div>;
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Learning Progress</h1>
        
        {progressData.length === 0 ? (
          <p className="text-gray-600">No progress tracked yet. Start watching some tutorials!</p>
        ) : (
          <div className="grid gap-6">
            {/* Group by category/course */}
            {Object.entries(groupByCourse(progressData)).map(([courseName, topics]) => (
              <div key={courseName} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">{courseName}</h2>
                <div className="space-y-3">
                  {topics.map(topic => (
                    <div key={topic._id} className="flex items-center justify-between">
                      <span className="text-gray-700">{topic.title}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        topic.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{calculateProgress(topics)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProgress(topics)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  function calculateProgress(topics) {
    const completed = topics.filter(t => t.completed).length;
    return Math.round((completed / topics.length) * 100);
  }
  
  function groupByCourse(progress) {
    return progress.reduce((acc, item) => {
      const courseName = item.topicId.course.courseName;
      if (!acc[courseName]) acc[courseName] = [];
      acc[courseName].push({
        _id: item._id,
        title: item.topicId.title,
        completed: item.completed
      });
      return acc;
    }, {});
  }

  export default ProgressPage;