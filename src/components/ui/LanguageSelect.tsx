import React from "react";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HeaderButton from "./HeaderButton";

import {
  DEFAULT_LANGUAGE,
  getLanguageOption,
  isLanguage,
  Language,
  languageOptions,
} from "src/utils/language";
import { setLanguage } from "src/utils/localStorage";

export default function LanguageSelect() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { t, i18n } = useTranslation();
  const language: Language = isLanguage(i18n.language)
    ? i18n.language
    : DEFAULT_LANGUAGE;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (selected: Language) => {
    void i18n.changeLanguage(selected);
    setLanguage(selected);
    setAnchorEl(null);
  };

  const currentOption = getLanguageOption(language);

  return (
    <>
      <HeaderButton
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("language.label", { language: currentOption.label })}
      >
        {currentOption.flag}
      </HeaderButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- not a DOM attribute
        autoFocus={false}
        disableScrollLock={true}
      >
        {languageOptions.map((option) => (
          <MenuItem
            key={option.code}
            selected={option.code === language}
            onClick={() => handleSelect(option.code)}
            aria-label={option.label}
          >
            {option.flag}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
