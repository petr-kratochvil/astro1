import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import RootPage from "./pages/RootPage";
import TransitsPage from "./pages/TransitsPage";
import PlanetsPage from "./pages/CurrentPlanetsPage";
import PageNotFound from "./pages/PageNotFound";
import SetBaseDate from "./components/SetBaseDate";
import SavedDataList from "./components/SavedDataList";
import NatalPage from "./pages/NatalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,

    children: [
      {
        path: "/current-planets",
        element: <PlanetsPage />,
      },
      {
        path: "/natal-planets",
        element: <NatalPage />,
      },
      {
        path: "/saved-data",
        element: <SavedDataList />,
      },
      {
        path: "/saved-data/:index",
        element: <SetBaseDate />,
      },
      {
        path: "/",
        element: <TransitsPage />,
      },
      {
        path: "/transits-table",
        element: <TransitsPage showAsTable />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
