import Tutorial from "./Tutorials";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading"

export const CoursePage = () => {
  const { category, courseName } = useParams();
  const [topics, setTopics] = useState();
  const [firstTopic, setFirstTopic] = useState("");
  
  const [loading,setLoading] = useState(true);
  
  useEffect(() => {
    
    axios
    .get("http://localhost:4000/api/categories/get-courses-info")

    .then((response) => {
      setTopics(response?.data?.find((item) => item?.categoryName === category)
      ?.courses?.find((item)=>item?.courseName===courseName)?.topics);
      setLoading(false);
      const categoryData = response?.data?.find(
        (item) => item?.categoryName === category
      );
      const courseData = categoryData?.courses?.find(
        (item) => item?.courseName === courseName
      );

      if (courseData?.topics?.length > 0) {
        setTopics(courseData.topics);
        
        setFirstTopic(courseData.topics[0]);
        
      }
    })
    
    
  }, []);
  
  
  
  const data = [
    {
      id: 1,
      title: courseName,
      inData: topics
    },
  ];

  if(loading){
    return(
      <>
            <div className="w-full h-svh flex items-center justify-center">
            <ReactLoading type='bars' color='gray' height={'5%'} width={'5%'} />
            </div>
            </>
    )
  }

  return (
    <div>
      <Tutorial data={data} firstTopic={firstTopic}  />
      
    </div>
    
  );
};
