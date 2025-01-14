import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";

export default function Project() {
   const [activeIndex, setActiveIndex] = useState(0); // Active card index
   const [projects, setProjects] = useState([]); // Projects data from Firebase
   const cardListRef = useRef(null);

   // Fetch data from Firestore
   const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectData = querySnapshot.docs.map((doc) => ({
         id: doc.id,
         name: doc.data().name, // Ensure the name field is fetched
         description: doc.data().description,
         imageUrl: doc.data().imageUrl || "", // Handle cases where imageUrl might be empty
      }));
      setProjects(projectData); // Set the fetched data to state
   };

   // Fetch data when the component is mounted
   useEffect(() => {
      fetchProjects();
   }, []);

   // Handle scroll to change active card
   const handleScroll = () => {
      const scrollTop = cardListRef.current.scrollTop;
      const cardHeight = cardListRef.current.children[0].offsetHeight;

      // Calculate active index based on scroll position
      const newIndex = Math.floor(scrollTop / cardHeight);
      setActiveIndex(newIndex);
   };

   if (projects.length === 0) {
      return <div>Loading...</div>; // Show a loading message while data is being fetched
   }

   return (
      <div className="pt-16 p-2 flex flex-col w-full items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Project
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>
         <div className=" w-11/12 flex items-center justify-center h-auto  rounded-lg border border-red-600 shadow-md shadow-gray-500 ">
            <div className="flex flex-col lg:flex-row w-full rounded-lg overflow-hidden">
               {/* Image Section for Mobile */}
               <div className="lg:w-[20%] w-full h-[30vh] overflow-hidden lg:hidden flex items-start justify-center  rounded-t-lg bg-gray-100">
                  <img
                     src={projects[activeIndex].imageUrl} // Use the image URL from Firestore
                     alt={`Project ${activeIndex + 1}`}
                     className="rounded-t-lg shadow-lg w-full sm:w-3/4 h-auto transition-all duration-300"
                  />
               </div>

               {/* Card List */}
               <div
                  ref={cardListRef}
                  className="lg:w-[80%] w-full h-[60vh] overflow-y-auto scrollbar-thumb-red-600 scrollbar-thin lg:mb-0"
                  onScroll={handleScroll}>
                  {projects.map((project, index) => (
                     <div
                        key={project.id}
                        className={`p-4 rounded-b-lg border-y h-[100%] cursor-pointer flex flex-col justify-center bg-gray-100 duration-300 ${
                           index === activeIndex ? "" : ""
                        }`}>
                        <h2 className="text-xl text-shadow-md font-inter  font-bold text-red-600">
                           {" "}
                           {project.name}
                        </h2>{" "}
                        {/* Display project name */}
                        <p className="text-gray-600 text-justify lg:text-[1rem] text-[0.9rem]">
                           {project.description}
                        </p>
                     </div>
                  ))}
               </div>

               {/* Image Section for Desktop */}
               <div className="w-[20%] h-[60vh] hidden lg:flex lg:w-1/2 items-center justify-center p-2 bg-gray-100">
                  <img
                     src={projects[activeIndex].imageUrl} // Use the image URL from Firestore
                     alt={`Project ${activeIndex + 1}`}
                     className="rounded-lg shadow-lg w-full h-auto transition-all duration-500"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
