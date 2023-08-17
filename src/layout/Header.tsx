import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import ButtonLang from "../components/ButtonLang/ButtonLang";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/use-theme";

export default function SearchAppBar() {
  const {theme, setTheme} = useTheme()
  const { t } = useTranslation();

  const handleDark = () => {
    setTheme('dark')
  }

  const handleLight = () => {
    setTheme('light')
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link className="header-none" to="/">
            {t("Trello Board")}
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link to="/">{t("Trello Board")}</Link>
          </Typography>
          <div className='theme__body'>
            <div className="theme__item"
            onClick={handleLight}
            >Light</div>
            <div className="theme__item"
            onClick={handleDark}
            >Dark</div>
          </div>
          <ButtonLang />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
