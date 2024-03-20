import React from "react";
import { Link, Outlet } from "react-router-dom";

import "../App.css";

export default function RootPage() {
  return (
    <>
      <div className="App-layout">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header className="App App-header">
            <p>Astro1</p>
          </header>
          <div className="App-bar">
            <Link className="Router-link" to={"page1"}>
              Page 1
            </Link>
            <Link className="Router-link" to={"page2"}>
              Transits
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
