const cs = {
  translation: {
    celestialObjects: {
      Sun: "Slunce",
      Moon: "Luna",
      Mercury: "Merkur",
      Venus: "Venuše",
      Uranus: "Uran",
      Neptune: "Neptun",
    },
    signs: {
      Aries: "Beran",
      Taurus: "Býk",
      Gemini: "Blíženci",
      Cancer: "Rak",
      Leo: "Lev",
      Virgo: "Panna",
      Libra: "Váhy",
      Scorpio: "Štír",
      Sagittarius: "Střelec",
      Capricorn: "Kozoroh",
      Aquarius: "Vodnář",
      Pisces: "Ryby",
    },
    house: "{{number}}. dům",
    language: {
      label: "Jazyk: {{language}}",
    },
    menu: {
      transits: "Tranzity",
      transitsTable: "Tranzity - tabulka",
      currentPlanets: "Aktuální planety",
      natalPlanets: "Nativní planety",
      savedData: "Uložené záznamy",
    },
    title: {
      planets: "Planety",
      notFound: "Stránka nenalezena",
    },
    common: {
      selectRecord: "Vyberte záznam",
    },
    currentPlanets: {
      title: "Aktuální planety",
    },
    natalPlanets: {
      title: "Nativní planety",
    },
    transits: {
      transiting: "Tranzitující",
      natal: "Nativní",
      year: "rok",
      month: "měs.",
      today: "dnes",
      // `value` is printed, `count` only selects the form
      days_one: "{{value}} den",
      days_few: "{{value}} dny",
      days_many: "{{value}} dne",
      days_other: "{{value}} dní",
      weeks: "{{value}} týd",
      months: "{{value}} měs",
      short_days_one: "{{value}} d",
      short_days_few: "{{value}} d",
      short_days_many: "{{value}} d",
      short_days_other: "{{value}} d",
      short_weeks: "{{value}} T",
      short_months: "{{value}} M",
    },
    aspectTable: {
      aspectOrb: "aspekt/orbis",
    },
    savedData: {
      title: "Uložené záznamy",
      add: "+ Přidat záznam",
      edit: "Upravit",
      delete: "Smazat",
    },
    savedDataDetail: {
      newRecord: "Nový záznam",
      editRecord: "Upravit záznam",
      name: "Jméno",
      day: "Den",
      month: "Měsíc",
      year: "Rok",
      hour: "Hodina",
      hourFormat: "(24h formát)",
      minute: "Minuta",
      birthplace: "Místo narození",
      customCoordinates: "Zadat vlastní souřadnice",
      latitude: "Zeměpisná šířka",
      longitude: "Zeměpisná délka",
      save: "Uložit",
      cancel: "Zrušit",
      timeZoneNote:
        "V tuto chvíli je předpokládané místo narození v časovém pásmu SEČ/SELČ (střední Evropa). V budoucnu plánujeme odstranit toto omezení.",
      localTimeNote:
        "Čas zadávejte místní v ČR (letní nebo zimní, jaký byl aktuální v době narození).",
    },
    notFound: {
      message: "Stránka nenalezena",
    },
  },
};

export default cs;
