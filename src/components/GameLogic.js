import React, { useState, useEffect } from "react";
import PlayerGameBoard from "./GameBoard";

import { dealCards, dummyData, getResultImage, turnTracker } from "../utils";

import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'

const GameLogic = (props) => {
  //Dummy data start)
  const {Games,User,history} = props
  const Gameid = props.match.params.id
  const {
    // allPlayers,
    chatLog,
    // displayName,
    // gameStatus,
    // spyMaster,
    // teamColor
  } = dummyData;
  //End dummy data
  const isFetching = (Games === undefined || Games[Gameid] === undefined)
  const displayName = User.displayName



  const game = isFetching ? null : Games[Gameid]

  const allPlayers = isFetching ? [] : Object.values(game.UsersInRoom)

  const gameStatus = isFetching ? null : game.GameStarted
  const teamColor = isFetching ? null : game.UsersInRoom[User.uid]?.Team
  const  spyMaster = isFetching ? null : game.UsersInRoom[User.uid]?.isSpyMaster
  ///////////////


  const [spyDeck, setSpyDeck] = useState([]);
  const [spyMasterDeck, setSpyMasterDeck] = useState([]);
  const [pickResult, setPickResult] = useState();

  const cardPick = deck => {
    return (cardPicked, currentTeam) => {
      const rightCard = currentTeam;
      const wrongCard = currentTeam === "red" ? "blue" : "red";
      const neutralCard = "white";
      const fatalCard = "black";
      switch (deck[cardPicked].color) {
        case rightCard:
          setPickResult("good");
          return {
            outcome: "good",
            image: getResultImage(rightCard)
          };
        case neutralCard:
          setPickResult("neutral");
          return {
            outcome: "neutral",
            image: getResultImage(neutralCard)
          };
        case wrongCard:
          setPickResult("bad");
          return {
            outcome: "bad",
            image: getResultImage(wrongCard)
          };
        case fatalCard:
          setPickResult("fatal");
          return {
            outcome: "fatal",
            image: getResultImage(fatalCard)
          };
        default:
          console.error(
            `Invalid input cardPicked: ${cardPicked}, currentTeam: ${currentTeam}, deck: `,
            deck
          );
      }
    };
  };

  const makeSpyAndSpyMasterDecks = deck => {
    const spy = deck.map(({ word, flipped }) => ({ word, flipped }));

    setSpyMasterDeck(deck);
    setSpyDeck(spy);
  };

  useEffect(() => {
    console.log("pickResult is: ", pickResult);
  }, [pickResult]);

  useEffect(() => {
    let cardsFromDealer = dealCards();
    makeSpyAndSpyMasterDecks(cardsFromDealer);
  }, []);

  return (
    <>
      {spyMaster ? (
        <PlayerGameBoard
          gameId = {Gameid}
          history = {history}
          allPlayers={allPlayers}
          chatLog={chatLog}
          deck={spyMasterDeck}
          displayName={displayName}
          gameStatus={gameStatus}
          spyMaster={spyMaster}
          teamColor={teamColor}
        />
      ) : (
        <PlayerGameBoard
          gameId = {Gameid}
          history = {history}
          allPlayers={allPlayers}
          chatLog={chatLog}
          deck={spyDeck}
          displayName={displayName}
          gameStatus={gameStatus}
          setPickResult={setPickResult}
          playersPick={cardPick(spyMasterDeck)}
          spyMaster={spyMaster}
          teamColor={teamColor}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    Games: state.firestore.data.Games,
    User: state.firebase.auth
  }
}

export default compose(
  firestoreConnect([
    {
      collection: "Games"
    }
  ]),
  connect(mapStateToProps)
)(GameLogic)
