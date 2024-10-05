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
  return (getUserObject().savedData || []).filter(
    (item) => item !== null && item !== undefined
  );
}

export function getNextNameNumber() {
  return (getUserObject().lastNameNumber || 0) + 1;
}

export function setlastNameNumber(nameNumber) {
  const userObject = getUserObject();
  setUserObject({ ...userObject, lastNameNumber: nameNumber });
}

export function setBaseDateJson(index, baseDateJson) {
  const userObject = getUserObject();
  const savedData = getSavedData();
  savedData[index] = baseDateJson;
  // Condense the sparse array on save
  const filtered = savedData.filter(
    (item) => item !== undefined && item !== null
  );
  console.log(filtered);
  setUserObject({ ...userObject, savedData: filtered });
}

export function getBaseDateJson(index) {
  return getSavedData()[index];
}

// TODO: deal with sparse arrays - avoid growing index for new data
export function deleteBaseDate(index) {
  const userObject = getUserObject();
  const savedData = getSavedData();
  savedData.splice(index, 1);
  setUserObject({ ...userObject, savedData });
}
