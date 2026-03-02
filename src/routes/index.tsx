import { createBrowserRouter } from "react-router-dom";
import { CreateTemplatePage } from "../pages/create-template";
import ListingPage from "../pages/listing";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <ListingPage />,
  },
  {
    path: "/create-template",
    element: <CreateTemplatePage />,
  },
  {
    path: "/edit-template/:id",
    element: <CreateTemplatePage />,
  },
]);
