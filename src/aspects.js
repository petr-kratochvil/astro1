import { signPositions } from "./constants"

const degPosition = (planet) => {
  return signPositions[planet.sign] + planet.degrees +
    (planet.minutes ?? 0) / 60 + (planet.seconds ?? 0) / 3600;
}

const orb = {
  conjunction: 10,
  opposition: 8,
  square: 5,
  trine: 5,
  sextile: 3
}

export const getAspects = (chart1, chart2) => {
  const aspects = [];
  for (let i = 0; i < chart1.length; i++) {
    for (let j = 0; j < chart2.length; j++) {
      const diff = Math.abs(degPosition(chart1[i]) - degPosition(chart2[j]));
      const conOrb = Math.abs(diff);
      if (conOrb < orb.conjunction) {
        aspects.push({
          aspect: 'Conjunction',
          orb: conOrb,
          planet1: chart1[i],
          planet2: chart2[j],
        })
      }
      const opOrb = Math.abs(diff - 180);
      if (opOrb < orb.opposition) {
        aspects.push({
          aspect: 'Opposition',
          orb: opOrb,
          planet1: chart1[i],
          planet2: chart2[j],
        })
      }
      const sqOrb = Math.min(Math.abs(diff - 90), Math.abs(diff - 270));
      if (sqOrb < orb.square) {
        aspects.push({
          aspect: 'Square',
          orb: sqOrb,
          planet1: chart1[i],
          planet2: chart2[j],
        })
      }
      const trOrb = Math.min(Math.abs(diff - 120), Math.abs(diff - 240));
      if (trOrb < orb.trine) {
        aspects.push({
          aspect: 'Trine',
          orb: trOrb,
          planet1: chart1[i],
          planet2: chart2[j],
        })
      }
      const sexOrb = Math.min(Math.abs(diff - 60), Math.abs(diff - 300));
      if (sexOrb < orb.sextile) {
        aspects.push({
          aspect: 'Sextile',
          orb: sexOrb,
          planet1: chart1[i],
          planet2: chart2[j],
        })
      }
    }
  }
  return aspects;
}