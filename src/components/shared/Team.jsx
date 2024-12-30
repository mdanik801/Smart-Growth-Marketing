import React, { useEffect, useState } from "react";
import { db } from "../../server/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Team() {
   const [teamMembers, setTeamMembers] = useState([]); // State to hold the fetched team members

   useEffect(() => {
      // Fetch team data from Firebase Firestore
      const fetchTeamMembers = async () => {
         try {
            const querySnapshot = await getDocs(collection(db, "teamMembers"));
            const members = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setTeamMembers(members);
         } catch (error) {
            console.error("Error fetching team members:", error);
         }
      };

      fetchTeamMembers(); // Call the function to fetch the team members
   }, []); // Empty dependency array to run the fetch only once after component mounts

   return (
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Team Member's
         </h1>
         <div className="w-[25vh] h-[0.6vh] mb-4 animate-pulse bg-red-600"></div>

         <div className="w-full h-auto p-4 flex flex-wrap justify-center items-center">
            {/* Render the fetched team members */}
            {teamMembers.length === 0 ? (
               <div>Loading...</div>
            ) : (
               teamMembers.map((member) => (
                  <div
                     key={member.id}
                     className="h-[45vh] lg:w-[18%] w-full  bg-slate-200 cursor-pointer m-3 p-2 border-b-4 hover:border border-red-600 rounded-md flex flex-col items-center shadow-lg hover:shadow-none shadow-black duration-300">
                     <div className="w-[15vh] h-[15vh] flex justify-center items-center rounded-full overflow-hidden shadow-md shadow-black">
                        <img src={member.img} alt="" className="h-full w-full" />
                     </div>
                     <div className="w-full m-1 pt-6 flex flex-col items-center justify-center">
                        <h1 className="lg:text-[1.1rem] text-[1.5rem] font-semibold text-slate-700">
                           {member.name}
                        </h1>
                        <h3 className="font-roboto font-semibold lg:text-[0.7rem] text-[0.6rem] text-red-800">
                           {member.expart}
                        </h3>
                        <div className="flex justify-center items-center my-5 space-x-2">
                           {member.linkdin && (
                              <a href={member.linkdin} target="_blank" rel="noopener noreferrer">
                                 <img
                                    className="bg-red-600 p-1 shadow-md shadow-black w-7 rounded-full animate-bounce hover:animate-none hover:bg-slate-600 duration-300"
                                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/linkedin.png"
                                    alt="LinkedIn"
                                 />
                              </a>
                           )}
                           {member.whatsapp && (
                              <a href={member.whatsapp} target="_blank" rel="noopener noreferrer">
                                 <img
                                    className="bg-red-600 p-1 shadow-md shadow-black w-7 rounded-full animate-bounce hover:animate-none hover:bg-slate-600 duration-300"
                                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/whatsapp.png"
                                    alt="WhatsApp"
                                 />
                              </a>
                           )}
                           {member.gmail && (
                              <a href={member.gmail} target="_blank" rel="noopener noreferrer">
                                 <img
                                    className="bg-red-600 p-1 shadow-md shadow-black w-7 rounded-full animate-bounce hover:animate-none hover:bg-slate-600 duration-300"
                                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/gmail.png"
                                    alt="Gmail"
                                 />
                              </a>
                           )}
                           {member.facebook && (
                              <a href={member.facebook} target="_blank" rel="noopener noreferrer">
                                 <img
                                    className="bg-red-600 p-1 shadow-md shadow-black w-7 rounded-full animate-bounce hover:animate-none hover:bg-slate-600 duration-300"
                                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/facebook-new.png"
                                    alt="Facebook"
                                 />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
