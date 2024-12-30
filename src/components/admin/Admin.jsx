import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // To check user authentication status

import Profile from "./auth/Profile";
import Authentication from "./auth/Authentication";
import { auth } from "../../server/firebase";
import HeaderUpdate from "./pages/HeaderUpdate";
import AchievementUpdate from "./pages/AchivementUpdate";
import ServicesUpdate from "./pages/ServicesUpdate";
import TeamUpdate from "./pages/TeamUpdate";
import ProjectUpdate from "./pages/ProjectUpdate";

export default function Admin() {
   const [showProfile, setShowProfile] = useState(false); // State to toggle the profile visibility
   const [user, setUser] = useState(null); // State to store the logged-in user

   // Monitor authentication state
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser); // Set user on state change
      });

      return () => unsubscribe(); // Clean up on component unmount
   }, []);

   return (
      <div className="pt-16  p-2  flex flex-col items-center w-full">
         <h1 className=" text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Admin Page
         </h1>
         <div className="w-32 h-1 animate-pulse bg-red-600 mb-4"></div>

         {/* Authentication Component - Show if no user is logged in */}
         {!user ? (
            <div className="flex justify-center items-center w-full  text-white ">
               <div className="text-center w-full rounded-lg shadow-md">
                  <h1 className="text-lg font-bold mb-6">
                     {" "}
                     To access your profile and update information, please sign in.
                  </h1>

                  <Authentication />
               </div>
            </div>
         ) : (
            //  Show if user is logged in show the componet
            <div className=" w-full">
               <HeaderUpdate />
               <hr />
               <AchievementUpdate />
               <hr />
               <ServicesUpdate />
               <hr />
               <TeamUpdate />
               <hr />
               <ProjectUpdate />
               <hr />

               {/* Profile Card */}
               {showProfile && (
                  <div className="fixed top-16 right-4 bg-white p-4 shadow-md rounded-lg w-80">
                     <Profile />
                  </div>
               )}

               {/* Fixed Button to Toggle Profile */}
               <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 focus:outline-none">
                  {showProfile ? "Hide Profile" : "Show Profile"}
               </button>
            </div>
         )}
      </div>
   );
}
