import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../server/firebase"; // Ensure this is the correct Firestore initialization

export default function TeamUpdate() {
   const [teamMembers, setTeamMembers] = useState([]);
   const [editIndex, setEditIndex] = useState(null); // Edit mode
   const [image, setImage] = useState(null); // For storing selected image

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm();

   // Fetch team members from Firestore on mount
   useEffect(() => {
      const fetchTeamMembers = async () => {
         try {
            const querySnapshot = await getDocs(collection(db, "teamMembers"));
            const members = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setTeamMembers(members);
         } catch (error) {
            console.error("Error fetching team members:", error);
         }
      };
      fetchTeamMembers();
   }, []);

   // Handle image file selection
   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         convertImageToBase64(file); // Convert selected image to Base64
      }
   };

   // Convert image file to Base64 string
   const convertImageToBase64 = (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
         setImage(reader.result); // Set the Base64 string
      };
      reader.readAsDataURL(file); // Read the file as Base64
   };

   // Create new member
   const onCreateSubmit = async (data) => {
      try {
         const newMember = { ...data, img: image || "https://via.placeholder.com/150" };

         console.log("Creating new member:", newMember); // Debug log to check member data

         // Add member data to Firestore
         const docRef = await addDoc(collection(db, "teamMembers"), newMember);

         // Update local state with the new member (adding the document ID from Firestore)
         setTeamMembers([...teamMembers, { id: docRef.id, ...newMember }]);
         reset();
         setImage(null); // Clear the image preview

         // Show success alert
         alert("New team member added successfully!");
      } catch (error) {
         console.error("Error adding document:", error);
         alert("Error adding document. Please check the console for details.");
      }
   };

   // Edit member
   const onUpdateSubmit = async (data) => {
      try {
         // Prepare the updated member data
         const updatedMember = {
            ...data,
            img: image || teamMembers[editIndex].img, // If no new image, keep the old one
         };

         console.log("Updated Member Data:", updatedMember); // Log the updated data to check before updating Firestore

         // Get the member document reference from Firestore
         const memberRef = doc(db, "teamMembers", teamMembers[editIndex].id);

         // Check if the document exists
         const docSnapshot = await getDoc(memberRef);

         if (!docSnapshot.exists()) {
            console.log("Document does not exist");
            alert("Team member does not exist.");
            return;
         }

         // Log the document data to ensure we're updating the correct document
         console.log("Document Snapshot Data:", docSnapshot.data());

         // Now, update the member data in Firestore
         await updateDoc(memberRef, updatedMember);

         // Fetch the updated document to verify the change
         const updatedDocSnapshot = await getDoc(memberRef);
         console.log("Updated Document Data:", updatedDocSnapshot.data());

         // Update the state to reflect the changes in the UI
         const updatedMembers = [...teamMembers];
         updatedMembers[editIndex] = { ...updatedMembers[editIndex], ...updatedMember };
         setTeamMembers(updatedMembers);

         // Clear the edit mode and reset the form
         setEditIndex(null);
         setImage(null);
         reset();

         // Show success alert
         alert("Team member updated successfully!");
      } catch (error) {
         // Enhanced error logging
         console.error("Error updating document:", error);
         alert(
            `Error updating document. Please check the console for details. Error message: ${error.message}`
         );
      }
   };

   const handleEdit = (index) => {
      setEditIndex(index);
      setValue("name", teamMembers[index].name);
      setValue("expart", teamMembers[index].expart);
      setValue("gmail", teamMembers[index].gmail);
      setValue("whatsapp", teamMembers[index].whatsapp);
      setValue("linkdin", teamMembers[index].linkdin);
      setValue("facebook", teamMembers[index].facebook);
      setImage(teamMembers[index].img); // Set image for editing
   };

   const handleDelete = async (index) => {
      try {
         const memberToDelete = teamMembers[index];
         console.log("Deleting member:", memberToDelete); // Debug log for delete

         await deleteDoc(doc(db, "teamMembers", memberToDelete.id)); // Delete from Firestore

         // Remove the member from local state
         setTeamMembers(teamMembers.filter((_, i) => i !== index));

         // Show success alert
         alert("Team member deleted successfully!");
      } catch (error) {
         console.error("Error deleting document:", error);
         alert("Error deleting document. Please check the console for details.");
      }
   };

   return (
      <div className="pt-16 p-2 flex flex-col items-center w-full">
         <h1 className="text-[1.5rem] lg:text-[2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Team Members
         </h1>
         <div className="w-[25vh] h-[0.6vh] mb-4 animate-pulse bg-red-600"></div>

         {/* Create Form Section */}
         <div className="w-full max-w-lg p-4">
            <form
               onSubmit={
                  editIndex !== null ? handleSubmit(onUpdateSubmit) : handleSubmit(onCreateSubmit)
               }
               className="bg-white p-6 rounded-md shadow-md space-y-4">
               <h2 className="text-xl font-semibold">
                  {editIndex !== null ? "Update Team Member" : "Add New Team Member"}
               </h2>
               {/* Name Input */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                     {...register("name", { required: "Name is required" })}
                     type="text"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
               </div>

               {/* Expert Field */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expert</label>
                  <input
                     {...register("expart", { required: "Expert field is required" })}
                     type="text"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.expart && <p className="text-red-500 text-sm">{errors.expart.message}</p>}
               </div>

               {/* Gmail Input */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gmail</label>
                  <input
                     {...register("gmail", { required: "Gmail is required" })}
                     type="email"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.gmail && <p className="text-red-500 text-sm">{errors.gmail.message}</p>}
               </div>

               {/* WhatsApp Input */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Whatsapp</label>
                  <input
                     {...register("whatsapp", { required: "Whatsapp is required" })}
                     type="tel"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.whatsapp && (
                     <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
                  )}
               </div>

               {/* LinkedIn Input */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                     {...register("linkdin", { required: "LinkedIn is required" })}
                     type="url"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.linkdin && (
                     <p className="text-red-500 text-sm">{errors.linkdin.message}</p>
                  )}
               </div>

               {/* Facebook Input */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                     {...register("facebook", { required: "Facebook is required" })}
                     type="url"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.facebook && (
                     <p className="text-red-500 text-sm">{errors.facebook.message}</p>
                  )}
               </div>

               {/* Image upload section */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Upload Image
                  </label>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {image && (
                     <div className="mt-2">
                        <img
                           src={image} // Show the Base64 image preview
                           alt="Preview"
                           className="w-32 h-32 object-cover rounded-md"
                        />
                     </div>
                  )}{" "}
                  <label className="block text-sm font-medium text-red-600 mb-1">
                     Image size max 1mb
                  </label>
               </div>

               <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200">
                  {editIndex !== null ? "Update" : "Add"} Member
               </button>
            </form>
         </div>

         {/* Display Team Members */}
         <div className="w-full h-auto p-4 flex flex-wrap justify-center items-center">
            {teamMembers.map((member, index) => (
               <div
                  key={member.id}
                  className="w-full lg:w-[18%] bg-slate-200 cursor-pointer m-3 p-2 border-b-4 hover:border border-red-600 rounded-md flex flex-col items-center shadow-lg hover:shadow-none shadow-black duration-300">
                  <div className="w-[20vh] h-[20vh] flex justify-center items-center rounded-full overflow-hidden shadow-md shadow-black">
                     <img src={member.img} alt={member.name} className="h-full w-full" />
                  </div>
                  <div className="w-full m-1 pt-6 flex flex-col items-center justify-center">
                     <h1 className="lg:text-[1.1rem] text-[1.5rem] font-semibold text-slate-700">
                        {member.name}
                     </h1>
                     <h3 className="font-roboto font-semibold lg:text-[0.7rem] text-[0.6rem] text-red-800">
                        {member.expart}
                     </h3>

                     <div className="flex justify-center items-center my-5 space-x-2">
                        <button
                           onClick={() => handleEdit(index)}
                           className="text-xl text-yellow-500">
                           Edit
                        </button>
                        <button
                           onClick={() => handleDelete(index)}
                           className="text-xl text-red-500">
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
