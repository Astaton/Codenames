import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import EndGameScreen from "../EndGameScreen";
import Notification from "./Notification";

const PlayArea = ({
  deck,
  playersPick,
  setPickResult,
  spyMaster,
  gameId,
  teamColor,
  dealSpyAndSpymasterDecks,
  blueScore,
  GameResult,
  redScore,
  GameOver,
  currentTurn,
  hintWord,
  hintCount
}) => {
  const [firstCard, setFirstCard] = useState(1);
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState("The game has started");

  useEffect(() => {
    if (hintWord !== undefined) {
      setMessage(`The hint is ${hintWord}`);
      setVisibility(true);
    }
  }, [hintWord]);

  useEffect(() => {
    dealSpyAndSpymasterDecks();
    if (!deck.length) {
      setFirstCard(firstCard + 1);
    } else if (typeof firstCard === "number") {
      setFirstCard(deck[0].word);
    } else if (firstCard !== deck[0].word) {
      setFirstCard(deck[0].word);
    }
  }, [firstCard]);

  return (
    <>
      {GameOver ? (
        <EndGameScreen gameId={gameId} GameResult={GameResult} />
      ) : (
        <div className="playArea-container">
          {visibility ? (
            <Notification message={message} setVisibility={setVisibility} />
          ) : null}
          <div className="scoreContainer">
            <p>
              Blue Score: {blueScore} Red Score: {redScore}
            </p>
          </div>

          <div className="cards-wrapper">
            {deck.map((card, index) => (
              <PlayerCard
                teamColor={teamColor}
                card={card}
                image={card.image}
                index={index}
                key={card.word}
                playersPick={playersPick}
                setPickResult={setPickResult}
                spyMaster={spyMaster}
                currentTurn={currentTurn}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PlayArea;
