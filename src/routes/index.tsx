import { createBrowserRouter } from "react-router-dom";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
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
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);
