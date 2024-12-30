import React from "react";

export default function About() {
   return (
      <div className="pt-16  p-2  flex flex-col items-center">
         <h1 className=" text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            About
         </h1>
         <div className=" w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse "></div>
      </div>
   );
}
