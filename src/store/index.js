import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import {
  getFirestore,
  firestoreReducer
} from "redux-firestore";
import {
  getFirebase,
  firebaseReducer
} from "react-redux-firebase";
import cards from "./cards";
import turns from "./turns";
import chat from "./chat";
import user from "./user";

const initalState = {}

const reducer = combineReducers({
  cards,
  turns,
  chat,
  user,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ getFirebase, getFirestore }),
    createLogger({ collapsed: true })
  )
);
const store = createStore(reducer,initalState,middleware);

export default store;
