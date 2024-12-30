import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../server/firebase";

export default function Achievements() {
   const [cardItems, setCardItems] = useState([]);

   useEffect(() => {
      // Fetch data from Firestore when the component mounts
      const fetchAchievements = async () => {
         const achievementRef = collection(db, "achievements");
         const snapshot = await getDocs(achievementRef);
         const achievementsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setCardItems(achievementsList);
      };

      fetchAchievements();
   }, []);

   return (
      <div className="m-2 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Achievements
         </h1>
         <div className="w-[25vh] h-[0.6vh] mb-4 animate-pulse bg-red-600 "></div>
         <div className="flex flex-wrap space-x-2 w-full justify-center">
            {cardItems.length > 0 ? (
               cardItems.map((item) => (
                  <div
                     key={item.id}
                     className="bg-red-600 w-[23%] lg:h-[15vh] rounded-sm shadow-md cursor-pointer hover:rounded-lg hover:shadow-inner hover:shadow-black shadow-black text-center p-4 duration-200">
                     <h1 className="font-roboto font-extrabold text-white lg:text-[1.5rem]">
                        {item.number} {item.symbol}
                     </h1>
                     <p className="text-white text-[0.8rem]">{item.name}</p>
                  </div>
               ))
            ) : (
               <p className="text-gray-500">Loading achievements...</p>
            )}
         </div>
      </div>
   );
}
