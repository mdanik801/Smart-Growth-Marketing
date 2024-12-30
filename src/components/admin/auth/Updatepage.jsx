import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
   updatePassword,
   reauthenticateWithCredential,
   EmailAuthProvider,
   onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../server/firebase";

export default function Updatepage() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm();

   // Monitor Authentication State
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
      });
      return () => unsubscribe();
   }, []);

   const handleChangePassword = async (data) => {
      const { currentPassword, newPassword } = data;

      if (!user) {
         alert("No user is signed in.");
         return;
      }

      try {
         // Reauthenticate the user
         const credential = EmailAuthProvider.credential(user.email, currentPassword);
         await reauthenticateWithCredential(user, credential);

         // Update the password
         await updatePassword(user, newPassword);
         alert("Password updated successfully!");
         reset();
         navigate("/"); // Redirect to the home page
      } catch (error) {
         // Handle specific Firebase errors
         if (error.code === "auth/wrong-password") {
            alert("Current password is incorrect.");
         } else if (error.code === "auth/requires-recent-login") {
            alert("Please re-login to update your password.");
         } else {
            alert(error.message);
         }
      }
   };

   if (!user) {
      return (
         <div className="flex items-center justify-center min-h-screen text-white">
            <div className="w-full max-w-md p-4 bg-red-600 rounded-lg shadow-md">
               <h1 className="text-2xl font-bold text-center">Not Signed In</h1>
               <p className="text-center">Please log in to update your password.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center min-h-screen text-white">
         <div className="w-full max-w-md p-4 space-y-6 bg-red-600 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center">Update Password</h1>
            <form onSubmit={handleSubmit(handleChangePassword)}>
               <div>
                  <label htmlFor="currentPassword" className="block mb-2 text-sm">
                     Current Password
                  </label>
                  <input
                     type="password"
                     id="currentPassword"
                     {...register("currentPassword", {
                        required: "Current Password is required",
                     })}
                     className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-red-500"
                     placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                     <p className="text-xs text-yellow-300 mt-1">
                        {errors.currentPassword.message}
                     </p>
                  )}
               </div>
               <div>
                  <label htmlFor="newPassword" className="block mb-2 text-sm">
                     New Password
                  </label>
                  <input
                     type="password"
                     id="newPassword"
                     {...register("newPassword", {
                        required: "New Password is required",
                        minLength: {
                           value: 8,
                           message: "Password must be at least 8 characters long",
                        },
                     })}
                     className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-red-500"
                     placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                     <p className="text-xs text-yellow-300 mt-1">{errors.newPassword.message}</p>
                  )}
               </div>
               <button
                  type="submit"
                  className="w-full px-4 py-2 mt-4 font-bold text-black bg-white rounded-md hover:bg-gray-300">
                  Update Password
               </button>
            </form>
         </div>
      </div>
   );
}
