import React from "react";
import { Link, Outlet } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
            <div onClick={handleClick} style={{position: 'absolute', right: '10px', paddingRight: '10px', cursor: 'pointer'}}>☰</div>
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
              Transits
            </Link></MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/tables"}>
              Tables
            </Link>
          </MenuItem>
        </Menu>
        <Outlet />
      </div>
    </>
  );
}
