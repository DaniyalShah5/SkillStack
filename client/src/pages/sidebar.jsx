import { useEffect, useState } from "react";

const Sidebar = ({ data, onVideoChange, setTitle,handleDocumentHead ,handleDocumentBody }) => {
  const [activeButton, setActiveButton] = useState(data[0].inData[0]._id);
  
  const handleActiveButton = (itemNested) => {
    setActiveButton(itemNested?._id);
    onVideoChange(itemNested?.videoLink);
    setTitle(itemNested?.title);
    handleDocumentHead(itemNested?.documentHead);
    handleDocumentBody(itemNested?.documentBody);
    
  };
  return (
    <div className="w-72 bg-slate-200 pb-12 text-dark overflow-y-scroll h-auto">
      {data.map((item, index) => (
        <div key={index} className="mt-6 ">
          <h1 className="text-xl pl-2 font-bold border-b-2 border-gray-400 pb-10">{item.title}</h1>
          <ul>
            {item.inData && item.inData.length > 0
              ? item.inData.map((itemNested, nestedIndex) => (
                  <li key={nestedIndex} className="mb-1 pt-4">
                    <button
                      onClick={() => handleActiveButton(itemNested)}
                      className={`w-full text-lg text-left p-2 hover:bg-violet-500 hover:text-white ${
                        activeButton === itemNested._id ? "bg-violet-500 text-white hover:bg-violet-500" : ""
                      }`}
                    >
                      {itemNested.title}
                    </button>
                  </li>
                ))
              : ""}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default Sidebar;
