import React, { useState, useEffect } from "react";
import { Link } from "react-router";

import Logo from "../../assets/digital growth marketingpng2.png";

export default function Navbar() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isNavbarVisible, setIsNavbarVisible] = useState(true);

   let lastScrollY = window.scrollY;

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > lastScrollY) {
            // Scrolling down
            setIsNavbarVisible(false);
         } else {
            // Scrolling up
            setIsNavbarVisible(true);
         }
         lastScrollY = window.scrollY;
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   const navItems = [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "What We Are", path: "/what-we-are" },
      { name: "About Us", path: "/about" },
      { name: "Project", path: "/project" },
      { name: "Contact", path: "/contact" },
   ];

   return (
      <>
         {/* Navbar */}
         <nav
            className={`bg-slate-200  fixed w-full transition-transform duration-300 ${
               isNavbarVisible ? "translate-y-0" : "-translate-y-full"
            }`}
            style={{ zIndex: 1000 }} // Ensure navbar is above other content
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
               <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                     <Link to="/">
                        <img className="w-[12rem] " src={Logo} alt="Logo" />{" "}
                     </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="hidden md:flex space-x-2">
                     {navItems.map((item) => (
                        <Link
                           key={item.name}
                           to={item.path}
                           className=" text-red-600 hover:text-slate-700 px-3 py-2 rounded-md text-lg font-bold font-Inter  hover:text-shadow-sm duration-300">
                           {item.name}
                        </Link>
                     ))}
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="-mr-2 flex md:hidden">
                     <button
                        type="button"
                        className="bg-black inline-flex items-center justify-center p-2 rounded-md text-red-500 hover:text-red-700 focus:outline-none"
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? (
                           <svg
                              className="block h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M6 18L18 6M6 6l12 12"
                              />
                           </svg>
                        ) : (
                           <svg
                              className="block h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true">
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M4 6h16M4 12h16m-7 6h7"
                              />
                           </svg>
                        )}
                     </button>
                  </div>
               </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
               <div className="md:hidden" id="mobile-menu">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                     {navItems.map((item) => (
                        <Link
                           key={item.name}
                           to={item.path}
                           className="text-red-500 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium"
                           onClick={() => setIsMobileMenuOpen(false)}>
                           {item.name}
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </nav>
      </>
   );
}
