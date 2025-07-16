import Sidebar from "../../sidebar";
import { useState, useEffect } from "react";
import { Player } from "./player";
import { useParams } from "react-router-dom";


function Tutorial({ data,firstTopic,}) {
  
  const [selectedVideo, setSelectedVideo] = useState(firstTopic.videoLink);
  const [currentName, setCurrentName] = useState(firstTopic.title);
  const [documentHead, setDocumentHead] = useState(firstTopic.documentHead);
  const [documentBody, setDocumentBody] = useState(firstTopic.documentBody);
  
  

  const handleVideoChange = (videoURL) => {
    setSelectedVideo(videoURL);
  };

  const handleDocumentHead = (head) => {
    setDocumentHead(head);
  };

  const handleDocumentBody = (body) => {
    setDocumentBody(body);
  };

  const handleName = (name) => {
    setCurrentName(name);
  };

  const course = useParams();
  

  return (
    <>
      <div className="flex">
        <Sidebar
          data={data}
          onVideoChange={handleVideoChange}
          setTitle={handleName}
          handleDocumentBody={handleDocumentBody}
          handleDocumentHead={handleDocumentHead}
          
        />
        
        <div className="w-full  px-6 py-6">
        <div className="border-b-2 pt-2 mb-10 border-gray-400">
        <span className="text-dark text-3xl  py-4 font-bold text-center hidden mb-5 " >{course.courseName }</span>
          <h2 className="text-dark text-3xl  font-extrabold text-center font-poppins mb-7">
            {currentName}
          </h2>
        </div>
          <Player
            vidUrl={selectedVideo}
            
          />

          <div className="text-black border-t-2 border-gray-400">
            <h1 className="text-3xl pb-10 pt-6 font-bold">{documentHead}</h1>
            <p className="text-xl px-10 pb-10 leading-relaxed   ">{documentBody}</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Tutorial;
