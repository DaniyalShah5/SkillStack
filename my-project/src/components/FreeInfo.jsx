import Card from "./Card";

const info=[
    {
        id:1,
        title:"FrontEnd Development",
        img:"./src/assets/feature1.jpg",
        desc:"Front End Web Development Full Course [22 Hours] | Learn HTML, CSS, Bootstrap 5, Tailwind CSS"
    },
    
    {
        id:2,
        title:"BackEnd Development",
        img:"./src/assets/feature2.jpg",
        desc:"Complete Backend Developer course "
    },
    {
        id:3,
        title:"Learn JavaScript",
        img:"./src/assets/feature3.jpg",
        desc:"JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour"
    },

]



function FreeInfo(){
    return(
        <section className="px-10 py-5">
                <h1 className="text-black my-5 text-xl"> Try Some Free Courses Right Now</h1>
            <a href="#">
        <div className=" my-4 grid lg:grid-cols-3 md:grid-cols-2 lg:gap-10 md:gap-7">
            {info.map((details,index)=>
            <Card key={details.id}
                image={details.img}
                title={details.title}
                description={details.desc}
                className={`${index === 2 ? " hidden lg:block " : ""} `}
                
            />
            )}
            
        </div>
        </a>
        </section>
    )
}

export default FreeInfo;