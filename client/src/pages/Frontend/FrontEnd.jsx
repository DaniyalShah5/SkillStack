import Courses from "../Courses";
import { useEffect,useState } from "react";
import axios from "axios"
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

const title ="Front-End Development"

function FrontEnd (){
    const dataFrontEnd=[
        {
            id:1,
            link:"/logos/icons8-html.svg",
            title:"HTML",
            description:"hello",
            author:"",
            path:"/frontend/html"
        },
        
        {
            id:2,
            link:"/logos/icons8-css.svg",
            title:"CSS",
            description:"",
            author:"",
            path:"/frontend/css"
        },
        {
            id:3,
            link:"/logos/Bootstrap.svg",
            title:"BOOTSTRAP",
            description:"",
            author:"",
            path:""
        },
        {
            id:4,
            link:"/logos/Tailwind.svg",
            title:"Tailwind CSS",
            description:"",
            author:"",
            path:""
        },
        {
            id:5,
            link:"/logos/Javascript.svg",
            title:"JavaScript",
            description:"",
            author:"",
            path:""
        },
        {
            id:6,
            link:"/logos/nodejs-icon.svg",
            title:"Node.js",
            description:"",
            author:"",
            path:""
        },
        {
            id:7,
            link:"/logos/rest-api-icon.svg",
            title:"Api development",
            description:"",
            author:"",
            path:""
        },
        {
            id:8,
            link:"/logos/mongodb-icon.svg",
            title:"MongoDb",
            description:"",
            author:"",
            path:""
        },
        {
            id:9,
            link:"/logos/sql-database.svg",
            title:"SQL & PostgreSQL",
            description:"",
            author:"",
            path:""
        },
        {
            id:10,
            link:"/logos/python.svg",
            title:"Python & Django",
            description:"",
            author:"",
            path:""
        },
        
    ]
        const [topicsDropdown, setTopicsDropdown] = useState();
        const [loading,setLoading] = useState(true);

    useEffect(() => {
        
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories/get-courses-info`).then((response)=>{


            setTopicsDropdown(response.data);
            setLoading(false);

        })
        
      }, [])
      
    const { category } = useParams();

    if(loading){
        return(
            <>
            <div className="w-full h-svh flex items-center justify-center">
            <ReactLoading type='bars' color='gray' height={'5%'} width={'5%'} />
            </div>
            </>
        )
    }

    return (<>
    <Courses
    categoryName={category}
    data={topicsDropdown?.find((item)=>item?.categoryName===category)?.courses}
    title={category}
    dataFrontEnd={dataFrontEnd}
    />
    </>)
}
    
export default FrontEnd;