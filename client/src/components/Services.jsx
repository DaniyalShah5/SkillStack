import { MdComputer } from "react-icons/md";
import { PiComputerTowerLight } from "react-icons/pi";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaBootstrap } from "react-icons/fa";

import { CiChat1 } from "react-icons/ci";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Services() {
  const [linkData, setData] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/categories/get-courses-info"
      );
      setData(response.data);

      setCategory( response.data.map(
        ({ courses, ...categoryRest }) => categoryRest
      ))
      
    } catch (error) {
      console.error("Error fetching Link Data:", error);
    }
  };
  
  const catName = category.map((catItem)=>(catItem.categoryName))
  

  const servicesData = [
    {
      id: 1,
      title: "Frontend",
      link: `/categories/${catName[0]}`,
      icon: <MdComputer />,
    },
    {
      id: 2,
      title: "Backend",
      link: `/categories/${catName[1]}`,
      icon: <PiComputerTowerLight />,
    },
    {
      id: 3,
      title: "JavaScript",
      link: "/Frontend/JavaScript/topics",
      icon: <IoLogoJavascript className="bg-yellow-400" />,
    },
    {
      id: 4,
      title: "Bootstrap",
      link: "/Frontend/BOOTSTRAP/topics",
      icon: <FaBootstrap className="text-violet-700" />,
    },
    {
      id: 5,
      title: "Tailwind Css",
      link: "/Frontend/Tailwind%20CSS/topics",
      icon: <RiTailwindCssFill className="text-blue-400" />,
    },
    {
      id: 6,
      title: "ChatPass",
      link: "/chat",
      icon: <CiChat1 />,
    },
  ];

  return (
    <div className="px-10 border-b-2 border-slate-400 pb-4">
      <h1 className=" text-black mb-10 text-2xl">Services We Provide</h1>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 max-sm:grid-cols-2  gap-2 mb-5">
        {servicesData.map((info) => (
          <Link to={info.link} key={info.id}>
            <div className=" ease-in-out duration-200 hover:scale-105 shadow-lg  shadow-slate-400 hover:bg-slate-200 border-slate-500 py-6 rounded-full flex flex-col justify-center items-center">
              <div className="text-black text-5xl mb-2 max-md:text-2xl ">
                {info.icon}
              </div>
              <h2 className="text-black text-center text-sm ">{info.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Services;
