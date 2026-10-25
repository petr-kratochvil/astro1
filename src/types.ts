import { AspectName, SignIndex } from "./constants";

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

// A common interface for BodyObject, PointObject and HouseObject from ephemerides
export interface CelestialObject {
  name: string;
  type?: CelestialObjectType;
  houseNumber?: number;
}

// mirrors `CelestialObjectPosition` from ephemerides/src/types.ts
export interface CelestialObjectPosition extends CelestialObject {
  type: CelestialObjectType;
  position: number;
  sign: SignIndex;
  degrees: number;
  minutes: number;
  seconds: number;
  speed?: number;
  retrograde?: boolean;
}

// mirrors `Station` from ephemerides/src/types.ts - a moment when a planet turns
// retrograde (`retrograde: true`) or direct again, and where it stands at the time
export interface Station {
  position: number;
  sign: SignIndex;
  degrees: number;
  minutes: number;
  seconds: number;
  retrograde: boolean;
  date: JsonDate;
}

// mirrors `BodyStations` from ephemerides/src/types.ts
export interface BodyStations extends CelestialObject {
  type: "body";
  previous: Station | null;
  next: Station | null;
}

// mirrors ephemerides/src/types.ts AspectWithPositions<CelestialObjectPosition>
export interface AspectWithPositions {
  name: AspectName;
  orb: number;
  orbSpeed?: number;
  pos1: CelestialObjectPosition;
  pos2: CelestialObjectPosition;
}

export interface SavedDate extends JsonDate {
  name: string;
  customCoordinates: boolean;
  cityId?: number;
  lat: number;
  lon: number;
}
