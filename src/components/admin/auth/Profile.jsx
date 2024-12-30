import React from "react";
import { useAuthState } from "react-firebase-hooks/auth"; // Import the hook
import { Link } from "react-router";
import { auth } from "../../../server/firebase";

export default function Profile() {
   const [user] = useAuthState(auth); // Use the hook to get the current user

   if (!user) {
      return (
         <>
            <p className="text-center">Admin Not login please Login First</p>
            <Link to="/login">
               <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
                  Login
               </button>
            </Link>
         </>
      );
   }

   return (
      <div>
         <h2 className="text-lg font-bold text-black text-center">Profile</h2>
         <div className="mt-4">
            <p className="text-black">
               <strong>Email:</strong> {user.email}
            </p>
            <p className="text-black">
               <strong>User ID:</strong> {user.uid}
            </p>
         </div>
         {/* Add additional profile options/actions here */}
         <button
            onClick={() => auth.signOut()}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
            Log Out
         </button>
         <Link to="/update">
            <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
               Update Password
            </button>
         </Link>
      </div>
   );
}
