import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../server/firebase";

export default function Footer() {
   const [footerData, setFooterData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm();

   // Fetch footer data from Firestore
   const fetchFooterData = async () => {
      try {
         const footerDoc = doc(db, "footerData", "footer-doc-id"); // Update to match your collection/document name
         const docSnap = await getDoc(footerDoc);

         if (docSnap.exists()) {
            setFooterData(docSnap.data());
         } else {
            setError("Footer data not found in Firestore.");
         }
      } catch (err) {
         console.error("Error fetching footer data:", err);
         setError("Failed to load footer data.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchFooterData();
   }, []);

   // Email subscription handler
   const onSubmit = (data) => {
      emailjs
         .send(
            "service_bu52igc", // Replace with your EmailJS Service ID
            "template_icubjk2", // Replace with your EmailJS Template ID
            { email: data.email }, // Pass the email data to your EmailJS template
            "ODVzVZNIPWx4_Julc" // Replace with your EmailJS Public Key
         )
         .then(
            (response) => {
               console.log("SUCCESS!", response.status, response.text);
               alert("Thank you for subscribing!");
               reset(); // Clear the form after successful submission
            },
            (err) => {
               console.error("FAILED...", err);
               alert("Oops! Something went wrong. Please try again.");
            }
         );
   };

   if (loading) {
      return <p className="text-white text-center">Loading...</p>;
   }

   if (error) {
      return <p className="text-red-600 text-center">{error}</p>;
   }

   const { contact, paymentMethods, recentPosts, socialLinks } = footerData;

   return (
      <footer className="bg-gray-900 text-white py-10">
         <div className="container mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Contact Section */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <ul className="text-sm space-y-2">
                     <li>{contact.address}</li>
                     <li>{contact.phones.join(", ")}</li>
                     <li>{contact.email}</li>
                     <li>{contact.website}</li>
                  </ul>
                  {/* Developer Info */}
                  <div className="mt-4">
                     <h4 className="font-semibold">Developed by:</h4>
                     <ul className="text-sm space-y-2">
                        <li>Name: Md Aulad Hossain Anik</li>
                        <li>
                           Email:{" "}
                           <a
                              href="mailto:mdanikpro801@gmail.com"
                              target="_blank"
                              className="text-blue-400">
                              mdanikpro801@gmail.com
                           </a>
                        </li>
                        Whatsapp : {/* Replace with actual email */}
                        <a
                           href="https://wa.me/+8801856713852"
                           target="_blank"
                           className="text-blue-400">
                           +8801856713852
                        </a>{" "}
                        {/* Replace with actual phone */}
                     </ul>
                  </div>
               </div>

               {/* Payment Method Section */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="flex space-x-4 mb-2">
                     {paymentMethods.map((method) => (
                        <img key={method.id} src={method.icon} alt={method.name} className="w-12" />
                     ))}
                  </div>
               </div>

               {/* Recent Posts Section */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                  <ul className="text-sm space-y-2">
                     {recentPosts.map((post) => (
                        <li key={post.id}>
                           <a
                              href={post.url}
                              className="hover:text-red-500 transition duration-300">
                              {post.title}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6">
               <div className="flex flex-col lg:flex-row justify-between items-center">
                  {/* Social Links */}
                  <div className="flex space-x-4 mb-4 lg:mb-0">
                     {socialLinks.map((link) => (
                        <a
                           key={link.id}
                           href={link.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className=" animate-bounce hover:animate-none duration-200">
                           <img src={link.icon} alt={link.platform} className="w-6 h-6" />
                        </a>
                     ))}
                  </div>

                  {/* Subscribe Form */}
                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                     <input
                        type="email"
                        placeholder="Enter your Email"
                        {...register("email", {
                           required: "Email is required",
                           pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Enter a valid email address",
                           },
                        })}
                        className="p-2 rounded-md w-full lg:w-auto text-gray-900 focus:outline-none"
                     />
                     <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
                        Please Subscribe
                     </button>
                     {errors.email && (
                        <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
                     )}
                  </form>
               </div>
               <p className="text-sm text-center text-gray-500 mt-6">
                  &copy; 2019-2024 Smart Growth Marketing, All Rights Reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}
