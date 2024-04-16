import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import RootPage from "./pages/RootPage";
import TransitsPage from "./pages/TransitsPage";
import PlanetsPage from "./pages/PlanetsPage";
import TransitsAndSynastryPage from "./pages/TransitsAndSynastryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,

    children: [
      {
        path: "/planets",
        element: <PlanetsPage />,
      },
      {
        path: "/tables",
        element: <TransitsAndSynastryPage />,
      },
      {
        path: "/",
        element: <TransitsPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
