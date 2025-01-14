import React, { useState, useEffect } from "react";
import Header from "./shared/Header";
import Achievements from "./shared/Achievements";
import Services from "./Services";
import Project from "./Project";
import Contact from "./Contact";
import Team from "./shared/Team";

import Logo from "../assets/digital growth marketingpng.png";
import Footer from "./shared/Footer";

export default function Home() {
   const [showIntro, setShowIntro] = useState(true);
   const [introPhase, setIntroPhase] = useState("enter"); // Tracks animation phase: "enter", "exit", or "none"

   useEffect(() => {
      const timer = setTimeout(() => {
         setIntroPhase("exit"); // Trigger the outro animation
         const outroTimer = setTimeout(() => {
            setShowIntro(false); // Hide intro after outro animation
         }, 1000); // Duration of the outro animation
         return () => clearTimeout(outroTimer);
      }, 3000); // Intro lasts 3 seconds
   }, []);

   return (
      <div className="h-screen overflow-y-scroll scrollbar scrollbar-thumb-red-500 scrollbar-track-white">
         {showIntro ? (
            // Intro Section with Enter, Blur, Drop, and Exit Animation
            <div
               className={`h-full w-full flex justify-center items-center ${
                  introPhase === "enter"
                     ? "bg-black animate-fade-in-blur" // Blur and fade in when starting
                     : "bg-black animate-fade-out" // Fade out during exit
               }`}>
               <div
                  className={`${
                     introPhase === "enter"
                        ? "animate-drop-in" // Drop in during the intro phase
                        : "animate-fade-out" // Fade out during outro phase
                  } w-10/12 max-w-lg flex items-center justify-center bg-gray-100 p-8 rounded-full shadow-xl`}>
                  <img src={Logo} alt="Company Logo" className="rounded-full w-full max-w-xs" />
               </div>
            </div>
         ) : (
            // Main Content
            <>
               <Header />
               <Achievements />
               <Services />
               <Team />
               <Project />
               <Contact />
               <Footer />
            </>
         )}
      </div>
   );
}
