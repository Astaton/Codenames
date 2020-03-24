import {google} from "../fireStore"

///Initial State
const initialState = {
  profile: {},
  player:{}
};

///action
const GOT_PROFILE = "GOT_PROFILE";
const SET_PLAYER = "SET_PLAYER";

/// action creator
const gotProfile = profile => ({
  type: GOT_PROFILE,
  profile,
});

const setPlayer = (name, team,master) => ({
  type: SET_PLAYER,
  name, team, master,
});

/// Thunk
// export const getProfile = () => async dispatch => {
//   try {
//     // db.collection("Users")
//     // .where("Name", "==", "AAron")
//     // .get()
//     // .then(snapshot => {
//     //   snapshot.docs.forEach(doc => {
//     //     dispatch(gotProfile(doc.data()))
//     //   });
//     // })
//     console.log(" Get Profile Thunk")
//   } catch (error) {
//     console.error(error);
//   }
// };

export const createProfile = (name,email,password) => async (dispatch, getState, {getFirebase, getFirestore}) => {
  try {
    const firebase = getFirebase()
    const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await user.updateProfile({
      displayName:name
    })

    const db = getFirestore()

    db.collection("Users").doc(user.uid).set({
      Win:100,
      Loss:70
    })
  }
    catch (error) {
    console.error(error);
  }
};

export const googleProfile = () => async (dispatch, getState, {getFirebase,getFirestore}) => {
  try {
    const firebase = getFirebase()
    const {user} = await firebase.auth().signInWithPopup(google)

    const firestore = getFirestore()
    await firestore.collection("Users").doc(user.uid).set({
      Win:2000,
      Loss:10
    })
    }
  catch (error) {
    console.error(error);
  }
};

export const updateProfile = (id,name,email) => async (dispatch, getState, {getFirebase,getFirestore}) => {
  try {
    console.log("before", firebase.auth().currentUser)
    const firebase = getFirebase()
    const user = firebase.auth().currentUser
    user.updateProfile({
      displayName: name,
    })
    user.updateEmail(email)
    console.log("after", firebase.auth().currentUser)
    }
  catch (error) {
    console.error(error);
  }
}

export const settingPlayer = (name,team,master,gamessessionid) => async dispatch => {
  try {
    // db.collection("Games")
    //   .doc(`${gamessessionid}`)
    //   .update({
    //     UsersInRoom: `${name}`:{
    //       displayName: name,
    //       Team: team,
    //       isSpyMaster: master
    //     },
    //   });
    // dispatch(setPlayer(name, team,master));
    console.log("SettingPlayer Thunk")
  }
  catch (error) {
    console.error(error);
  }
};


///Reducer

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_PROFILE:
      return { ...state, profile: action.profile };
    case SET_PLAYER:
      return {...state, player: {name:action.name, team:action.team, Spymaster:action.master}}
    default:
      return state;
  }
}