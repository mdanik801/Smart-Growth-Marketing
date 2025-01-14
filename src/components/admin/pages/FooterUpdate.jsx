import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";

const FooterUpdate = () => {
   const [footerData, setFooterData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   const footerDocRef = doc(db, "footerData", "footer-doc-id");

   // Fetch Footer Data
   const fetchFooterData = async () => {
      try {
         const docSnap = await getDoc(footerDocRef);
         if (docSnap.exists()) {
            setFooterData(docSnap.data());
         } else {
            setError("No footer data found.");
         }
      } catch (err) {
         setError("Failed to fetch footer data.");
         console.error(err);
      } finally {
         setIsLoading(false);
      }
   };

   // Upload Footer Data
   const uploadFooterData = async () => {
      if (!footerData) return;
      try {
         await setDoc(footerDocRef, footerData);
         console.log("Footer data updated successfully.");
      } catch (err) {
         setError("Failed to update footer data.");
         console.error(err);
      }
   };

   // Load data on component mount
   useEffect(() => {
      fetchFooterData();
   }, []);

   // Automatically upload data when footerData changes
   useEffect(() => {
      if (footerData && !isLoading) {
         uploadFooterData();
      }
   }, [footerData]);

   // Handle Contact Updates
   const handleUpdateContact = (field, value) => {
      setFooterData((prev) => ({
         ...prev,
         contact: { ...prev.contact, [field]: value },
      }));
   };

   // Handle List Updates (Add, Update, Delete)
   const handleListUpdate = (listName, action, item = {}, id = null) => {
      setFooterData((prev) => {
         let updatedList = [...prev[listName]];

         switch (action) {
            case "add":
               updatedList.push(item);
               break;
            case "update":
               updatedList = updatedList.map((listItem) =>
                  listItem.id === id ? { ...listItem, ...item } : listItem
               );
               break;
            case "delete":
               updatedList = updatedList.filter((listItem) => listItem.id !== id);
               break;
            default:
               break;
         }

         return { ...prev, [listName]: updatedList };
      });
   };

   // Render Functions
   const renderContact = () => (
      <div className=" bg-slate-600 p-1 my-2 rounded-md border-2 border-red-600 ">
         <h3 className="text-lg font-semibold mb-4">Contact</h3>
         {["address", "email", "website"].map((field) => (
            <div key={field}>
               <label className="block capitalize">{field}:</label>
               <input
                  type="text"
                  value={footerData.contact[field]}
                  onChange={(e) => handleUpdateContact(field, e.target.value)}
                  className="text-white bg-gray-800 px-2 py-1 rounded-md mb-2 w-full  border-b border-red-600"
               />
            </div>
         ))}
         <label className="block">Phone Numbers:</label>
         {footerData.contact.phones.map((phone, index) => (
            <div key={index}>
               <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                     const updatedPhones = [...footerData.contact.phones];
                     updatedPhones[index] = e.target.value;
                     handleUpdateContact("phones", updatedPhones);
                  }}
                  className="text-white bg-gray-800 px-2 py-1 rounded-md mb-2 w-full border-b border-red-600"
               />
            </div>
         ))}
      </div>
   );

   const renderList = (listName, fields) => (
      <div className=" bg-slate-600 p-1 my-4 rounded-md border-2 border-red-600 ">
         <hr className=" mt-6" />
         <h3 className="text-lg text-red-600 uppercase  font-bold font-inter mb-4">
            {listName.replace(/([A-Z])/g, " $1")}
         </h3>
         {footerData[listName].map((item) => (
            <div
               key={item.id}
               className="border p-4 mb-2 rounded-md flex justify-between items-center">
               <div className=" w-full m-3">
                  {" "}
                  {fields.map((field) => (
                     <div key={field} className=" ">
                        <div>
                           {" "}
                           <label className="block capitalize">{field}:</label>
                           <input
                              type="text"
                              value={item[field]}
                              onChange={(e) =>
                                 handleListUpdate(
                                    listName,
                                    "update",
                                    { [field]: e.target.value },
                                    item.id
                                 )
                              }
                              className="text-white bg-gray-800 px-2 py-1 rounded-md mb-2  w-full border-b border-red-600"
                           />
                        </div>
                        {/* Display icon preview if the field is "icon" */}
                        {field === "icon" && item.icon && (
                           <div className="mt-2">
                              <label className="block">Icon Preview:</label>
                              <img src={item.icon} alt="Icon Preview" className="w-12 h-12 mt-2" />
                           </div>
                        )}
                     </div>
                  ))}
               </div>{" "}
               <button
                  onClick={() => handleListUpdate(listName, "delete", {}, item.id)}
                  className=" h-[8vh] bg-red-600 text-white px-2 py-1 rounded-md mt-2">
                  Delete
               </button>
            </div>
         ))}
         <button
            onClick={() =>
               handleListUpdate(listName, "add", {
                  id: Date.now(),
                  ...fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
               })
            }
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-4">
            Add {listName.replace(/([A-Z])/g, " $1")}
         </button>
      </div>
   );

   if (isLoading) return <p>Loading...</p>;
   if (error) return <p className="text-red-600">{error}</p>;

   return (
      <footer className=" text-white py-10">
         <div className="container mx-auto px-6 lg:px-20">
            {renderContact()}
            {renderList("recentPosts", ["title", "url"])}
            {renderList("paymentMethods", ["name", "icon"])}
            {renderList("socialLinks", ["platform", "url", "icon"])}
         </div>
      </footer>
   );
};

export default FooterUpdate;
