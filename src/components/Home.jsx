import React from "react";
import Header from "./shared/Header";
import Achievements from "./shared/Achievements";
import Services from "./Services";
import Project from "./Project";
import Contact from "./Contact";
import Team from "./shared/Team";

export default function Home() {
   return (
      <div className="h-screen overflow-y-scroll  scrollbar scrollbar-thumb-red-500 scrollbar-track-white">
         <Header />
         <Achievements />
         <Services />
         <Team />
         <Project />
         <Contact />
      </div>
   );
}
