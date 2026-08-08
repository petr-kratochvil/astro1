import { SavedDate } from "../types";
import { isLanguage, Language } from "./language";

const USER_OBJECT_KEY = "ASTRO_USER_OBJECT";
const defaultUserObject: UserObject = {};

interface UserObject {
  savedData?: (SavedDate | null | undefined)[];
  lastNameNumber?: number;
  refererOfEditPage?: string;
  language?: Language;
}

function isUserObject(x: unknown): x is UserObject {
  return typeof x === "object" && x !== null;
}

function isSavedDate(x: unknown): x is SavedDate {
  return typeof x === "object" && x !== null;
}

export function getUserObject(): UserObject {
  try {
    const raw = localStorage.getItem(USER_OBJECT_KEY);
    if (!raw) return { ...defaultUserObject };
    const parsed: unknown = JSON.parse(raw);
    return isUserObject(parsed) ? parsed : { ...defaultUserObject };
  } catch {
    return { ...defaultUserObject };
  }
}

export function setUserObject(userObject: UserObject): void {
  localStorage.setItem(USER_OBJECT_KEY, JSON.stringify(userObject));
}

export function getSavedData(): SavedDate[] {
  return (getUserObject().savedData || []).filter(isSavedDate);
}

export function getNextNameNumber(): number {
  return (getUserObject().lastNameNumber || 0) + 1;
}

export function setlastNameNumber(nameNumber: number): void {
  const userObject = getUserObject();
  setUserObject({ ...userObject, lastNameNumber: nameNumber });
}

export function getRefererOfEditPage(): string {
  return getUserObject().refererOfEditPage || "/saved-data";
}

export function setRefererOfEditPage(page: string): void {
  const userObject = getUserObject();
  setUserObject({ ...userObject, refererOfEditPage: page });
}

export function getLanguage(): Language | undefined {
  const language = getUserObject().language;
  return isLanguage(language) ? language : undefined;
}

export function setLanguage(language: Language): void {
  const userObject = getUserObject();
  setUserObject({ ...userObject, language });
}

export function setBaseDateJson(index: number, baseDateJson: SavedDate): void {
  const userObject = getUserObject();
  const savedData = getSavedData();
  savedData[index] = baseDateJson;
  // Condense the sparse array on save
  const filtered = savedData.filter(isSavedDate);
  setUserObject({ ...userObject, savedData: filtered });
}

export function getBaseDateJson(index: number): SavedDate | undefined {
  return getSavedData()[index];
}

// TODO: deal with sparse arrays - avoid growing index for new data
export function deleteBaseDate(index: number): void {
  const userObject = getUserObject();
  const savedData = getSavedData();
  savedData.splice(index, 1);
  setUserObject({ ...userObject, savedData });
}
