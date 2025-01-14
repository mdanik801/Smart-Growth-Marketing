import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../server/firebase";

export default function ServicesCard() {
   const [services, setServices] = useState([]);
   const navigate = useNavigate();

   // Fetch services from Firestore
   const fetchServices = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "services"));
         const servicesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));

         // Sort services to show the last item first (reverse order by timestamp or id)
         const sortedServices = servicesData.sort((a, b) => {
            // Replace `timestamp` with your actual property for sorting
            return new Date(b.timestamp) - new Date(a.timestamp);
         });

         setServices(sortedServices);
      } catch (error) {
         console.error("Error fetching services: ", error);
      }
   };

   useEffect(() => {
      fetchServices();
   }, []);

   // Limit services to the first 4
   const displayedServices = services.slice(0, 4);

   const handleDescriptionToggle = (id) => {
      setServices(
         services.map((service) =>
            service.id === id ? { ...service, isExpanded: !service.isExpanded } : service
         )
      );
   };

   const handleHireClick = (service) => {
      if (!service.name) return;

      const phoneNumber = "+8801772554705";
      const message = `I'm interested in hiring for the service: ${service.name}`;
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
   };

   return (
      <div className="pt-16 p-2 flex flex-col items-center">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 text-shadow-md font-extrabold font-Inter">
            Services
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         <div className="w-full h-auto  p-3  flex flex-wrap justify-center items-center">
            {displayedServices.length === 0 ? (
               <p className="text-gray-500 text-center">No services available.</p>
            ) : (
               displayedServices.map((service) => (
                  <div
                     key={service.id}
                     className="lg:w-[22.5%] bg-white h-[65vh] m-2 p-3 border border-red-600 rounded-lg shadow-md shadow-black flex flex-col items-center">
                     <div className="h-[20%]">
                        <img
                           className="w-[5rem] h-[5rem] object-cover rounded-full"
                           src={service.image}
                           alt={service.name}
                        />
                     </div>
                     <div className="w-full h-[60%]">
                        <h1 className="lg:text-[1.2rem] text-center font-Inter font-bold text-slate-700">
                           {service.name}
                        </h1>
                        <p className="h-auto my-2 font-Inter text-justify text-[0.8rem] text-slate-700">
                           {service.isExpanded
                              ? service.description
                              : `${service.description.substring(0, 300)} `}
                           {service.description.length > 300 && (
                              <button
                                 onClick={() => navigate(`/details/${service.id}`)}
                                 className="font-Inter text-sm text-blue-600 hover:text-blue-800">
                                 See More...
                              </button>
                           )}
                        </p>
                     </div>
                     <div className="h-[18%] mb-5 w-full flex flex-col items-center">
                        <button
                           onClick={() => handleHireClick(service)}
                           className="font-Inter font-semibold text-red-600 hover:text-slate-700 text-shadow-sm border border-red-600 w-[70%] h-[2.4rem] my-1 rounded-full shadow shadow-black hover:shadow-none duration-300 hover:border-slate-700 p-2">
                           Hire Us
                        </button>
                        <button
                           onClick={() => navigate(`/details/${service.id}`)}
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
