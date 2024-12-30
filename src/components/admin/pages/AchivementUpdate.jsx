import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../../server/firebase"; // Correct Firestore imports
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

export default function Achievements() {
   const [cardItems, setCardItems] = useState([]);
   const [editIndex, setEditIndex] = useState(null);
   const [editAchievement, setEditAchievement] = useState(null);
   const [formVisible, setFormVisible] = useState(false); // Track if form is visible

   const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
   } = useForm();

   // Fetch achievements data from Firestore on component mount
   useEffect(() => {
      const fetchAchievements = async () => {
         const achievementRef = collection(db, "achievements");
         const snapshot = await getDocs(achievementRef);
         const achievementList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setCardItems(achievementList);
      };

      fetchAchievements();
   }, []);

   // Create or Update Achievement
   const onSubmit = async (data) => {
      if (editIndex !== null) {
         // Update existing achievement
         const achievementDocRef = doc(db, "achievements", editAchievement.id);
         await updateDoc(achievementDocRef, data);
         const updatedAchievements = cardItems.map((item, index) =>
            index === editIndex ? { ...item, ...data } : item
         );
         setCardItems(updatedAchievements);
         setEditIndex(null); // Reset edit index
      } else {
         // Create new achievement
         const newAchievementRef = doc(collection(db, "achievements"));
         await setDoc(newAchievementRef, data);
         setCardItems([...cardItems, { id: newAchievementRef.id, ...data }]);
      }
      setFormVisible(false); // Hide the form after submitting
      reset();
   };

   // Set the form values for editing
   const handleEdit = (index) => {
      const achievement = cardItems[index];
      setValue("name", achievement.name);
      setValue("number", achievement.number);
      setValue("symbol", achievement.symbol);
      setEditAchievement(achievement);
      setEditIndex(index);
      setFormVisible(true); // Show the form when editing
   };

   // Cancel the edit and hide the form
   const handleCancel = () => {
      setFormVisible(false);
      setEditIndex(null); // Reset edit index
   };

   return (
      <div className="m-4 p-4 w-full flex flex-col items-center">
         <h1 className="text-2xl lg:text-3xl text-slate-700 font-bold mb-4">Manage Achievements</h1>
         <div className="w-32 h-1 bg-red-600 mb-4"></div>

         {/* Achievement Form */}
         {formVisible && (
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="mb-6 w-full lg:w-1/2 p-4 border rounded-lg shadow-lg space-y-4">
               <h2 className="text-lg font-semibold text-gray-700">
                  {editIndex !== null ? "Edit Achievement" : "Add New Achievement"}
               </h2>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                     type="text"
                     {...register("name", { required: "Name is required" })}
                     placeholder="Enter achievement name"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.name && (
                     <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                  <input
                     type="text"
                     {...register("number", {
                        required: "Number is required",
                        pattern: { value: /^\d+$/, message: "Only numbers are allowed" },
                     })}
                     placeholder="Enter achievement number"
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.number && (
                     <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                  )}
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                  <select
                     {...register("symbol")}
                     className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500">
                     <option value="+">+</option>
                     <option value="">None</option>
                  </select>
               </div>

               <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200">
                  {editIndex !== null ? "Update Achievement" : "Add Achievement"}
               </button>

               {/* Cancel Button */}
               <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200">
                  Cancel
               </button>
            </form>
         )}

         {/* Achievement List */}
         <div className="flex flex-wrap w-full justify-center gap-4">
            {cardItems.map((achievement, index) => (
               <div
                  key={achievement.id}
                  className="bg-red-600 w-[23%] lg:h-[20vh] rounded-md shadow-md text-center p-4 text-white hover:shadow-lg transition duration-200">
                  <h1 className="text-xl font-bold">
                     {achievement.number} {achievement.symbol}
                  </h1>
                  <p className="text-sm">{achievement.name}</p>
                  {achievement.imageUrl && (
                     <img
                        src={achievement.imageUrl}
                        alt={achievement.name}
                        className="w-16 h-16 object-cover mt-2 mx-auto"
                     />
                  )}
                  <div className="flex justify-between mt-2">
                     <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-400 text-white py-1 px-2 rounded-md hover:bg-yellow-500 transition">
                        Edit
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
