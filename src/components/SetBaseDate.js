import React from "react";
import { getBaseDateJson, getNextNameNumber, setBaseDateJson, setlastNameNumber } from "../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { fromUTC } from "../utils/timeZones";

export default function SetBaseDate() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const baseDate = new Date(
      parseInt(data.year),
      parseInt(data.month) - 1,
      parseInt(data.day),
      parseInt(data.hour) || 0,
      parseInt(data.minutes) || 0
    );
    // convert baseDate to UTC - the API currently needs UTC time
    // TODO: use proper time zone based on geolocation
    const baseDateJson = {
      name: data.name || `[Datum ${getNextNameNumber()}]`,
      year: baseDate.getUTCFullYear(),
      month: baseDate.getUTCMonth() + 1,
      day: baseDate.getUTCDate(),
      hour: baseDate.getUTCHours() + baseDate.getUTCMinutes() / 60,
    };
    if (!data.name) {
      setlastNameNumber(getNextNameNumber());
    }
    setBaseDateJson(index, baseDateJson);
    navigate("/saved-data");
  }

  const { index } = useParams();
  let heading = "Nový záznam";

  let baseDate = null;
  // baseDateJson is in UTC
  const baseDateJson = getBaseDateJson(index);
  if (baseDateJson) {
    heading = "Upravit záznam";
    baseDate = fromUTC(baseDateJson);
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
      <h1 style={{ color: "slateblue", textAlign: "center" }}>{heading}</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "10px auto",
          width: "300px",
          position: "relative",
          border: "1px solid slateblue",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <label style={labelStyle}>
          Name:{" "}
          <input
            style={{ ...inputStyle, width: "150px", left: "100px" }}
            type="text"
            name="name"
            defaultValue={baseDateJson?.name}
          />
        </label>

        <label style={labelStyle}>
          Day:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            required
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
            required
            name="month"
            defaultValue={baseDate?.getMonth() + 1 || ""}
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
            required
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
          style={{
            marginLeft: "90px",
            marginBottom: "20px",
            marginTop: "10px",
            width: "120px",
          }}
        >
          Uložit
        </button>
        <button
          onClick={() => navigate("/saved-data")}
          style={{ marginLeft: "90px", marginBottom: "20px", width: "120px" }}
        >
          Zrušit
        </button>
      </form>
      <div style={{margin: "0 auto", width: "300px"}}>
        <p>
        V tuto chvíli je předpokládané místo narození v České Republice.
        V budoucnu plánujeme odstranit toto omezení.
        </p><p>
        Čas zadávejte místní v ČR (letní nebo zimní).
        </p>
      </div>
    </>
  );
}
