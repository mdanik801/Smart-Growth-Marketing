import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../server/firebase"; // Your Firestore config

const ProjectUpdate = () => {
   const [projects, setProjects] = useState([]); // To store projects from Firestore
   const [editingId, setEditingId] = useState(null); // Track the project being edited
   const [loading, setLoading] = useState(false); // Track form submission loading state

   // Initialize React Hook Form
   const { register, handleSubmit, reset, setValue } = useForm({
      defaultValues: {
         projectName: "",
         imageUrl: "",
         description: "", // Default value for description
      },
   });

   const projectCollectionRef = collection(db, "projects"); // Firestore collection reference

   // Fetch projects from Firestore
   const fetchProjects = async () => {
      const data = await getDocs(projectCollectionRef);
      setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Map Firestore docs to state
   };

   // Convert image file to Base64
   const convertImageToBase64 = (file) => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onloadend = () => resolve(reader.result); // Resolve with Base64 string
         reader.onerror = reject; // Reject if error occurs
         reader.readAsDataURL(file); // Convert image file to Base64
      });
   };

   // Add a new project
   const addProject = async (data) => {
      const { projectName, description, imageFile } = data; // Destructure form data
      if (!projectName || !description) return alert("Please fill all fields!"); // Validation

      setLoading(true); // Set loading to true when submitting

      let base64Image = ""; // Default to empty if no image file
      if (imageFile && imageFile[0]) {
         base64Image = await convertImageToBase64(imageFile[0]); // Convert the image to Base64
      }

      await addDoc(projectCollectionRef, {
         name: projectName,
         imageUrl: base64Image, // Save Base64 string in Firestore
         description,
      }); // Add to Firestore

      setLoading(false); // Set loading to false after submitting
      reset(); // Reset form fields
      fetchProjects(); // Refresh the project list
   };

   // Update an existing project
   const updateProject = async (data) => {
      const { projectName, description, imageFile } = data; // Destructure form data
      const projectDoc = doc(db, "projects", editingId); // Reference to the document to update

      setLoading(true); // Set loading to true when submitting

      let base64Image = data.imageUrl || ""; // Retain current Base64 image if no new file is selected
      if (imageFile && imageFile[0]) {
         base64Image = await convertImageToBase64(imageFile[0]); // Convert the new image to Base64
      }

      await updateDoc(projectDoc, {
         name: projectName,
         imageUrl: base64Image,
         description,
      }); // Update Firestore document

      setLoading(false); // Set loading to false after submitting
      reset(); // Reset form fields
      setEditingId(null); // Clear editing state
      fetchProjects(); // Refresh the project list
   };

   // Delete a project
   const deleteProject = async (id) => {
      const projectDoc = doc(db, "projects", id); // Reference to the document to delete
      await deleteDoc(projectDoc); // Delete Firestore document
      fetchProjects(); // Refresh the project list
   };

   // Load data into the form for editing
   const handleEdit = (project) => {
      setEditingId(project.id); // Set the editing ID
      setValue("projectName", project.name); // Populate the form fields
      setValue("imageUrl", project.imageUrl);
      setValue("description", project.description);
   };

   // Fetch projects on component mount
   useEffect(() => {
      fetchProjects();
   }, []);

   return (
      <div className="pt-16 p-4 flex flex-col items-center bg-gray-100 w-full border min-h-screen">
         <h1 className="text-[1.5rem] lg:text-[2.2rem] text-slate-700 font-extrabold font-Inter">
            Project Update
         </h1>
         <div className="w-[25vh] h-[0.6vh] my-4 bg-red-600 animate-pulse"></div>

         {/* Form */}
         <form
            onSubmit={handleSubmit(editingId ? updateProject : addProject)}
            className="w-full max-w-md flex flex-col items-center gap-4 border p-2 bg-gray-200 rounded-lg shadow-lg">
            <input
               {...register("projectName")}
               type="text"
               placeholder="Project Name"
               className="p-2 border border-gray-300 rounded w-full"
            />

            {/* Image file input */}
            <input
               {...register("imageFile")}
               type="file"
               accept="image/*"
               className="p-2 border border-gray-300 rounded w-full"
            />

            <textarea
               {...register("description")}
               placeholder="Description"
               maxLength={1200}
               className="p-2 max-h-[20vh] min-h-[20vh] border border-gray-300 rounded w-full"
            />
            <p>max 1200 character input</p>

            <button
               type="submit"
               className={`${
                  editingId ? "bg-blue-600" : "bg-green-600"
               } text-white px-4 py-2 rounded`}>
               {loading
                  ? editingId
                     ? "Updating..."
                     : "Submitting..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
            </button>
         </form>

         {/* Project List */}
         <div className="w-full flex flex-wrap max-w-md mt-8">
            {projects.map((project) => (
               <div
                  key={project.id}
                  className="p-4 border border-gray-300 rounded mb-4 flex justify-between items-center">
                  <div>
                     <h2 className="text-lg font-bold">{project.name}</h2>
                     {/* <p className="text-sm text-gray-600">{project.description}</p> */}
                     {/* Display the Base64 image */}
                     {project.imageUrl ? (
                        <img
                           src={project.imageUrl} // Use the Base64 string as the image source
                           alt={project.name}
                           className="w-20 h-20 mt-2"
                        />
                     ) : (
                        <div>No Image</div> // Handle cases where no image exists
                     )}
                  </div>
                  <div className="flex gap-2">
                     <button
                        onClick={() => handleEdit(project)}
                        className="bg-yellow-600 text-white px-2 py-1 rounded">
                        Edit
                     </button>
                     <button
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded">
                        Delete
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ProjectUpdate; // Ensure the default export is here
