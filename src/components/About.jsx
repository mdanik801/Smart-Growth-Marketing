import React, { useEffect, useState } from "react";
import Team from "./shared/Team";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";

export default function About() {
   const [headerData, setHeaderData] = useState(null); // State to store header data
   const [loading, setLoading] = useState(true); // Loading state

   // Fetch header data from Firestore when component mounts
   useEffect(() => {
      const fetchHeaderData = async () => {
         try {
            const querySnapshot = await getDocs(collection(db, "aboutdes")); // Fetch all docs in 'aboutdes'
            if (!querySnapshot.empty) {
               const firstDoc = querySnapshot.docs[0]; // Get the first document
               setHeaderData(firstDoc.data()); // Set the fetched data
            } else {
               console.log("No documents found in aboutdes!");
            }
         } catch (error) {
            console.error("Error fetching header data:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchHeaderData();
   }, []); // Empty dependency array to run once on component mount

   if (loading) {
      return <div>Loading...</div>; // Display loading message while data is being fetched
   }

   return (
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            About
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>
         <div className="w-full">
            {/* About description */}
            <p className="text-sm font-Inter text-justify mx-4">
               {headerData?.description || "No description available."}
            </p>
            <Team />
         </div>
      </div>
   );
}
