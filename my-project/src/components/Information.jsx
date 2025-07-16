import { Link } from "react-router-dom";

function Information (){

    const infoAbout =[
        {
            id:1,
            title:"Top-Notch Video Tutorials",
            para:"Chose exactly what you want to learn without wasting your time and gain new skills from top quality tutorials available online that we have curated for you while also keeping track of your progress to keep you motivated ",
                   
        },
        {
            id:2,
            title:"Modular Structure",
            para:"With modular structure you can also dive straight into what topic exactly you want so you dont have to deal with stuff you dont want to waste your time on",
             
        },
        {
            id:3,
            title:"ChatPass",
            para:"With our ChatPass you can get in touch with professional Programmers available for you to help you with concepts used in development which you are not getting your head around through the available resources",
            
        },
        
    ]
    return(
        <div>
        <div className="mt-9 py-7 px-10 border-t border-black text-dark grid grid-cols-2 grid-rows-2 gap-8 max-sm:hidden">
            {infoAbout.map((info,i)=>
                <div key={info.id} className={`${info.id === 3 ? 'col-start-2 col-end-3 row-start-1 row-end-3' : null } group ` }>
                    <h1 className="font-semibold text-xl mb-6 pb-2 border-b-4 border-opacity-70 rounded-lg inline-block border-violet-500 group-hover:scale-105 ease-in-out duration-200 group-hover:bg-violet-500 group-hover:p-1 group-hover:text-white ">{info.title}</h1>
                    <p className="text-lg group-hover:scale-105 ease-in-out duration-200 ">{info.para}</p>
                    {info.id === 3 ? <div  className="mt-20"><Link to="/chat"><button className="btn-normal hover:scale-105 ease-in-out duration-200 mr-8 hover:bg-violet-400">Try Now</button></Link><Link to="/signup"><button className="btn-normal bg-black hover:bg-neutral-800 hover:scale-105 ease-in-out duration-200">Sign Up</button></Link></div>:null}
                </div>
            )}
        </div>
            {/*mob */}
            <div className="sm:hidden my-3 py-3 px-0 container border-t border-black text-dark grid grid-flow-row text-center">
                {infoAbout.map((info2)=>
                    <div key={info2.id}>
                        <h1 className="my-5 pb-2 font-semibold text-lg border-b-2 inline-block rounded-lg border-purple-800">{info2.title}</h1>
                        <p className="text-md ">{info2.para}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Information;