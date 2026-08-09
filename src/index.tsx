import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import "./i18n";
import theme from "./theme";
import RootPage from "./pages/RootPage";
import TransitsPage from "./pages/TransitsPage";
import PlanetsPage from "./pages/CurrentPlanetsPage";
import PageNotFound from "./pages/PageNotFound";
import SavedDataDetail from "./components/data/SavedDataDetail";
import SavedDataList from "./components/data/SavedDataList";
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
        element: <SavedDataDetail />,
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
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
