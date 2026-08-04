// `JsonDate` mirrors ephemerides/src/types.ts
export interface JsonDate {
  year: number;
  month: number;
  day: number;
  hour: number;
}

// A common interface for `BodyObject`, `PointObject` and `HouseObject` from ephemerides
export interface CelestialObject {
  name: string;
  type?: "body" | "point" | "house";
  houseNumber?: number;
}

// A saved entry (from localStorage) with additional data
export interface SavedDate extends JsonDate {
  name: string;
  customCoordinates: boolean;
  cityId?: number;
  lat: number;
  lon: number;
}
