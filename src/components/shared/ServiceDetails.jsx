import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../server/firebase";

export default function ServiceDetails() {
   const { id } = useParams(); // Get the service ID from the route
   const [service, setService] = useState(null);

   const fetchServiceDetails = async () => {
      try {
         console.log("Fetching service for ID:", id); // Debugging ID
         const docRef = doc(db, "services", id);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            console.log("Service Data:", docSnap.data()); // Debugging data
            setService({ id: docSnap.id, ...docSnap.data() });
         } else {
            console.error("No such document found!");
         }
      } catch (error) {
         console.error("Error fetching service details:", error);
      }
   };

   useEffect(() => {
      fetchServiceDetails();
   }, [id]);

   if (!service) {
      return <p className="text-center text-gray-500">Loading service details...</p>;
   }

   // WhatsApp link format: https://wa.me/<phone_number>?text=<message>
   const handleHireClick = () => {
      if (!service.name) {
         console.error("Service name is missing!"); // Debugging missing name
         return;
      }

      const phoneNumber = "+8801772554705"; // Replace with the desired WhatsApp phone number (including country code)
      const message = `I'm interested in hiring for the service: ${service.name}`;

      // Debugging the message
      console.log("Message for WhatsApp:", message);

      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Debugging the final WhatsApp link
      console.log("WhatsApp Link:", whatsappLink);

      // Open WhatsApp chat in a new tab
      window.open(whatsappLink, "_blank");
   };

   return (
      <div className="pt-16 p-4 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Service Details
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         {/* Service Details Card */}
         <div className="lg:w-[40%] bg-white min-h-[60vh] p-6 rounded-lg shadow-md border border-red-600 shadow-black">
            <img
               className="w-[7rem] h-[7rem] object-cover rounded-full mx-auto mb-4"
               src={service.image}
               alt={service.name}
            />
            <h1 className="text-center text-[1.5rem] font-bold text-slate-700">{service.name}</h1>
            <p className="text-center text-gray-600 my-4">{service.description}</p>
            <button
               onClick={handleHireClick}
               className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
               Hire {service.name}
            </button>
         </div>
      </div>
   );
}
