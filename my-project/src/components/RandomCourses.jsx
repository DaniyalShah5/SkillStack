import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const RandomTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomTopics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/categories/get-courses-info');
        
        
        const allTopics = response.data.reduce((acc, category) => {
          const topicsWithPath = category.courses.reduce((courseAcc, course) => {
            const topicsWithInfo = (course.topics || []).map(topic => ({
              ...topic,
              categoryName: category.categoryName,
              courseName: course.courseName
            }));
            return courseAcc.concat(topicsWithInfo);
          }, []);
          return acc.concat(topicsWithPath);
        }, []);

        
        const topicsWithVideos = allTopics.filter(topic => topic.videoLink);
        
        
        const shuffled = topicsWithVideos.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        setTopics(selected);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setLoading(false);
      }
    };

    fetchRandomTopics();
  }, []);

  const handleTopicClick = (categoryName, courseName) => {
    navigate(`/${categoryName}/${courseName}/topics`);
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse flex space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-gray-50">
        <h2 className="text-2xl px-8  text-gray-900 mb-8 text-left">
          Featured Free Content
        </h2>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {topics.map((topic) => (
            <div 
              key={topic._id}
              onClick={() => handleTopicClick(topic.categoryName, topic.courseName)}
              className="cursor-pointer group "
            >
              <div className="bg-white relative rounded-lg shadow-lg overflow-hidden h-96 transform  transition-transform group-hover:scale-105">
                <div className="relative aspect-video">
                  <iframe
                    src={topic.videoLink}
                    className="w-full h-full pointer-events-none"
                    title={topic.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-20 transition-all">
                    <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-black " />
                    </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 ">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {topic.description}
                  </p>
                  <p className="mt-2 text-sm absolute bottom-8 text-gray-500">
                    From: {topic.courseName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomTopics;