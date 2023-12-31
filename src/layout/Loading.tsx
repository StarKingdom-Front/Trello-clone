import { CircularProgress, Stack } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div className="_container">
      <div
        style={{
          width: "100%",
          minHeight: 'calc(100vh - 145px)',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
          <CircularProgress color="success" />
        </Stack>
        <h1 style={{ marginTop: "30px" }}>{t("Wait page loading...")}</h1>
      </div>
    </div>
  );
}
