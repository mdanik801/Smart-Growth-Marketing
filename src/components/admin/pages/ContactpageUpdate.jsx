import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../../server/firebase"; // Firebase config import

export default function SocialMediaUpdate() {
   const [socialLinks, setSocialLinks] = useState([]);
   const [selectedLink, setSelectedLink] = useState(null);
   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm();

   const socialLinksCollectionRef = collection(db, "socialLinks"); // Firestore collection reference

   // Fetch social media links from Firestore
   const fetchSocialLinks = async () => {
      const querySnapshot = await getDocs(socialLinksCollectionRef);
      const links = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSocialLinks(links);
   };

   // Handle form submit
   const onSubmit = async (data) => {
      if (selectedLink) {
         // Update existing link in Firestore
         const linkDocRef = doc(db, "socialLinks", selectedLink.id);
         await updateDoc(linkDocRef, {
            name: data.name,
            href: data.href,
            iconUrl: data.iconUrl,
         });
      } else {
         // Add new link to Firestore
         await addDoc(socialLinksCollectionRef, {
            name: data.name,
            href: data.href,
            iconUrl: data.iconUrl,
         });
      }

      reset(); // Reset form fields
      setSelectedLink(null); // Reset selected link
      fetchSocialLinks(); // Fetch updated social links
   };

   // Handle edit button click
   const handleEdit = (link) => {
      setSelectedLink(link);
      setValue("name", link.name);
      setValue("href", link.href);
      setValue("iconUrl", link.iconUrl);
   };

   // Handle delete button click
   const handleDelete = async (id) => {
      const linkDocRef = doc(db, "socialLinks", id);
      await deleteDoc(linkDocRef); // Delete from Firestore
      fetchSocialLinks(); // Fetch updated social links
   };

   // Fetch social links on component mount
   useEffect(() => {
      fetchSocialLinks();
   }, []);

   return (
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Update Social Media Links
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         <div className="w-full flex flex-col lg:flex-row">
            {/* Social Links List */}
            <div className="lg:w-[40%] p-6">
               <h2 className="text-xl font-semibold text-slate-700 mb-6">
                  Current Social Media Links
               </h2>
               <ul className="space-y-4">
                  {socialLinks.map((link) => (
                     <li key={link.id} className=" ">
                        <div className="flex items-center">
                           <img src={link.iconUrl} alt="social-icon" className="w-8 h-8 mr-2" />
                           <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-600 text-shadow-md font-bold ">
                              {link.name}
                           </a>
                        </div>
                        <div className=" flex justify-center m-3 p-2">
                           <button
                              onClick={() => handleEdit(link)}
                              className=" mr-6 border p-2 bg-yellow-400 font-bold rounded-xl hover:bg-slate-200 duration-300 ">
                              Edit
                           </button>
                           <button
                              onClick={() => handleDelete(link.id)}
                              className=" border p-2 bg-red-600 font-bold rounded-xl hover:bg-slate-200 duration-300 ">
                              Delete
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Form for Adding or Editing Social Media Link */}
            <div className="lg:w-[60%] p-6">
               <h2 className="text-xl font-semibold text-slate-700 mb-6">
                  {selectedLink ? "Edit Social Media Link" : "Add New Social Media Link"}
               </h2>
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
                        className="w-full p-3 bg-slate-200 shadow-lg shadow-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                     />
                     {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>

                  <div className="mb-4">
                     <label
                        htmlFor="href"
                        className="block text-sm font-bold font-Inter text-slate-700">
                        Link (URL)
                     </label>
                     <input
                        type="text"
                        id="href"
                        {...register("href", { required: "Link is required" })}
                        className="w-full p-3 bg-slate-200 shadow-lg shadow-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                     />
                     {errors.href && <p className="text-red-600 text-sm">{errors.href.message}</p>}
                  </div>

                  <div className="mb-4">
                     <label
                        htmlFor="iconUrl"
                        className="block text-sm font-bold font-Inter text-slate-700">
                        Icon URL
                     </label>
                     <input
                        type="text"
                        id="iconUrl"
                        {...register("iconUrl", { required: "Icon URL is required" })}
                        className="w-full p-3 bg-slate-200 shadow-lg shadow-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 hover:shadow-none duration-300"
                     />
                     {errors.iconUrl && (
                        <p className="text-red-600 text-sm">{errors.iconUrl.message}</p>
                     )}
                  </div>

                  <div className="flex justify-center">
                     <button
                        type="submit"
                        className="font-Inter font-semibold text-shadow-md text-white bg-red-600 hover:bg-red-700 border border-red-600 w-[70%] h-[2.4rem] my-1 rounded-full shadow shadow-black hover:shadow-none duration-300">
                        {selectedLink ? "Update Link" : "Add Link"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
