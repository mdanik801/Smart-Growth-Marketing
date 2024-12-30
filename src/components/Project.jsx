import React, { useState, useRef } from "react";

export default function Project() {
   const [activeIndex, setActiveIndex] = useState(0);
   const cardListRef = useRef(null);

   const cards = [
      {
         id: 1,
         title: "Card 1",
         description: "This is the description for card 1.",
         image: "https://via.placeholder.com/600x400?text=Image+1",
      },
      {
         id: 2,
         title: "Card 2",
         description: "This is the description for card 2.",
         image: "https://via.placeholder.com/600x400?text=Image+2",
      },
      {
         id: 3,
         title: "Card 3",
         description: "This is the description for card 3.",
         image: "https://via.placeholder.com/600x400?text=Image+3",
      },
      {
         id: 4,
         title: "Card 4",
         description: "This is the description for card 4.",
         image: "https://via.placeholder.com/600x400?text=Image+4",
      },
   ];

   // Handle scroll to change active card
   const handleScroll = () => {
      const scrollTop = cardListRef.current.scrollTop;
      const cardHeight = cardListRef.current.children[0].offsetHeight;
      const newIndex = Math.floor(scrollTop / cardHeight);
      setActiveIndex(newIndex);
   };

   return (
      <div className="pt-16 p-2 flex flex-col w-full items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Project
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>
         <div className="flex items-center justify-center h-auto w-full">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl">
               {/* Left Content */}
               <div
                  ref={cardListRef}
                  className="w-full lg:w-1/2 overflow-y-auto pr-4 border border-red-600 rounded-lg scrollbar-thumb-red-600 scrollbar-thin mb-4 lg:mb-0"
                  onScroll={handleScroll}>
                  {cards.map((card, index) => (
                     <div
                        key={card.id}
                        className={`p-4 mb-4 border-y h-full border-red-600 cursor-pointer hover:bg-gray-100 ${
                           index === activeIndex ? "bg-blue-100" : ""
                        }`}>
                        <h2 className="text-lg font-bold">{card.title}</h2>
                        <p className="text-gray-600">{card.description}</p>
                     </div>
                  ))}
               </div>

               {/* Right Image */}
               <div className="w-full lg:w-1/2 flex items-center justify-center">
                  <img
                     src={cards[activeIndex].image}
                     alt={cards[activeIndex].title}
                     className="rounded-lg shadow-lg w-full sm:w-3/4 lg:w-3/4 h-auto transition-all duration-500"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
