import { useEffect, useRef, useState } from 'react';
import { Player } from './Player';

const usePlayerLineup = (roster: Player[]) => {
  const [players, setPlayers] = useState<Player[]>(roster);
  const [isFirstLine, setIsFirstLine] = useState(true);
  const [maleRatio, setMaleRatio] = useState(4);
  const lineupHistoryRef = useRef<Player[]>([]);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [countSinceLastRatioChange, setCountSinceLastRatioChange] = useState(1);

  useEffect(() => {
    const updatedLine = updateLineupFromRoster(players, roster);
    setPlayers(updatedLine);
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
      frontPlayers = newLineup.splice(0, 7);
      newLineup.push(...frontPlayers);
    }

    // Rotate the lineup while maintaining the correct gender ratio on the field
    const guysInLineup = newLineup.filter(player => player.gender === 'male');
    const girlsInLineup = newLineup.filter(player => player.gender === 'female');

    const newFrontPlayers = [];

    // get current ratio
    let ratioChangeCount = countSinceLastRatioChange;
    let mRatio = maleRatio;
    if (isFirstLine) {
      ratioChangeCount = 2;
    } else {
      if (isFirstLine || ratioChangeCount >= 2) {
        ratioChangeCount = 1;
        mRatio = maleRatio === 4 ? 3 : 4;
      } else {
        ratioChangeCount++;
      }
    }

    // Add additional guys from the lineup
    let guyCount = 0;
    while (guyCount < mRatio && guysInLineup.length > 0) {
      newFrontPlayers.push(guysInLineup.shift());
      guyCount++;
    }

    // Add additional girls from the lineup
    let girlCount = 0;
    while (girlCount < (7 - mRatio) && girlsInLineup.length > 0) {
      newFrontPlayers.push(girlsInLineup.shift());
      girlCount++;
    }

    // add bench players
    newFrontPlayers.push(...guysInLineup);
    newFrontPlayers.push(...girlsInLineup);

    // Store the previous lineup in history
    lineupHistoryRef.current.push([...players]);
    // set lineup
    setPlayers(newFrontPlayers);

    setMaleRatio(mRatio);
    setCountSinceLastRatioChange(ratioChangeCount);
  }

  function rotatePreviousLineup() {
    const history = lineupHistoryRef.current;

    if (history.length > 1) {
      const previousLineup = history.pop();
      setViewingHistory(true);
      setPlayers(previousLineup);
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

  return { players, rotateLineup, rotatePreviousLineup };
};

type PlayerLineupProps = {
  roster: Player[];
};

const PlayerLineup: React.FC<PlayerLineupProps> = ({ roster }) => {
  const { players, rotateLineup, rotatePreviousLineup } = usePlayerLineup(roster);
  const guysOnField = players.filter(player => player.gender === 'male').length;
  const girlsOnField = players.length - guysOnField;

  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    rotateLineup();
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted && <button onClick={startGame}>Start Game</button>}
      {gameStarted &&
        <div>
          <h2>Gender Ratio on the Field</h2>
          <p>Guys: {guysOnField}</p>
          <p>Girls: {girlsOnField}</p>

          <h2>Players on the Field</h2>
          <h3>Male Players ({players.slice(0, 7).filter(player => player.gender === 'male').length})</h3>
          <ul>
            {players.slice(0, 7).filter(player => player.gender === 'male').map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>
          <h3>Female Players ({players.slice(0, 7).filter(player => player.gender === 'female').length})</h3>
          <ul>
            {players.slice(0, 7).filter(player => player.gender === 'female').map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>

          <button onClick={rotateLineup}>Change Line</button>
          <button onClick={rotatePreviousLineup}>Undo Line Change</button>
        </div>
      }
    </div>
  );
};

export default PlayerLineup;
