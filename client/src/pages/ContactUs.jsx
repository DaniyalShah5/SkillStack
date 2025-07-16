import  { useState, useEffect } from 'react';
import emailjs from "emailjs-com";

function ContactUs() {
    

    const [formData,setFormData]=useState({name:'', email:'',message:''})
    const[status,setStatus]=useState('')
    const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  console.log('Service:', SERVICE_ID, 'Template:', TEMPLATE_ID, 'Key:', PUBLIC_KEY);

  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init(PUBLIC_KEY);
    } else {
      console.error('❌ EmailJS public key is missing');
    }
  }, [PUBLIC_KEY]);


    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target)
      .then(
        () => {
          setStatus('Message sent Successfully!');
          setFormData({ name: '', email: '', message: '' });
        },
        (error) => {
          console.error('EmailJS error:', error);
          setStatus('Failed to send message.');
        }
      );
  };

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