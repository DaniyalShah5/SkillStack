import  { useState } from 'react';
import emailjs from "emailjs-com";

function ContactUs() {

    const [formData,setFormData]=useState({name:'', email:'',message:''})
    const[status,setStatus]=useState('')

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit=(e)=>{
        e.preventDefault();

        emailjs.sendForm('Skillstack','template_amroo9h',e.target,'mvl3kKfDV5hhh_gR5')
        .then((result)=>{
            setStatus('Message sent Successfully!');
            setFormData({name:'',email:'',message:''});
        },(error)=>{
            setStatus('failed to sent message');
        })
    }

  return (
    <div className="text-black flex flex-col items-center p-10">
        <h1 className="mb-10 text-2xl font-bold">Contact Us</h1>
        <form className="flex flex-col space-y-9 border p-10 w-2/5" onSubmit={handleSubmit}>
            <div>
                <label className="block pb-5">Name</label>
                <input
                className="border p-3 w-full"
                type="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='Your name'
                required
                >
                </input>
            </div>
            <div>
                
                <label className="block pb-5" >Email</label>
                <input
                className="border p-3  w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@xyz.com"
                required
                ></input>
            </div>

            <div>
                <label className="block pb-5">Your Message</label>
                <textarea 
                className="border p-3  w-full"
                name="message"
                placeholder="Your Message here"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                ></textarea>
            </div>
            <div>
                <button
                className="border p-3 rounded-lg bg-violet-400 text-white"
                type="submit"
                >Send Message</button>
            </div>
        </form>
        {status && <p className='text-center text-black text-lg mt-4'>{status}</p>}
    </div>
  )
}

export default ContactUs