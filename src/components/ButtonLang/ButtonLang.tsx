import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import styles from "./ButtonLang.module.css";

export default function ButtonLang() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setLang(event.target.value as string);
  };

  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      <div
        style={{
          borderColor: "white !important",
          height: "50px",
          margin: "0"
        }}
      >
        <div className={styles.body}>
          <FormControl
          >
            <Select
              displayEmpty
              value={lang}
              onChange={handleChange}
              sx={{
                minwidth: 200,
                height: 40,
                padding: "0",
                margin: "0"
              }}
            >
              <MenuItem value="" onClick={() => changeLanguage("ru")}>
                Russian
              </MenuItem>
              <MenuItem onClick={() => changeLanguage("en")} value={10}>
                English
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );
}
