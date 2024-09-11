import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/errorPage";
import Explore from "./routes/explore";
import Users from "./routes/users";
import EditPost from "./routes/editPost";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/explore" replace />, // This will redirect to /explore
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "makePost/",
        element: <EditPost />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
