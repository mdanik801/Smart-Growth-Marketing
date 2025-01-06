import About from "../About";
import Admin from "../admin/Admin";
import Authentication from "../admin/auth/Authentication";
import Updatepage from "../admin/auth/Updatepage";
import Contact from "../Contact";
import Home from "../Home";
import Project from "../Project";
import Services from "../Services";
import ServiceDetails from "../shared/ServiceDetails";

const routes = [
   { path: "/", element: <Home /> },
   { path: "/services", element: <Services /> },
   { path: "/project", element: <Project /> },
   { path: "/contact", element: <Contact /> },
   { path: "/about", element: <About /> },
   { path: "/admin", element: <Admin /> },
   { path: "/update", element: <Updatepage /> },
   { path: "/login", element: <Authentication /> },
   { path: "/details/:id", element: <ServiceDetails /> },
];

export default routes;
