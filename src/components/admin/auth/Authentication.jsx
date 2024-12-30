import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../server/firebase";

export default function Authentication() {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm();

   // Sign In Function
   const handleSignIn = async (data) => {
      try {
         const { email, password } = data;
         const userCredential = await signInWithEmailAndPassword(auth, email, password);
         alert("Sign In Successful! Welcome back, " + userCredential.user.email);
         reset();
      } catch (error) {
         alert(error.message);
      }
   };

   const onSubmit = (data) => {
      handleSignIn(data);
   };

   return (
      <div className="flex items-center justify-center min-h-screen text-white">
         <div className="w-full max-w-md p-4 space-y-6 bg-red-600 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center">Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div>
                  <label htmlFor="email" className="block mb-2 text-sm">
                     Email
                  </label>
                  <input
                     type="email"
                     id="email"
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                           message: "Enter a valid email",
                        },
                     })}
                     className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-red-500"
                     placeholder="Enter your email"
                  />
                  {errors.email && (
                     <p className="text-xs text-yellow-300 mt-1">{errors.email.message}</p>
                  )}
               </div>
               <div>
                  <label htmlFor="password" className="block mb-2 text-sm">
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 8,
                           message: "Password must be at least 8 characters long",
                        },
                     })}
                     className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-red-500"
                     placeholder="Enter your password"
                  />
                  {errors.password && (
                     <p className="text-xs text-yellow-300 mt-1">{errors.password.message}</p>
                  )}
               </div>
               <button
                  type="submit"
                  className="w-full px-4 py-2 mt-4 font-bold text-black bg-white rounded-md hover:bg-gray-300">
                  Sign In
               </button>
            </form>
         </div>
      </div>
   );
}
