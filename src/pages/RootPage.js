import React from "react";
import { Link, Outlet } from "react-router-dom";

import "../App.css";

export default function RootPage() {
  return (
    <>
      <div class="App-layout">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header className="App App-header">
            <p>Astro1</p>
          </header>
          <div class="App-bar">
            <Link class="Router-link" to={"page1"}>
              Page1
            </Link>
            <Link class="Router-link" to={"page2"}>
              Page2
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
