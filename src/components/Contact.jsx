import React from "react";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "../server/firebase";

export default function Contact() {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm();
   const [isSubmitted, setIsSubmitted] = React.useState(false);
   const [isError, setIsError] = React.useState(false);
   const [socialLinks, setSocialLinks] = React.useState([]); // State for social links from Firebase

   // EmailJS config - replace these with your values from EmailJS dashboard
   const serviceID = "service_bu52igc"; // The service ID from your EmailJS account
   const templateID = "template_sjccv6a"; // The template ID from your EmailJS account
   const userID = "ODVzVZNIPWx4_Julc"; // Your EmailJS user ID

   // Fetch social media links from Firestore
   const fetchSocialLinks = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "socialLinks"));
         const links = querySnapshot.docs.map((doc) => doc.data());
         setSocialLinks(links);
      } catch (error) {
         console.error("Error fetching social links: ", error);
      }
   };

   // Handle form submission
   const onSubmit = async (data) => {
      try {
         // Map form data to EmailJS template placeholders
         const emailData = {
            name: data.name, // Corresponds to {{name}} in the EmailJS template
            email: data.email, // Corresponds to {{email}} in the EmailJS template
            text: data.message, // Corresponds to {{text}} in the EmailJS template
         };

         // Send email using EmailJS
         const result = await emailjs.send(serviceID, templateID, emailData, userID);
         console.log(result.text);
         setIsSubmitted(true); // Show success message
         setIsError(false); // Hide error message
         reset(); // Reset form fields
      } catch (error) {
         console.error("Error sending email:", error);
         setIsError(true); // Show error message
         setIsSubmitted(false); // Hide success message
      }
   };

   // Fetch social links on component mount
   React.useEffect(() => {
      fetchSocialLinks();
   }, []);

   return (
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Contact
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         <div className="w-full flex flex-col lg:flex-row bg-slate-300 rounded-lg py-8">
            <div className="lg:w-[40%] p-6">
               <h2 className="text-xl font-semibold text-slate-700 mb-6">Connect with Us</h2>
               <ul className="space-y-4">
                  {socialLinks.map((link, index) => (
                     <li key={index}>
                        <div
                           target="_blank"
                           rel="noopener noreferrer"
                           className="hover:text-blue-900 flex   text-slate-700  font-bold font-Inter">
                           <img
                              src={link.iconUrl}
                              alt="social-icon"
                              className="inline-block mr-2 w-8 h-8"
                           />
                           <a href={link.href} target="_blank">
                              {link.name}
                           </a>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>

            <div className="lg:w-[60%] p-6">
               {isSubmitted ? (
                  <div className="text-center text-green-600">
                     <h2 className="text-xl font-bold">Thank You!</h2>
                     <p>
                        Your message has been sent successfully. We will get back to you shortly.
                     </p>
                  </div>
               ) : isError ? (
                  <div className="text-center text-red-600">
                     <h2 className="text-xl font-bold">Oops!</h2>
                     <p>Something went wrong while sending your message. Please try again.</p>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <div className="mb-4">
                        <label
                           htmlFor="name"
                           className="block text-sm font-bold font-Inter text-slate-700">
                           Name
                        </label>
                        <input
                           type="text"
                           id="name"
                           {...register("name", { required: "Name is required" })}
                           className="w-full p-3  bg-slate-200 shadow-lg border-b border-red-600  shadow-slate-400 rounded-md  focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                        />
                        {errors.name && (
                           <p className="text-red-600 text-sm">{errors.name.message}</p>
                        )}
                     </div>

                     <div className="mb-4">
                        <label
                           htmlFor="email"
                           className="block text-sm font-bold font-Inter text-slate-700">
                           Email
                        </label>
                        <input
                           type="email"
                           id="email"
                           {...register("email", {
                              required: "Email is required",
                              pattern: {
                                 value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                 message: "Please enter a valid email",
                              },
                           })}
                           className="w-full p-3  bg-slate-200 shadow-lg shadow-slate-400 border-b border-red-600  rounded-md  focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                        />
                        {errors.email && (
                           <p className="text-red-600 text-sm">{errors.email.message}</p>
                        )}
                     </div>

                     <div className="mb-4">
                        <label
                           htmlFor="message"
                           className="block text-sm font-bold font-Inter text-slate-700">
                           Message
                        </label>
                        <textarea
                           id="message"
                           {...register("message", { required: "Message is required" })}
                           className="w-full p-3 min-h-[20vh] max-h-  bg-slate-200 shadow-lg shadow-slate-400 border-b border-red-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                           rows="5"
                        />
                        {errors.message && (
                           <p className="text-red-600 text-sm">{errors.message.message}</p>
                        )}
                     </div>

                     <div className="flex justify-center">
                        <button
                           type="submit"
                           className="font-Inter font-semibold text-shadow-md text-white bg-red-600 hover:bg-red-700 border border-red-600 w-[70%] h-[2.4rem] my-1 rounded-full shadow shadow-black hover:shadow-none duration-300">
                           Send Massage
                        </button>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </div>
   );
}
