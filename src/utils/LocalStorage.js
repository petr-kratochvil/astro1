const USER_OBJECT_KEY = "ASTRO_USER_OBJECT";

export function getUserObject() {
  try {
    return JSON.parse(localStorage.getItem(USER_OBJECT_KEY));
  } catch (e) {
    return {};
  }
}

export function setUserObject(userObject) {
  localStorage.setItem(USER_OBJECT_KEY, JSON.stringify(userObject));
}

export function setBaseDateJson(baseDateJson) {
  const userObject = { ...getUserObject, baseDateJson: baseDateJson };
  setUserObject(userObject);
}

export function getBaseDateJson() {
  return getUserObject().baseDateJson;
}