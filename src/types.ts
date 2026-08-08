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
