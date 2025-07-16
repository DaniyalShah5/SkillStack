import CourseCard from "./CourseCard";
import { Link } from "react-router-dom";


function Courses({data,title,categoryName,dataFrontEnd}){
    return (<>
     <div className="mb-12 my-12 mx-auto">
            <h1 className="text-dark text-center font-bold text-4xl my-10 p-5 bg-slate-300">
                {title}
            </h1>
            <div className=" grid gap-6 px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 lg:grid-rows-[auto auto] lg:auto-rows-fr" >
                {data?.map((dataItem, index) => {
                
                const matchedData = dataFrontEnd.find(
                    (dataArr)=> dataArr.title === dataItem.courseName
                )
                
                return(
                    <Link
                        to={`/${categoryName}/${dataItem.courseName}/topics`}
                        key={dataItem.id}
                        className={`
                            ${data.length === 6 && index === 4 ? "lg:col-start-2 xl:col-start-5 " : ""}
                        `}
                    >
                        {}
                        <CourseCard
                            link={matchedData?.link || ''}
                            title={dataItem.courseName}
                            description={dataItem.description}
                            author={dataItem.author}
                            
                        />
                    </Link>
                )})}
            </div>
        </div>
            
    </>)
}

export default Courses;