import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "./routes";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={routes} />
    </>
  );
}
