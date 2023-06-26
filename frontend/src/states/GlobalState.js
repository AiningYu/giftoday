// This file contains functions to get and set the global state of the application

//--------------------- User ID -----------------------------//
export async function setUserID(userID) {
  try {
    await localStorage.setItem("userID", userID);
    return true;
  } catch (err) {
    console.log("Error setting userID:", err);
    return false;
  }
}

export function getUserID() {
  return localStorage.getItem("userID");
}
export async function removeUserID() {
  try {
    await localStorage.removeItem("userID");
    return true;
  } catch (err) {
    console.log("Error removing userID:", err);
    return false;
  }
}

//--------------------- LoggedInDate -----------------------------//
export async function setLoggedInDate() {
  const loggedInDate = new Date();
  try {
    await localStorage.setItem("loggedInDate", loggedInDate);
    return true;
  } catch (err) {
    console.log("Error setting loggedInDate:", err);
    return false;
  }
}

export function getLoggedInDate() {
  return localStorage.getItem("loggedInDate");
}

//--------------------- Selected Date -----------------------------//
export async function setSelectedDate(date) {
  const selectedDate = new Date(date);
  try {
    await localStorage.setItem("selectedDate", selectedDate);
    return true;
  } catch (err) {
    console.log("Error setting selectedDate:", err);
    return false;
  }
}

export function getSelectedDate() {
  return localStorage.getItem("selectedDate");
}
