import {
  createBrowserRouter,
} from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import HomeLayouts from "../Layouts/HomeLayouts";
// import Profile from "../Pages/Profile";
import ProfileLayout from "../Layouts/ProfileLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },

   {
    path: "/register",
    element: <Register/>,
  },

  {
    path: "/home",
    element: <HomeLayouts/>,
  },

  {
    path: "/Profile",
    element: <ProfileLayout/>,
  },
  {

  },
]);