import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
   getFirestore,
   collection,
   addDoc,
   getDocs,
   updateDoc,
   deleteDoc,
   doc,
} from "firebase/firestore";
import { db } from "../../../server/firebase"; // Ensure this points to your Firebase setup
import { useNavigate } from "react-router";

export default function ServicesUpdate() {
   const [services, setServices] = useState([]);
   const [isEditing, setIsEditing] = useState(false);
   const [editId, setEditId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate(); // React Router navigation hook
   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm();

   // Fetch Services from Firestore
   const fetchServices = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "services"));
         const servicesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setServices(servicesData);
      } catch (error) {
         console.error("Error fetching services: ", error);
      }
   };

   // Convert Image to Base64
   const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result); // Base64 string
         reader.onerror = (error) => reject(error);
      });
   };

   // Validate Image File
   const isValidImage = (file) => {
      const validTypes = ["image/jpeg", "image/png"];
      return validTypes.includes(file.type);
   };

   // Form Submission (Create or Update)
   const onSubmit = async (data) => {
      setIsLoading(true);

      let base64Image = null;

      // If image is uploaded (new image provided during editing)
      if (data.image && data.image[0]) {
         if (!isValidImage(data.image[0])) {
            alert("Please upload a valid image (JPEG or PNG).");
            setIsLoading(false);
            return;
         }

         base64Image = await convertToBase64(data.image[0]);
      }

      const newService = {
         name: data.name,
         description: data.description,
         image:
            base64Image ||
            (isEditing ? services.find((service) => service.id === editId).image : null), // Keep old image if no new one
         whatsapp: data.whatsapp,
      };

      try {
         if (isEditing && editId) {
            // Update existing service
            const serviceDoc = doc(db, "services", editId);
            await updateDoc(serviceDoc, newService);
            setServices(
               services.map((service) =>
                  service.id === editId ? { id: editId, ...newService } : service
               )
            );
            reset();
         } else {
            // Add new service
            const docRef = await addDoc(collection(db, "services"), newService);
            setServices([...services, { id: docRef.id, ...newService }]);
            reset();
         }
      } catch (error) {
         console.error("Error adding/updating service: ", error);
      } finally {
         setIsLoading(false); // Hide loading state
         setIsEditing(false); // Clear the editing state
         setEditId(null); // Clear the edit ID
      }
   };

   // Handle Edit
   const handleEdit = (service) => {
      setValue("name", service.name);
      setValue("description", service.description);
      setValue("whatsapp", service.whatsapp); // Set the WhatsApp number in form
      setIsEditing(true);
      setEditId(service.id);
   };

   // Handle Delete
   const handleDelete = async (id) => {
      try {
         await deleteDoc(doc(db, "services", id));
         setServices(services.filter((service) => service.id !== id));
      } catch (error) {
         console.error("Error deleting service: ", error);
      }
   };

   // Fetch services on component mount
   useEffect(() => {
      fetchServices();
   }, []);

   return (
      <div className="pt-16 p-4 flex flex-col items-center bg-gray-100 w-full border min-h-screen">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 font-extrabold font-Inter">
            Services Update
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         {/* Form Section */}
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-center">
               {isEditing ? "Edit Service" : "Add New Service"}
            </h2>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
               <input
                  type="text"
                  {...register("name", { required: "Service name is required" })}
                  placeholder="Enter service name"
                  maxLength={80}
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
               />
               {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
               <textarea
                  {...register("description", { required: "Description is required" })}
                  placeholder="Enter service description"
                  maxLength={1000}
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
               {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
               )}
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
               </label>
               <input
                  type="text"
                  {...register("whatsapp")}
                  placeholder="Enter WhatsApp number (e.g. +8801772554705)"
                  className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
               />
               {errors.whatsapp && (
                  <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
               )}
            </div>

            {/* Conditionally Render the Image Input Field */}
            {!isEditing && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Upload Image
                  </label>
                  <input
                     type="file"
                     {...register("image", { required: "Image is required" })}
                     accept="image/*"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
               </div>
            )}

            <button
               type="submit"
               className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
               {isEditing ? "Update Service" : "Add Service"}
            </button>
         </form>

         {/* Services List */}
         <div className="w-full">
            {services.length === 0 ? (
               <p className="text-gray-500 text-center">No services available. Add some!</p>
            ) : (
               <div className="flex flex-wrap w-full justify-center items-center">
                  {services.map((service) => (
                     <div
                        key={service.id}
                        className="lg:w-[24%] bg-white h-[75vh] m-2 p-3 border border-red-600 rounded-lg shadow-md shadow-black flex flex-col items-center">
                        <img
                           className="w-[5rem] h-[5rem] object-cover rounded-full"
                           src={service.image}
                           alt={service.name}
                        />
                        <h1 className="h-[25%] lg:text-[1.2rem] text-center font-Inter font-bold text-slate-700">
                           {service.name}
                        </h1>
                        <p className="h-auto my-2 font-Inter text-justify text-[0.8rem] text-slate-700">
                           {service.isExpanded
                              ? service.description
                              : `${service.description.substring(0, 300)} `}{" "}
                           {service.description.length > 300 && (
                              <button
                                 onClick={() => handleDescriptionToggle(service.id)}
                                 className="font-Inter text-sm text-blue-600 hover:text-blue-800 ">
                                 {service.isExpanded ? (
                                    "See Less"
                                 ) : (
                                    <button
                                       className=" text-red-500"
                                       onClick={() => navigate(`/details/${service.id}`)}>
                                       {" "}
                                       See more......
                                    </button>
                                 )}
                              </button>
                           )}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                           <button
                              onClick={() => handleEdit(service)}
                              className="bg-yellow-400 text-white py-1 px-3 rounded-md hover:bg-yellow-500 transition">
                              Edit
                           </button>
                           <button
                              onClick={() => handleDelete(service.id)}
                              className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition">
                              Delete
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
