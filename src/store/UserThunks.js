import { google } from "../fireStore";

/// Thunk
// Signs user up
export const createProfile = (name, email, password) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {

    if(!name){
      return "The Username field can not be empty"
    }
    const firebase = getFirebase();

    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const firestore = getFirestore();
    await firestore
      .collection("Users")
      .doc(user.uid)
      .set({
        displayName: name,
        Win: 0,
        Loss: 0
      });
  } catch (error) {
    return error.message;
  }
};

export const LoginProfile = (email, password) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firebase = getFirebase();

    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    return error.message;
  }
};

// Signs Google User
export const googleProfile = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firebase = getFirebase();
    const { user } = await firebase.auth().signInWithPopup(google);
    const name = await firebase.auth().currentUser.displayName;

    const firestore = getFirestore();
    await firestore
      .collection("Users")
      .doc(user.uid)
      .set({
        displayName: name,
        Win: 0,
        Loss: 0
      });
  } catch (error) {
    return error.message;
  }
};
/// Log Out User
export const logout = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firebase = getFirebase();
    await firebase.auth().signOut();
  } catch (error) {
    return error.message;
  }
};

export const selectAgency = (color, gameId, game, uid,displayName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    // const user = game.UsersInRoom[uid];
    const firestore = getFirestore();
    // if (user.Team === color || (user.isSpyMaster && user.Team !== color)) {
    await firestore
      .collection("Games")
      .doc(gameId)
      .set(
        {
          UsersInRoom: {
            ...game.UsersInRoom,
            [uid]: {
              DisplayName: displayName,
              Team: color,
              isSpyMaster: false
            }
          }
        },
        { merge: true }
      );
    // }
  } catch (error) {
    return error.message;
  }
};

export const selectMaster = (color, gameId, game, uid,displayName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firestore = getFirestore();
    await firestore
      .collection("Games")
      .doc(gameId)
      .set(
        {
          UsersInRoom: {
            ...game.UsersInRoom,
            [uid]: {
              DisplayName: displayName,
              Team: color,
              isSpyMaster: true
            }
          }
        },
        { merge: true }
      );
  } catch (error) {
    return error.message;
  }
};

export const updateWinRecord = userId => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firestore = getFirestore();
    let user = await firestore
      .collection("Users")
      .doc(userId)
      .get();

    await firestore
      .collection("Users")
      .doc(userId)
      .set(
        {
          Win: user.data().Win + 1
        },
        { merge: true }
      );
  } catch (error) {
    return error.message;
  }
};

export const updateLossRecord = userId => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firestore = getFirestore();
    let user = await firestore
      .collection("Users")
      .doc(userId)
      .get();

    await firestore
      .collection("Users")
      .doc(userId)
      .set(
        {
          Loss: user.data().Loss + 1
        },
        { merge: true }
      );
  } catch (error) {
    return error.message;
  }
};
