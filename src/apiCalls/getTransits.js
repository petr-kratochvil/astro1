import React from "react";
import axios from "axios";
import constants from "../constants";

export function getTransits(baseDate, transitDate) {
  const transitDateJson = {
    year: transitDate.getUTCFullYear(),
    month: transitDate.getUTCMonth() + 1,
    day: transitDate.getUTCDate(),
    hour: transitDate.getUTCHours() + transitDate.getUTCMinutes() / 60,
  };
  return axios
    .post(`${constants.ephemeridesApiBase}/transits`, {
      baseDate,
      transitDate: transitDateJson,
    })
    .then((response) => 
      response.data.filter(
        (d) =>
          !["Moon", "Mercury"].includes(d.pos1.name) &&
          !["vertex"].includes(d.pos2.name) &&
          ![ "quincunx"].includes(d.name)
        // && planetWeight(d.pos1.name) >= planetWeight(d.pos2.name)
      )
    );
}