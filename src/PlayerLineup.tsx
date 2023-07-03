import { useEffect, useRef, useState } from 'react';
import { Player } from './Player';

import Button from "@mui/material/Button";
import { selectPlayers } from './rosterSlice';
import { store } from './store';
import { TOTAL_PLAYERS_ON_FIELD } from './constants';

interface LineupHistory {
  players: Player[],
  maleRatio: number,
  countSinceLastRatioChange: number,
}

const usePlayerLineup = (roster: Player[]) => {
  const [players, setPlayers] = useState<Player[]>(roster);
  const [isFirstLine, setIsFirstLine] = useState(true);
  const [maleRatio, setMaleRatio] = useState(4);
  const lineupHistoryRef = useRef<LineupHistory[]>([]);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [countSinceLastRatioChange, setCountSinceLastRatioChange] = useState(1);

  useEffect(() => {
    const updatedLine = updateLineupFromRoster(players, roster);
    setPlayers(updatedLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

  function rotateLineup() {
    let newLineup = [...players];
    if (viewingHistory) {
      newLineup = updateLineupFromRoster(players, roster);
    }

    let frontPlayers = newLineup;
    if (isFirstLine) {
      setIsFirstLine(false);
    } else {
      // rotate first seven players to back of line
      frontPlayers = newLineup.splice(0, TOTAL_PLAYERS_ON_FIELD);
      newLineup.push(...frontPlayers);
    }

    // Rotate the lineup while maintaining the correct gender ratio on the field
    const guysInLineup = newLineup.filter(player => player.gender === 'male');
    const girlsInLineup = newLineup.filter(player => player.gender === 'female');

    const newFrontPlayers: Player[] = [];

    // get current ratio
    let ratioChangeCount = countSinceLastRatioChange;
    let mRatio = maleRatio;
    if (isFirstLine) {
      ratioChangeCount = 2;
    } else {
      if (ratioChangeCount >= 2) {
        ratioChangeCount = 1;
        mRatio = maleRatio === 4 ? 3 : 4;
      } else {
        ratioChangeCount++;
      }
    }

    // Add additional guys from the lineup
    let guyCount = 0;
    while (guyCount < mRatio && guysInLineup.length > 0) {
      newFrontPlayers.push(guysInLineup.shift() as unknown as Player);
      guyCount++;
    }

    // Add additional girls from the lineup
    let girlCount = 0;
    while (girlCount < (TOTAL_PLAYERS_ON_FIELD - mRatio) && girlsInLineup.length > 0) {
      newFrontPlayers.push(girlsInLineup.shift() as unknown as Player);
      girlCount++;
    }

    // add bench players
    newFrontPlayers.push(...guysInLineup);
    newFrontPlayers.push(...girlsInLineup);

    // Store the previous lineup in history
    lineupHistoryRef.current.push({
      players: [...players],
      maleRatio: mRatio,
      countSinceLastRatioChange: ratioChangeCount,
    });
    // set lineup
    setPlayers(newFrontPlayers);

    setMaleRatio(mRatio);
    setCountSinceLastRatioChange(ratioChangeCount);
  }

  function rotatePreviousLineup() {
    const history = lineupHistoryRef.current;

    if (history.length > 1) {
      const previousLineup = history.pop() as unknown as LineupHistory;
      setViewingHistory(true);
      setPlayers(previousLineup.players);

      // peek as we already popped
      const twoBack = history[history.length - 1];
      setMaleRatio(twoBack.maleRatio);
      setCountSinceLastRatioChange(twoBack.countSinceLastRatioChange);
    }
  }

  function updateLineupFromRoster(originalArray: Player[], modifiedArray: Player[]) {
    // Create a copy of the original array
    const updatedArray = [...originalArray];

    // Iterate through each item in the modified array
    modifiedArray.forEach(modifiedItem => {
      // Check if the modified item exists in the original array
      const index = updatedArray.findIndex(originalItem => originalItem.id === modifiedItem.id);

      if (index === -1) {
        // Item doesn't exist in the original array, so add it
        updatedArray.push(modifiedItem);
      } else {
        // Item exists in the original array, so update it
        updatedArray[index] = modifiedItem;
      }
    });

    // Check for items in the original array that were not present in the modified array
    originalArray.forEach(originalItem => {
      const existsInModifiedArray = modifiedArray.some(modifiedItem => modifiedItem.id === originalItem.id);

      if (!existsInModifiedArray) {
        // Item doesn't exist in the modified array, so remove it
        const index = updatedArray.findIndex(updatedItem => updatedItem.id === originalItem.id);
        updatedArray.splice(index, 1);
      }
    });

    return updatedArray;
  }

  return { players, rotateLineup, rotatePreviousLineup, lineupHistoryRef, maleRatio, countSinceLastRatioChange };
};

const PlayerLineup: React.FC = () => {
  const { players, rotateLineup, rotatePreviousLineup, lineupHistoryRef, maleRatio, countSinceLastRatioChange } = usePlayerLineup(selectPlayers(store.getState()));
  const playersOnField = players.slice(0, TOTAL_PLAYERS_ON_FIELD);
  const guysOnField = playersOnField.filter(player => player.gender === 'male');
  const girlsOnField = playersOnField.filter(player => player.gender === 'female');

  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    rotateLineup();
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted && <Button color="primary" variant="contained" onClick={startGame}>Start Game</Button>}
      {gameStarted &&
        <div>
          <h2>Gender Ratio on the Field</h2>
          <p>Guys: {guysOnField.length}</p>
          <p>Girls: {girlsOnField.length}</p>

          <h2>Players on the Field</h2>
          <h3>Male Players ({guysOnField.length})</h3>
          <ul>
            {guysOnField.map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>
          <h3>Female Players ({girlsOnField.length})</h3>
          <ul>
            {girlsOnField.map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>

          <Button variant="contained" onClick={rotateLineup}>Change Line</Button>
          <Button onClick={rotatePreviousLineup}>Undo Line Change</Button>

          <h2>History</h2>
          <h3>Male ratio: {maleRatio}</h3>
          <h3>Count: {countSinceLastRatioChange}</h3>
          <ul>
            {lineupHistoryRef.current.map(h => (
              <li key={Math.random() + '12335'}>
                players: {h.players.length}, maleRatio: {h.maleRatio}, count: {h.countSinceLastRatioChange}
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};

export default PlayerLineup;
