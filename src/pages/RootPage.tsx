import React from "react";
import { Link, Outlet } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "../App.css";

export default function RootPage() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
            <button
              type="button"
              onClick={handleClick}
              style={{
                position: "absolute",
                right: "10px",
                cursor: "pointer",
                background: "none",
                border: "none",
                margin: 0,
                padding: 0,
                paddingRight: "10px",
                color: "inherit",
                font: "inherit",
              }}
            >
              <span className="main-menu-text">Menu&nbsp;&nbsp;</span>☰
            </button>
          </header>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- MUI Menu's own focus-management prop, already disabled here, not a DOM attribute
          autoFocus={false}
          disableScrollLock={true}
        >
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/"}>
              Tranzity
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/transits-table"}>
              Tranzity - tabulka
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
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/saved-data"}>
              Uložené záznamy
            </Link>
          </MenuItem>
        </Menu>
        <Outlet />
      </div>
    </>
  );
}
