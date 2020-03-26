import React from 'react'
import {connect} from "react-redux"
import { withRouter } from 'react-router'
import {leaveGame,ReplayGame} from "../store/GameThunks"
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { useToasts } from "react-toast-notifications";

import "../css/EndGameScreen.css";
const result = "bluewin"
const gameId = "7fc3iTEmrbMg15ZqEPP6"

const EndGameScreen =(props) => {
  console.log("End Prop", props)
  const {addToast} = useToasts()
  // const gameId = props.gameId

  const isFetching = props.Games !== undefined
  const game = isFetching ? props.Games[gameId] : null

  let className, message
  switch(result){
    case "bluewin":
      className = "bluewin"
      message = "Blue team has won the game"
      break;
    case "redwin":
      className = "redwin"
      message = "Red team has won the game"
      break;
    case "bluekilled":
      className = "bluekilled"
      message = "Blue team has been assassinated"
      break;
    case "redkilled":
      className = "redkilled"
      message = "Red team has been assassinated"
      break;
    default:
      className = ""
      message = "There was an error, Win-loss records will not be recorded"
  }

  const SameGameRoom = async(e) =>{
    try {
    const err= await props.ReplayGame(gameId,game,props.User)
    if(err === undefined){
      props.history.push(`/play/${gameId}`)
    }
    else{
      addToast("Sorry, we can't reload the Room", {
        appearance: "warning",
        autoDismiss: true
      });
    }
    } catch (error) {
      console.error(error)
    }
  }

  const NewGameRoom = async (e) =>{
    try {
      const err = await props.LeaveGame(gameId,game,props.User)
      if(err === undefined){
        props.history.push("/onSubmit")
      }
      else{
        addToast("Sorry, we having network errors", {
          appearance: "warning",
          autoDismiss: true
        });
      }
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className={`EndGameScreen ${className}`}>
      <div className="EndScreen-message">{message}</div>
      <div className="EndScreen-buttons">
      <button className="title-button" onClick={SameGameRoom}>
        Replay with Same Players
      </button>
      <button className="title-button" onClick={NewGameRoom}>
        Replay with New Players
      </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    Games: state.firestore.data.Games,
    User: state.firebase.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    LeaveGame: (Gameid,game,user) => dispatch(leaveGame(Gameid,game,user)),
    ReplayGame: (Gameid,game,user) =>dispatch(ReplayGame(Gameid,game,user))
  }
}

export default compose(
  firestoreConnect([
    {
      collection: "Games"
    }
  ]),
  connect(mapStateToProps,mapDispatchToProps))(withRouter(EndGameScreen))
