import React from "react";
import { Link, Outlet } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "../App.css";

export default function RootPage() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="App-layout">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header className="App App-header">
            <div>Astro Transits</div>
            <div
              onClick={handleClick}
              style={{
                position: "absolute",
                right: "10px",
                paddingRight: "10px",
                cursor: "pointer",
              }}
            >
              <span class="main-menu-text">Menu&nbsp;&nbsp;</span>
              ☰
            </div>
          </header>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          autoFocus={false}
          disableScrollLock={true}
        >
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/"}>
              Tranzity
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/current-planets"}>
              Aktuální planety
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/natal-planets"}>
              Nativní planety
            </Link>
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/transit-tables"}>
              Transit Tables
            </Link>
          </MenuItem> */}
          {/* <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/synastry-tables"}>
              Synastry Tables
            </Link>
          </MenuItem> */}
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/saved-data"}>
              Uložené záznamy
            </Link>
          </MenuItem>
        </Menu>
        <Outlet />
        <div id="chartElement" style={{ margin: "20px" }}></div>
      </div>
    </>
  );
}
