import React from "react";
import {
  getBaseDateJson,
  getNextNameNumber,
  getRefererOfEditPage,
  setBaseDateJson,
  setlastNameNumber,
} from "../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { fromUTC } from "../utils/timeZones";
import { SavedDate } from "../types";

export default function SetBaseDate() {
  const navigate = useNavigate();
  const { index } = useParams();
  const numericIndex = Number(index);
  const baseDateJson = getBaseDateJson(numericIndex);

  const cities = [
    { name: "Praha", lat: 50.075, lon: 14.437, id: 554782 },
    // { name: "Havlíčkův Brod", lat: 49.604, lon: 15.579, id: 568414 },
    { name: "Jihlava", lat: 49.415, lon: 15.595, id: 586846 },
    { name: "Brno", lat: 49.195, lon: 16.606, id: 582786 },
    { name: "Ostrava", lat: 49.821, lon: 18.262, id: 554821 },
    { name: "Plzeň", lat: 49.738, lon: 13.373, id: 554791 },
    { name: "Olomouc", lat: 49.593, lon: 17.25, id: 500496 },
    { name: "Hradec Králové", lat: 50.21, lon: 15.825, id: 569810 },
    { name: "Karlovy Vary", lat: 50.231, lon: 12.872, id: 554961 },
    { name: "Liberec", lat: 50.766, lon: 15.054, id: 563889 },
    { name: "České Budějovice", lat: 48.975, lon: 14.48, id: 544256 },
    { name: "Zlín", lat: 49.224, lon: 17.662, id: 585068 },
    { name: "Ústí nad Labem", lat: 50.661, lon: 14.053, id: 554804 },
    { name: "Pardubice", lat: 50.034, lon: 15.781, id: 555134 },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const options = cities.map((city) => ({ value: city.id, label: city.name }));
  const defaultCity = cities.find((city) => city.name === "Praha") || cities[0];
  const [selectedCityId, setSelectedCityId] = React.useState(
    baseDateJson?.cityId ?? defaultCity.id
  );

  const [lat, setLat] = React.useState(baseDateJson?.lat ?? defaultCity.lat);
  const [lon, setLon] = React.useState(baseDateJson?.lon ?? defaultCity.lon);
  const [customCoordinates, setCustomCoordinates] = React.useState(
    baseDateJson?.customCoordinates ?? false
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // All fields in this form are text/number inputs, never files.
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    const baseDate = new Date(
      parseInt(data.year),
      parseInt(data.month) - 1,
      parseInt(data.day),
      parseInt(data.hour) || 12,
      parseInt(data.minutes) || 0
    );
    // convert baseDate to UTC - the API currently needs UTC time
    // TODO: use proper time zone based on geolocation
    const baseDateJson: SavedDate = {
      name: data.name || `[Datum ${getNextNameNumber()}]`,
      year: baseDate.getUTCFullYear(),
      month: baseDate.getUTCMonth() + 1,
      day: baseDate.getUTCDate(),
      hour: baseDate.getUTCHours() + baseDate.getUTCMinutes() / 60,
      customCoordinates: !!customCoordinates,
      cityId: customCoordinates ? undefined : selectedCityId,
      lat,
      lon,
    };
    if (!data.name) {
      setlastNameNumber(getNextNameNumber());
    }
    setBaseDateJson(numericIndex, baseDateJson);
    navigate(getRefererOfEditPage());
  }

  let heading = "Nový záznam";

  let baseDate = null;
  // baseDateJson is in UTC
  if (baseDateJson) {
    heading = "Upravit záznam";
    baseDate = fromUTC(baseDateJson);
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    padding: "12px 15px",
  };

  const inputStyle: React.CSSProperties = {
    width: "50px",
    position: "absolute",
    left: "200px",
  };

  const geoInputStyle: React.CSSProperties = {
    width: "100px",
    position: "absolute",
    left: "150px",
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
          Jméno:{" "}
          <input
            style={{ ...inputStyle, width: "150px", left: "100px" }}
            type="text"
            name="name"
            defaultValue={baseDateJson?.name}
          />
        </label>

        <label style={labelStyle}>
          Den:{" "}
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
          Měsíc:{" "}
          <input
            style={inputStyle}
            type="number"
            inputMode="numeric"
            min="1"
            max="12"
            required
            name="month"
            defaultValue={baseDate ? baseDate.getMonth() + 1 : ""}
          />
        </label>
        <label style={labelStyle}>
          Rok:{" "}
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
          Hodina <small>(24h formát)</small>:{" "}
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
          Minuta:{" "}
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
        <label style={labelStyle}>
          <span>Místo narození:</span>
          {!customCoordinates && (
            <>
              <select
                style={{
                  width: "110px",
                  left: "150px",
                  position: "absolute",
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  const cityId = Number(e.target.value);
                  const city = cities.find((city) => city.id === cityId);
                  setSelectedCityId(cityId);
                  if (city) {
                    setLat(city.lat);
                    setLon(city.lon);
                  }
                }}
                value={selectedCityId}
                name="birthplace"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </label>
        <label style={{ ...labelStyle, cursor: "pointer" }}>
          <small>Zadat vlastní souřadnice</small>
          <input
            type="checkbox"
            style={{ marginLeft: "10px" }}
            name="customCoordinates"
            checked={customCoordinates}
            onChange={(e) => {
              setCustomCoordinates(e.target.checked);
              if (!e.target.checked) {
                const city = cities.find((city) => city.id === selectedCityId);
                if (city) {
                  setLat(city.lat);
                  setLon(city.lon);
                }
              }
            }}
          />
        </label>
        {customCoordinates && (
          <>
            <label style={labelStyle}>
              <small>Zeměpisná šířka: </small>
              <input
                style={geoInputStyle}
                type="number"
                inputMode="decimal"
                min="-90"
                max="90"
                step="any"
                name="latitude"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
              />
            </label>
            <label style={labelStyle}>
              <small>Zeměpisná délka: </small>
              <input
                style={geoInputStyle}
                type="number"
                inputMode="decimal"
                min="-180"
                max="180"
                step="any"
                name="longitude"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value))}
              />
            </label>
          </>
        )}
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
          onClick={() => navigate(getRefererOfEditPage())}
          style={{ marginLeft: "90px", marginBottom: "20px", width: "120px" }}
        >
          Zrušit
        </button>
      </form>
      <div style={{ margin: "0 auto", width: "300px" }}>
        <p>
          V tuto chvíli je předpokládané místo narození v časovém pásmu SEČ/SELČ
          (střední Evropa). V budoucnu plánujeme odstranit toto omezení.
        </p>
        <p>
          Čas zadávejte místní v ČR (letní nebo zimní, jaký byl aktuální v době
          narození).
        </p>
      </div>
    </>
  );
}
