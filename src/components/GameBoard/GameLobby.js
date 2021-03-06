import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { selectAgency, selectMaster } from "../../store/UserThunks";
import { StartGame } from "../../store/GameThunks";
import { connect } from "react-redux";
import InviteFriendForm from "./InviteFriendForm";

import { canStartGame, turnTracker } from "../../utils";

const GameLobby = props => {
  const {
    allPlayers,
    gameId,
    StartGame,
    selectAgency,
    Games,
    selectMaster,
    dealCards,
    uid,
    displayName,
  } = props;

  const isFetching = Games !== undefined;
  const game = isFetching ? Games[gameId] : null;

  const [inviteFriend, setInviteFriend] = useState(false);
  const [spyMasters, setSpyMasters] = useState({
    red: "",
    blue: ""
  });

  const { addToast } = useToasts();

  useEffect(() => {
    const spyMasterSelected = allPlayers.reduce(
      (acc, player) => {
        if (player.isSpyMaster) {
          acc[player.Team] = player.DisplayName;
        }
        return acc;
      },
      { red: "", blue: "" }
    );
    setSpyMasters(spyMasterSelected);
  }, [allPlayers]);

  //Choosing SpyMaster
  const spyMasterHandler = async agency => {
    if (spyMasters[agency] === "") {
      selectAgencyHandler(agency);
      try {
        const err = await selectMaster(agency, gameId, game, uid,displayName);
        if (err !== undefined) {
          addToast(
            "Sorry, we couldn't make you spymaster right now. Try again",
            {
              appearance: "warning",
              autoDismiss: true
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      addToast(`${spyMasters[agency]} is already ${agency}'s Spy Master`, {
        appearance: "warning",
        autoDismiss: true
      });
    }
  };

  /// Choosing Sides
  const selectAgencyHandler = async selectedAgency => {
    try {
      const err = await selectAgency(selectedAgency, gameId, game, uid,displayName);
      if (err !== undefined) {
        addToast("Sorry, we couldn't select your side right now. Try again", {
          appearance: "warning",
          autoDismiss: true
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const readyHandler = async () => {
    try {
      const err = await StartGame(gameId, turnTracker.startWithTeam());
      dealCards();
      if (err !== undefined) {
        addToast("Sorry, failed to start game. Please try again", {
          appearance: "warning",
          autoDismiss: true
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="gameLobby-container">
        <p className="lobby-header-text">Choose your Side</p>
        <div className="team-select-wrapper">
          <div className="blue-team-wrapper">
            <div
              onClick={() => spyMasterHandler("blue")}
              className="spyMaster-check-wrapper"
            >
              {spyMasters.blue === "" ? (
                <p className="blue-spyMaster-text"> Click to be Spy Master</p>
              ) : (
                <p className="blue-spyMaster-text blue-spyMaster-selected">{`Spy Master is ${spyMasters.blue}`}</p>
              )}
            </div>
            <img
              onClick={() => selectAgencyHandler("blue")}
              className="agent-image-blue"
              src={process.env.PUBLIC_URL + "/images/agent-blue-1.png"}
              alt="blue agent male"
            />
            <img
              onClick={() => selectAgencyHandler("blue")}
              className="agent-image-blue deep-cover-agent"
              src={process.env.PUBLIC_URL + "/images/agent-blue-2.png"}
              alt="blue agent female"
            />
          </div>
          <div className="red-team-wrapper">
            <div
              onClick={() => spyMasterHandler("red")}
              className="spyMaster-check-wrapper"
            >
              {spyMasters.red === "" ? (
                <p className="red-spyMaster-text"> Click to be Spy Master</p>
              ) : (
                <p className="red-spyMaster-text red-spyMaster-selected">{`Spy Master is ${spyMasters.red}`}</p>
              )}
            </div>
            <img
              onClick={() => selectAgencyHandler("red")}
              className="agent-image-red deep-cover-agent"
              src={process.env.PUBLIC_URL + "/images/agent-red-1.jpeg"}
              alt="red agent male"
            />
            <img
              onClick={() => selectAgencyHandler("red")}
              className="agent-image-red"
              src={process.env.PUBLIC_URL + "/images/agent-red-2.png"}
              alt="red agent female"
            />
          </div>
        </div>
        <button
          disabled={canStartGame(allPlayers)}
          onClick={readyHandler}
          className="ready-btn btn  waves-effect waves-dark teal darken-4"
        >
          ready to start
        </button>
        <button
          onClick={() => setInviteFriend(true)}
          className="ready-btn btn  waves-effect waves-dark teal darken-4"
        >
          Invite Friend
        </button>
      </div>
      {inviteFriend ? (
        <InviteFriendForm
          roomNumber={gameId}
          setInviteFriend={setInviteFriend}
        />
      ) : null}
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    StartGame: (id, startTeam) => dispatch(StartGame(id, startTeam)),
    selectAgency: (color, gameId, game, uid,displayName) =>
      dispatch(selectAgency(color, gameId, game, uid,displayName)),
    selectMaster: (color, gameId, game, uid,displayName) =>
      dispatch(selectMaster(color, gameId, game, uid,displayName))
  };
};

export default connect(null, mapDispatchToProps)(GameLobby);
