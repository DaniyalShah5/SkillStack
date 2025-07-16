import "/src/index.css";
import { Link } from "react-router-dom";

function AboutUsPage() {
  return (
    <div className=" border-b-[70px] border-black ">
        <div className="w-full flex py-20 pt-32 items-center justify-center border-b-[30px] border-black ">
            <p className="text-5xl font-bold mr-32 text-black leading-relaxed font-serif">The Ultimate Learning <br/> Hub for Web Developers.</p>
            <div className="relative">
            <img src="/hero_img/pattern.png" className="h-48" />
            <div className="absolute text-3xl  font-bold flex inset-0 items-center justify-center" >SkillStack</div>
            </div>
        </div>

        <div className="text-black px-20 py-10 border-l-[30px] border-r-[30px] border-b-[30px] border-black">
            <h1 className="text-3xl font-serif text-center font-bold mb-10">"Skip the Search, Start Building."</h1>
            <p className="text-lg text-center">At SkillStack, we are passionate about
                empowering aspiring developers to master the art 
                of web development efficiently and effectively. We 
                understand that navigating through countless tutorials 
                and mediocre resources can be frustrating and time-consuming.
                That's why we’ve built a platform that cuts through the noise,
                offering only the best curated, high-quality materials to 
                help you succeed.</p>
        </div>
        <div className="text-black flex border-b-[30px] flex-nowrap border-black">
            <div className="flex-1 pt-10 border-r-[30px] border-black">
                <h1 className=" font-serif text-2xl text-center font-bold mb-10">"Master Web Development Faster."</h1>
                <p className="text-lg text-center pb-10 px-7">Whether you're interested in mastering front-end design,
                 diving into back-end development, or exploring versatile programming 
                 languages, our platform provides tailored content to suit your learning 
                 goals. We've scoured the internet for top-notch video tutorials, documentation, 
                 and guides so you can focus on what matters most—learning and building.</p>
            </div>
            <div className="flex-1" >
                <h1 className=" font-serif text-2xl text-center font-bold mb-10 pt-10">"Streamline Your Coding Journey."</h1>
                <p className="text-lg text-center pb-10 px-7">But we don’t stop there. To make your learning journey even more 
                    engaging, our premium version connects you with professional developers. 
                    Get personalized support, ask questions, and gain clarity on challenging 
                    concepts directly from experts in the field.</p>
            </div>
        </div>
        <div className="w-full bg-gray-300 text-dark flex px-20 py-10 justify-center items-center">
            <div className="w-full ml-10">
             
                <img src="/hero_img/expert.avif" className="rounded-lg " />
                
            </div>
            <div className="ml-10 pl-10 ">
            <h1 className=" font-serif text-2xl mb-5">"Expert Advice, One Message Away."</h1>
            <p >ChatPass is your direct line to professional developers, designed 
                to make your learning experience seamless. Whether you're stuck on 
                a concept, need clarification, or want guidance on best practices, 
                ChatPass connects you with experts in real-time. Skip the frustration 
                and get the answers you need to build confidently and efficiently.</p>
            <Link to="/chat"><button className="mt-5 btn-normal hoverBtnV">ChatPass</button></Link>
            </div>
        </div>
    </div>
  )
}

export default AboutUsPage