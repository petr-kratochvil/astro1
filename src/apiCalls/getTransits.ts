import axios from "axios";
import constants from "../constants";
import { AspectWithPositions, GeoCoordinates, JsonDate } from "../types";

export function getTransits(
  baseDateJson: JsonDate,
  transitDate: Date,
  baseDateCoordinates?: GeoCoordinates
): Promise<AspectWithPositions[]> {
  const transitDateJson: JsonDate = {
    year: transitDate.getUTCFullYear(),
    month: transitDate.getUTCMonth() + 1,
    day: transitDate.getUTCDate(),
    hour: transitDate.getUTCHours() + transitDate.getUTCMinutes() / 60,
  };
  return axios
    .post<AspectWithPositions[]>(`${constants.ephemeridesApiBase}/transits`, {
      baseDate: baseDateJson,
      transitDate: transitDateJson,
      baseDateCoordinates,
    })
    .then((response) =>
      response.data.filter(
        (d) =>
          !["Moon", "Mercury"].includes(d.pos1.name) &&
          !["vertex"].includes(d.pos2.name) &&
          !["quincunx"].includes(d.name)
        // && planetWeight(d.pos1.name) >= planetWeight(d.pos2.name)
      )
    );
}
