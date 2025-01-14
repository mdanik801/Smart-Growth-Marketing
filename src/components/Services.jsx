import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../server/firebase";

export default function Services() {
   const [services, setServices] = useState([]);
   const navigate = useNavigate(); // React Router navigation hook

   // Fetch services from Firestore
   const fetchServices = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "services"));
         const servicesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setServices(servicesData);
      } catch (error) {
         console.error("Error fetching services: ", error);
      }
   };

   useEffect(() => {
      fetchServices();
   }, []);

   // Manage description truncation
   const handleDescriptionToggle = (id) => {
      setServices(
         services.map((service) =>
            service.id === id ? { ...service, isExpanded: !service.isExpanded } : service
         )
      );
   };

   // Hire button handler - This function will now receive the specific service
   const handleHireClick = (service) => {
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
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Services
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         {/* Card Section */}
         <div className="w-full h-auto p-3 flex flex-wrap justify-center items-center">
            {services.length === 0 ? (
               <p className="text-gray-500 text-center">No services available.</p>
            ) : (
               services.map((service) => (
                  <div
                     key={service.id}
                     className="lg:w-[20%] bg-white h-[65vh] m-2 p-3 border border-red-600 rounded-lg shadow-md shadow-black flex flex-col items-center">
                     <div className="h-[20%]">
                        <img
                           className="w-[5rem] h-[5rem] object-cover rounded-full"
                           src={service.image}
                           alt={service.name}
                        />
                     </div>
                     <div className=" w-full h-[60%]">
                        {" "}
                        <h1 className=" lg:text-[1.2rem] text-center font-Inter font-bold text-slate-700">
                           {service.name}
                        </h1>
                        {/* Truncated Description */}
                        <p className="h-auto my-2 font-Inter text-justify text-[0.8rem] text-slate-700">
                           {service.isExpanded
                              ? service.description
                              : `${service.description.substring(0, 300)} `}
                           {service.description.length > 300 && (
                              <button
                                 onClick={() => handleDescriptionToggle(service.id)}
                                 className="font-Inter text-sm text-blue-600 hover:text-blue-800 ">
                                 {service.isExpanded ? (
                                    "See Less"
                                 ) : (
                                    <button
                                       className=" text-red-500"
                                       onClick={() => navigate(`/details/${service.id}`)}>
                                       {" "}
                                       See more......
                                    </button>
                                 )}
                              </button>
                           )}
                        </p>
                     </div>

                     <div className="h-[18%] mb-5 w-full flex flex-col items-center">
                        <button
                           onClick={() => handleHireClick(service)} // Pass the service data here
                           className="font-Inter font-semibold text-red-600 hover:text-slate-700 text-shadow-sm border border-red-600 w-[70%] h-[2.4rem] my-1 rounded-full shadow shadow-black hover:shadow-none duration-300 hover:border-slate-700 p-2">
                           Hire Us
                        </button>
                        <button
                           onClick={() => navigate(`/details/${service.id}`)} // Navigate to details page
                           className="font-Inter font-semibold text-red-600 hover:text-slate-700 text-shadow-sm border border-red-600 w-[70%] h-[2.4rem] my-1 rounded-full shadow shadow-black hover:shadow-none duration-300 hover:border-slate-700 p-2">
                           Details
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
