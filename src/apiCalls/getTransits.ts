import axios from "axios";
import constants from "../constants";
import {
  ApiAspectWithPositions,
  ApiCelestialObjectPosition,
  AspectWithPositions,
  CelestialObjectPosition,
  GeoCoordinates,
  JsonDate,
} from "../types";
import { translateAspectName, translateCelestialObject } from "../utils/translations";

const translatePosition = (
  pos: ApiCelestialObjectPosition
): CelestialObjectPosition => ({
  ...pos,
  nameTranslated: translateCelestialObject(pos),
});

const translateAspect = (
  aspect: ApiAspectWithPositions
): AspectWithPositions => {
  return {
    ...aspect,
    pos1: translatePosition(aspect.pos1),
    pos2: translatePosition(aspect.pos2),
    nameTranslated: translateAspectName(aspect.name),
  };
};

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
    .post<ApiAspectWithPositions[]>(
      `${constants.ephemeridesApiBase}/transits`,
      {
        baseDate: baseDateJson,
        transitDate: transitDateJson,
        baseDateCoordinates,
      }
    )
    .then((response) =>
      response.data
        .filter(
          (d) =>
            !["Moon", "Mercury"].includes(d.pos1.name) &&
            !["vertex"].includes(d.pos2.name) &&
            !["quincunx"].includes(d.name)
          // && planetWeight(d.pos1.name) >= planetWeight(d.pos2.name)
        )
        .map(translateAspect)
    );
}
