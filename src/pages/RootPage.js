import React from "react";
import { Link, Outlet } from "react-router-dom";

import "../App.css";

export default function RootPage() {
  return (
    <>
      <div className="App-layout">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header className="App App-header">
            <p>Astro Transits</p>
          </header>
          <div className="App-bar">
            {/* <Link className="Router-link" to={"/"}>
              Transits
            </Link> */}
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
