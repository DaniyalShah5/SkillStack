
function CourseCard(props){
    return(
        
        <div className={`border-2 border-gray-300 flex flex-col  items-center text-center text-dark p-2 min-w-28  h-full rounded-2xl hover:scale-105 hover:shadow-xl transition `}>
            <img className="h-40 w-44 pt-2 " src={props.link} />
            <h1 className="text-xl font-bold mt-5">{props.title}</h1>
            <p className="mt-4 pb-2">{props.description}</p>
            
            
        </div>
        
    )
}
export default CourseCard;