import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: '#1976d2',
        color: 'white',
        height: '80px',
      }}
    >
      <h2>{t("My Trello Board")}</h2>
    </div>
  );
}
