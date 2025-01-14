import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Adjusted import for react-router-dom
import Bannerimg2 from "../../assets/banerimg2.gif"; // Banner image
import { db, doc } from "../../server/firebase";
import { getDoc } from "firebase/firestore";

export default function Header() {
   const [headerData, setHeaderData] = useState(null); // State to store header data
   const [loading, setLoading] = useState(true); // Loading state

   // Fetch header data from Firestore when component mounts
   useEffect(() => {
      const fetchHeaderData = async () => {
         try {
            const docRef = doc(db, "headers", "item_0");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               setHeaderData(docSnap.data()); // Set the fetched data
            } else {
               console.log("No such document!");
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
      <>
         {/* Banner Section */}
         <div className="pt-16 w-full p-4 bg-slate-300 rounded-lg py-8">
            <div className="w-full lg:h-[80vh] m-2  lg:flex flex-wrap ">
               {/* Details section */}
               <div className="h-full lg:w-7/12 lg:p-10 flex flex-col justify-center">
                  <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
                     Smart Growth Marketing
                  </h1>
                  <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>
                  <p className="text-sm font-Inter text-justify">
                     {headerData?.description || "Loading description..."}{" "}
                     {/* Dynamic description from Firebase */}
                  </p>
                  <div className="my-8 lg:h-[8vh] h-[6vh] flex lg:justify-start justify-center">
                     <Link to="/contact">
                        <button className="animate-bounce bg-red-600 lg:w-[30vh] w-[40vh] p-2 text-lg font-bold text-white rounded-xl shadow-md shadow-black text-shadow-lg hover:text-red-600 hover:bg-gray-300 hover:border-b-2 border-red-600 duration-300">
                           Contact Us
                        </button>
                     </Link>
                  </div>
               </div>
               {/* Image section */}
               <div className="h-full lg:w-5/12">
                  <img src={Bannerimg2} alt="Banner" />
               </div>
            </div>
         </div>
      </>
   );
}
