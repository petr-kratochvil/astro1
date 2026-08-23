import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAppDispatch } from "src/store/hooks";
import { setRefererOfEditPage } from "src/store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import {
  useDeleteBaseDateMutation,
  useGetSavedDataQuery,
} from "src/store/slices/savedDataSlice";
import { apiUTCToDate } from "src/utils/timeZones";

export default function SavedDataList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: savedData = [] } = useGetSavedDataQuery();
  const [deleteBaseDate] = useDeleteBaseDateMutation();

  const savedDataList = savedData.map((item) => {
    const baseDate = apiUTCToDate(item);
    return {
      name: item?.name,
      day: baseDate?.getDate(),
      month: baseDate ? baseDate.getMonth() + 1 : undefined,
      year: baseDate?.getFullYear(),
      hour: baseDate?.getHours().toString().padStart(2, "0"),
      minutes: baseDate?.getMinutes().toString().padStart(2, "0"),
    };
  });

  const itemStyle: React.CSSProperties = {
    border: "1px solid slateblue",
    padding: "15px",
    margin: "20px",
    marginTop: "0px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
  };
  // TODO: convert saved date (UTC) to current zone to display it properly
  // TODO: use proper time zone based on geolocation
  return (
    <>
      <h1 style={{ color: "slateblue", textAlign: "center" }}>
        {t("savedData.title")}
      </h1>
      <div style={{ margin: "0px auto", maxWidth: "500px" }}>
        <Button
          variant="contained"
          sx={{ m: "20px" }}
          onClick={() => {
            dispatch(setRefererOfEditPage("/saved-data"));
            navigate(`${savedDataList.length}`);
          }}
        >
          {t("savedData.add")}
        </Button>
        {savedDataList.map(
          (item, index) =>
            item && (
              <div key={index} style={itemStyle}>
                <div>
                  <div>{item.name}</div>
                  <div style={{ fontSize: "small", marginTop: "10px" }}>
                    {item.day}. {item.month} .{item.year}, {item.hour}:
                    {item.minutes}
                  </div>
                </div>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      dispatch(setRefererOfEditPage("/saved-data"));
                      navigate(`${index}`);
                    }}
                  >
                    {t("savedData.edit")}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => {
                      void deleteBaseDate(index);
                    }}
                  >
                    {t("savedData.delete")}
                  </Button>
                </Stack>
              </div>
            )
        )}
      </div>
    </>
  );
}
