import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import HeaderButton from "../components/HeaderButton";
import LanguageSelect from "../components/LanguageSelect";

import "../App.css";

export default function RootPage() {
  const { t } = useTranslation();
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
            <div className="App-header-actions">
              <LanguageSelect />
              <HeaderButton
                onClick={handleClick}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="Menu"
              >
                <span className="main-menu-text">Menu</span>
                {/* Inline SVG rather than the ☰ glyph: its ink is centred in
                    its own box on every platform, whereas U+2630 sits high or
                    low depending on which font ends up supplying it. */}
                <svg
                  className="main-menu-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </HeaderButton>
            </div>
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
              {t("menu.transits")}
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/transits-table"}>
              {t("menu.transitsTable")}
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/current-planets"}>
              {t("menu.currentPlanets")}
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/natal-planets"}>
              {t("menu.natalPlanets")}
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link className="Router-link" to={"/saved-data"}>
              {t("menu.savedData")}
            </Link>
          </MenuItem>
        </Menu>
        <Outlet />
      </div>
    </>
  );
}
