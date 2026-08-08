// Bodies and signs are absent on purpose: the API already names them in English,
// so the `defaultValue` at each call site is the correct English string.
const en = {
  translation: {
    house: "House {{number}}",
    language: {
      label: "Language: {{language}}",
    },
    menu: {
      transits: "Transits",
      transitsTable: "Transits - table",
      currentPlanets: "Current planets",
      natalPlanets: "Natal planets",
      savedData: "Saved records",
    },
    title: {
      planets: "Planets",
      notFound: "Page not found",
    },
    common: {
      selectRecord: "Select record:",
    },
    currentPlanets: {
      title: "Current planets",
    },
    natalPlanets: {
      title: "Natal planets",
    },
    transits: {
      transiting: "Transiting",
      natal: "Natal",
      year: "yr",
      month: "mo.",
      today: "today",
      days_one: "{{value}} day",
      days_other: "{{value}} days",
      weeks: "{{value}} wk",
      months: "{{value}} mo",
    },
    aspectTable: {
      aspectOrb: "aspect/orb",
    },
    savedData: {
      title: "Saved records",
      add: "+ Add record",
      edit: "Edit",
      delete: "Delete",
    },
    savedDataDetail: {
      newRecord: "New record",
      editRecord: "Edit record",
      name: "Name:",
      day: "Day:",
      month: "Month:",
      year: "Year:",
      hour: "Hour",
      hourFormat: "(24h format)",
      minute: "Minute:",
      birthplace: "Birthplace:",
      customCoordinates: "Enter custom coordinates",
      latitude: "Latitude:",
      longitude: "Longitude:",
      save: "Save",
      cancel: "Cancel",
      timeZoneNote:
        "For now the birthplace is assumed to be in the CET/CEST time zone (Central Europe). We plan to lift this limitation.",
      localTimeNote:
        "Enter the local CET/CEST time (whichever was in effect at the time of birth).",
    },
    notFound: {
      message: "Page not found",
    },
  },
};

export default en;
