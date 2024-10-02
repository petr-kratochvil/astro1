import React from "react";
import { getBaseDateJson, setBaseDateJson } from "../utils/LocalStorage";

export default function SetBaseDate() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const baseDate = new Date(
      parseInt(data.year),
      parseInt(data.month) - 1,
      parseInt(data.day),
      parseInt(data.hour),
      parseInt(data.minutes)
    );
    // convert baseDate to UTC - the API currently needs UTC time
    // TODO: use proper time zone based on geolocation
    const baseDateJson = {
      year: baseDate.getUTCFullYear(),
      month: baseDate.getUTCMonth() + 1,
      day: baseDate.getUTCDate(),
      hour: baseDate.getUTCHours() + baseDate.getUTCMinutes() / 60,
    };
    setBaseDateJson(baseDateJson);
  }

  let baseDate = null;
  const baseDateUTC = getBaseDateJson();
  if (baseDateUTC) {
    const baseDateTimestamp = Date.UTC(
      parseInt(baseDateUTC.year),
      parseInt(baseDateUTC.month) - 1,
      parseInt(baseDateUTC.day),
      Math.floor(parseFloat(baseDateUTC.hour)),
      (parseFloat(baseDateUTC.hour) - Math.floor(parseFloat(baseDateUTC.hour))) * 60
    );
    if (!isNaN(baseDateTimestamp)) {
      baseDate = new Date(baseDateTimestamp);
    }
  }

  const labelStyle = {
    display: "block",
    padding: "15px 15px",
  };

  const inputStyle = {
    width: "50px",
    position: "absolute",
    left: "200px",
  };

  return (
    <>
      <h1 style={{ color: "slateblue", textAlign: "center" }}>Saved data</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "10px auto",
          width: "300px",
          position: "relative",
          border: "1px solid slateblue",
        }}
      >
        <label style={labelStyle}>
          Day:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            name="day"
            defaultValue={baseDate?.getDate()}
          />
        </label>
        <label style={labelStyle}>
          Month:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="1"
            max="12"
            name="month"
            defaultValue={baseDate?.getMonth() + 1 || ''}
          />
        </label>
        <label style={labelStyle}>
          Year:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="1900"
            max="2100"
            name="year"
            defaultValue={baseDate?.getFullYear()}
          />
        </label>
        <label style={labelStyle}>
          Hour <small>(24h format)</small>:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="0"
            max="23"
            name="hour"
            defaultValue={baseDate?.getHours()}
          />
        </label>
        <label style={labelStyle}>
          Minutes:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="0"
            max="59"
            name="minutes"
            defaultValue={baseDate?.getMinutes()}
          />
        </label>
        <hr
          style={{
            margin: "10px 0px",
            borderColor: "slateblue",
            borderBottomStyle: "none",
          }}
        />
        {/* <label style={labelStyle}>
          Latitude:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            name="latitude"
          />
        </label>
        <label style={labelStyle}>
          Longitude:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            name="longitude"
          />
        </label> */}
        <button
          type="submit"
          style={{ marginLeft: "100px", marginBottom: "11px", width: "100px" }}
        >
          Save
        </button>
      </form>
    </>
  );
}
