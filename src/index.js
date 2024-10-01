import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import RootPage from "./pages/RootPage";
import TransitsPage from "./pages/TransitsPage";
import PlanetsPage from "./pages/PlanetsPage";
import TransitsTablePage from "./pages/TransitsTablePage";
import SynastryTablePage from "./pages/SynastryTablePage";
import PageNotFound from "./pages/PageNotFound";
import SetBaseDate from "./components/SetBaseDate";

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
        path: "/transit-tables",
        element: <TransitsTablePage />,
      },
      {
        path: "/synastry-tables",
        element: <SynastryTablePage />,
      },
      {
        path: "/saved-data",
        element: <SetBaseDate />,
      },
      {
        path: "/",
        element: <TransitsPage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
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
