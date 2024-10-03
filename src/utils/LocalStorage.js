const USER_OBJECT_KEY = "ASTRO_USER_OBJECT";

export function getUserObject() {
  try {
    return JSON.parse(localStorage.getItem(USER_OBJECT_KEY)) || {};
  } catch (e) {
    return {};
  }
}

export function setUserObject(userObject) {
  localStorage.setItem(USER_OBJECT_KEY, JSON.stringify(userObject));
}

export function getSavedData() {
  return getUserObject().savedData || [];
}

export function setBaseDateJson(index, baseDateJson) {
  const userObject = getUserObject();
  const savedData = getSavedData();
  savedData[index] = baseDateJson;
  setUserObject({...userObject, savedData});
}

export function getBaseDateJson(index) {
  return getSavedData()[index];
}

// TODO: deal with sparse arrays - avoid growing index for new data
export function deleteBaseDate(index) {
  setBaseDateJson(index, undefined);
}