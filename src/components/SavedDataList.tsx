import React from "react";
import {
  deleteBaseDate,
  getSavedData,
  setRefererOfEditPage,
} from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { useForceUpdate } from "../utils/useForceUpdate";
import { fromUTC } from "../utils/timeZones";

export default function SavedDataList() {
  const navigate = useNavigate();
  const savedDataList = getSavedData().map((item) => {
    const baseDate = fromUTC(item);
    return {
      name: item?.name,
      day: baseDate?.getDate(),
      month: baseDate ? baseDate.getMonth() + 1 : undefined,
      year: baseDate?.getFullYear(),
      hour: baseDate?.getHours().toString().padStart(2, "0"),
      minutes: baseDate?.getMinutes().toString().padStart(2, "0"),
    };
  });

  const forceUpdate = useForceUpdate();

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
        Uložené záznamy
      </h1>
      <div style={{ margin: "0px auto", maxWidth: "500px" }}>
        <button
          style={{ padding: "10px", margin: "20px" }}
          onClick={() => {
            setRefererOfEditPage("/saved-data");
            navigate(`${savedDataList.length}`);
          }}
        >
          + Přidat záznam
        </button>
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
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <button
                    onClick={() => {
                      setRefererOfEditPage("/saved-data");
                      navigate(`${index}`);
                    }}
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => {
                      deleteBaseDate(index);
                      forceUpdate();
                    }}
                  >
                    Smazat
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </>
  );
}
