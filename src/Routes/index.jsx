import {
  createBrowserRouter,
} from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import HomeLayouts from "../Layouts/HomeLayouts";
// import Profile from "../Pages/Profile";
import ProfileLayout from "../Layouts/ProfileLayout";
import ConnectionLayout from "../Layouts/ConnectionLayout";

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
      path: "/Connections",
    element: <ConnectionLayout/>,
  },
]);