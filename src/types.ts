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
export interface ApiCelestialObjectPosition extends CelestialObject {
  type: CelestialObjectType;
  position: number;
  sign: SignIndex;
  degrees: number;
  minutes: number;
  seconds: number;
  speed?: number;
  retrograde?: boolean;
}

// client-side only: localized translations
export interface CelestialObjectPosition extends ApiCelestialObjectPosition {
  nameTranslated: string;
}

// mirrors ephemerides/src/types.ts AspectWithPositions<CelestialObjectPosition>
export interface ApiAspectWithPositions {
  name: AspectName;
  orb: number;
  orbSpeed?: number;
  pos1: ApiCelestialObjectPosition;
  pos2: ApiCelestialObjectPosition;
}

// client-side only: localized translations
export interface AspectWithPositions extends Omit<ApiAspectWithPositions, "pos1" | "pos2"> {
  pos1: CelestialObjectPosition;
  pos2: CelestialObjectPosition;
  nameTranslated: string;
}

// A saved entry (from localStorage) with additional data
export interface SavedDate extends JsonDate {
  name: string;
  customCoordinates: boolean;
  cityId?: number;
  lat: number;
  lon: number;
}
