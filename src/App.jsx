import { Route, Routes } from "react-router";

import Services from "./components/Services";
import Project from "./components/Project";
import Contact from "./components/Contact";
import Navbar from "./components/shared/Navbar";
import About from "./components/About";
import Admin from "./components/admin/Admin";
import Updatepage from "./components/admin/auth/Updatepage";
import Authentication from "./components/admin/auth/Authentication";
import ServiceDetails from "./components/shared/ServiceDetails";
import Home from "./components/home/Home";

function App() {
   return (
      <>
         <div className=" ">
            {" "}
            <Navbar />
         </div>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/project" element={<Project />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/update" element={<Updatepage />} />
            <Route path="/login" element={<Authentication />} />
            <Route path="/details/:id" element={<ServiceDetails />} />
         </Routes>
      </>
   );
}

export default App;
