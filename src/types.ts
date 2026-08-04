import { AspectName, SignName } from "./constants";

// mirrors ephemerides/src/types.ts
export interface JsonDate {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface GeoCoordinates {
  lat: number;
  lon: number;
}

export type CelestialObjectType = "body" | "point" | "house";

// A common interface for `BodyObject`, `PointObject` and `HouseObject` from ephemerides
export interface CelestialObject {
  name: string;
  type?: CelestialObjectType;
  houseNumber?: number;
}

// mirrors ephemerides/src/types.ts (`bodyId`, `pointName` are omitted)
export interface FormattedObjectPosition extends CelestialObject {
  type: CelestialObjectType;
  position: number;
  sign: number;
  degrees: number;
  minutes: number;
  seconds: number;
  speed?: number;
  retrograde?: boolean;
}

// replace the backend's numeric `sign` with the sign name
export interface PlanetPosition extends Omit<FormattedObjectPosition, "sign"> {
  sign: SignName;
}

// mirrors ephemerides/src/types.ts AspectWithPositions<FormattedObjectPosition>
export interface AspectWithPositions {
  name: AspectName;
  orb: number;
  orbSpeed?: number;
  pos1: FormattedObjectPosition;
  pos2: FormattedObjectPosition;
}

// A saved entry (from localStorage) with additional data
export interface SavedDate extends JsonDate {
  name: string;
  customCoordinates: boolean;
  cityId?: number;
  lat: number;
  lon: number;
}
