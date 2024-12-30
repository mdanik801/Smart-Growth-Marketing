import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // Correct Firestore imports
import { db } from "../../../server/firebase"; // Ensure the Firestore instance is imported correctly

export default function HeaderUpdate() {
   const [items, setItems] = useState([]);
   const [editIndex, setEditIndex] = useState(null); // Index of the item being edited

   // React Hook Form setup
   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm();

   // Function to fetch items from Firestore
   const fetchItems = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "headers"));
         const fetchedItems = [];
         querySnapshot.forEach((doc) => {
            fetchedItems.push({ id: doc.id, ...doc.data() }); // Include the doc ID and data
         });
         setItems(fetchedItems); // Update state with fetched data
      } catch (error) {
         console.error("Error fetching items: ", error);
      }
   };

   // Fetch data on component mount
   useEffect(() => {
      fetchItems();
   }, []);

   // Function to handle form submission
   const onSubmit = async (data) => {
      const updatedItems = [...items];
      updatedItems[editIndex].description = data.description; // Update only the description
      setItems(updatedItems);
      setEditIndex(null); // Exit edit mode
      reset(); // Clear the form

      // Save updated item to Firestore
      const docRef = doc(collection(db, "headers"), items[editIndex].id); // Use document ID
      try {
         await setDoc(docRef, {
            name: updatedItems[editIndex].name,
            description: updatedItems[editIndex].description,
         });
         alert("Item updated in Firestore!");
      } catch (error) {
         console.error("Error updating item: ", error);
         alert("Failed to update item in Firestore.");
      }
   };

   // Function to handle editing a description
   const handleEditDescription = (index) => {
      const item = items[index];
      setValue("description", item.description); // Pre-fill form with current description
      setEditIndex(index);
   };

   return (
      <div className="m-4 p-4 w-full flex flex-col items-center">
         <h1 className="text-2xl lg:text-3xl text-slate-700 font-bold mb-4">Header Update</h1>
         <div className="w-32 h-1 bg-red-600 mb-4"></div>
         <h1 className="text-3xl font-bold mb-6">Update Description</h1>

         {/* Form Section */}
         {editIndex !== null && (
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="w-full max-w-md bg-white p-6 rounded-md shadow-md mb-6 space-y-4">
               <h2 className="text-xl font-semibold">Edit Description</h2>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Description
                  </label>
                  <textarea
                     {...register("description", {
                        required: "Description is required",
                        maxLength: {
                           value: 600,
                           message: "Description cannot exceed 600 characters",
                        },
                     })}
                     placeholder="Update description"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                     maxLength={600} // Set maxLength for the textarea
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Maximum 600 characters
                  </label>
                  {errors.description && (
                     <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
               </div>
               <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200">
                  Update Description
               </button>
            </form>
         )}

         {/* List Section */}
         <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            {items.length === 0 ? (
               <p className="text-gray-500">No items available. Add some!</p>
            ) : (
               <ul className="space-y-4">
                  {items.map((item, index) => (
                     <li
                        key={item.id} // Use Firestore document ID as the key
                        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
                        <div>
                           <h3 className="text-lg font-bold">{item.name}</h3>
                           <p className="text-gray-700">{item.description}</p>
                        </div>
                        <div>
                           <button
                              onClick={() => handleEditDescription(index)}
                              className="bg-yellow-400 text-white py-1 px-2 rounded-md hover:bg-yellow-500 transition">
                              Edit Description
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
   );
}
