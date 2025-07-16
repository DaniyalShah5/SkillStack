import { CiInstagram } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

function AboutSection(){
    return(
        <section className=" bg-slate-950 py-10 px-10  text-white border-b-0 md:text-sm border-white" >
            <div className="flex justify-between" >
                <div className="flex flex-col  items-start">
                    <h1 className="pb-4 text-xl font-extrabold">SkillStack</h1>
                    <Link to="/categories/Frontend">
                        <p className="text-white whitespace-nowrap pb-4">Frontend Development</p>
                    </Link><Link to="/categories/Backend">
                        <p className="text-white whitespace-nowrap pb-4">Backend Development</p>
                    </Link><Link to="/Frontend/JavaScript/topics">
                        <p className="text-white whitespace-nowrap pb-4">Javascript</p>
                    </Link>
                </div>
                <div className="flex flex-col items-start">
                    <h2 className="pb-4 text-xl font-bold">Community</h2>
                    <a href="">
                        <p className="text-white whitespace-nowrap pb-4">Coming Soon</p>
                    </a>
                </div>
                <div className="flex flex-col  items-start">
                    <h2 className="pb-4 text-xl whitespace-nowrap font-bold">Become A Mentor</h2>
                    <a href="">
                        <p className="text-white whitespace-nowrap pb-4">Coming Soon</p>
                    </a>
                </div>
                <div className="flex flex-col  items-center">
                    <h2 className="pb-4 text-xl whitespace-nowrap font-bold ">Contact Us</h2>
                    <Link className="text-white " to="/contactus">
                    <MdOutlineEmail className="w-20 h-7 mb-3" />
                    </Link>
                    <a className="text-white " href="https://www.instagram.com/">  
                    <CiInstagram className="w-20 h-7 mb-3" />
                    </a>
                    <a className="text-white " href="https://twitter.com/x/">
                    <BsTwitterX className="w-20 h-7 mb-3" />
                    </a>
                </div>
                
            </div>    
        </section>

    )
}
export default AboutSection;