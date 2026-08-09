import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  getBaseDateJson,
  getNextNameNumber,
  getRefererOfEditPage,
  setBaseDateJson,
  setlastNameNumber,
} from "src/utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { fromUTC } from "src/utils/timeZones";
import { SavedDate } from "src/types";

interface City {
  name: string;
  lat: number;
  lon: number;
  id: number;
}

type FormDataValues = {
  name: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  minutes: string;
};

export default function SavedDataDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { index } = useParams();
  const numericIndex = Number(index);
  const baseDateJson = getBaseDateJson(numericIndex);

  const cities: City[] = [
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

  const defaultCity: City = {
    name: "Praha",
    lat: 50.075,
    lon: 14.437,
    id: 554782,
  };

  const birthplaceLabelId = React.useId();

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
    const data = Object.fromEntries(formData.entries()) as FormDataValues;
    const year = parseInt(data.year);
    const baseDate = new Date(
      year,
      parseInt(data.month) - 1,
      parseInt(data.day),
      parseInt(data.hour) || 12,
      parseInt(data.minutes) || 0
    );
    // Date.UTC maps years 0-99 onto 1900-1999
    // Keep any month/day overflow that Date.UTC already made
    if (year >= 0 && year < 100) {
      baseDate.setFullYear(baseDate.getFullYear() - 1900);
    }
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

  let heading = t("savedDataDetail.newRecord");

  let baseDate = null;
  // baseDateJson is in UTC
  if (baseDateJson) {
    heading = t("savedDataDetail.editRecord");
    baseDate = fromUTC(baseDateJson);
  }

  return (
    <>
      <h1 style={{ color: "slateblue", textAlign: "center" }}>{heading}</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          m: "10px auto",
          p: 2.5,
          width: "340px",
          maxWidth: "calc(100% - 20px)",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <TextField
          label={t("savedDataDetail.name")}
          name="name"
          defaultValue={baseDateJson?.name}
          size="small"
          fullWidth
        />

        <Stack direction="row" spacing={1.5}>
          <TextField
            label={t("savedDataDetail.day")}
            name="day"
            type="number"
            required
            size="small"
            fullWidth
            defaultValue={baseDate?.getDate()}
            slotProps={{ htmlInput: { min: 1, max: 31, inputMode: "numeric" } }}
          />
          <TextField
            label={t("savedDataDetail.month")}
            name="month"
            type="number"
            required
            size="small"
            fullWidth
            defaultValue={baseDate ? baseDate.getMonth() + 1 : ""}
            slotProps={{ htmlInput: { min: 1, max: 12, inputMode: "numeric" } }}
          />
          <TextField
            label={t("savedDataDetail.year")}
            name="year"
            type="number"
            required
            size="small"
            fullWidth
            defaultValue={baseDate?.getFullYear()}
            slotProps={{
              htmlInput: { min: 1900, max: 2100, inputMode: "numeric" },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <TextField
            label={t("savedDataDetail.hour")}
            name="hour"
            type="number"
            size="small"
            fullWidth
            defaultValue={baseDate?.getHours()}
            helperText={t("savedDataDetail.hourFormat")}
            slotProps={{ htmlInput: { min: 0, max: 23, inputMode: "numeric" } }}
          />
          <TextField
            label={t("savedDataDetail.minute")}
            name="minutes"
            type="number"
            size="small"
            fullWidth
            defaultValue={baseDate?.getMinutes()}
            slotProps={{ htmlInput: { min: 0, max: 59, inputMode: "numeric" } }}
          />
        </Stack>

        {!customCoordinates && (
          <FormControl size="small" fullWidth>
            <InputLabel id={birthplaceLabelId}>
              {t("savedDataDetail.birthplace")}
            </InputLabel>
            <Select
              labelId={birthplaceLabelId}
              label={t("savedDataDetail.birthplace")}
              name="birthplace"
              value={selectedCityId}
              onChange={(event) => {
                const cityId = Number(event.target.value);
                const city = cities.find((city) => city.id === cityId);
                setSelectedCityId(cityId);
                if (city) {
                  setLat(city.lat);
                  setLon(city.lon);
                }
              }}
              MenuProps={{ disableScrollLock: true }}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControlLabel
          control={
            <Checkbox
              name="customCoordinates"
              checked={customCoordinates}
              onChange={(e) => {
                setCustomCoordinates(e.target.checked);
                if (!e.target.checked) {
                  const city = cities.find(
                    (city) => city.id === selectedCityId
                  );
                  if (city) {
                    setLat(city.lat);
                    setLon(city.lon);
                  }
                }
              }}
            />
          }
          label={t("savedDataDetail.customCoordinates")}
          slotProps={{ typography: { variant: "body2" } }}
        />

        {customCoordinates && (
          <Stack direction="row" spacing={1.5}>
            <TextField
              label={t("savedDataDetail.latitude")}
              name="latitude"
              type="number"
              size="small"
              fullWidth
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: -90,
                  max: 90,
                  step: "any",
                  inputMode: "decimal",
                },
              }}
            />
            <TextField
              label={t("savedDataDetail.longitude")}
              name="longitude"
              type="number"
              size="small"
              fullWidth
              value={lon}
              onChange={(e) => setLon(parseFloat(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: -180,
                  max: 180,
                  step: "any",
                  inputMode: "decimal",
                },
              }}
            />
          </Stack>
        )}

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => navigate(getRefererOfEditPage())}
          >
            {t("savedDataDetail.cancel")}
          </Button>
          <Button type="submit" variant="contained">
            {t("savedDataDetail.save")}
          </Button>
        </Stack>
      </Box>
      <div style={{ margin: "0 auto", width: "300px" }}>
        <p>{t("savedDataDetail.timeZoneNote")}</p>
        <p>{t("savedDataDetail.localTimeNote")}</p>
      </div>
    </>
  );
}
