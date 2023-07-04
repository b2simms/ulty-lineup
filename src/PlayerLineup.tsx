import { useEffect } from 'react';
import { GenderRatio, Player } from './Player';

import Button from "@mui/material/Button";
import { selectPlayers } from './rosterSlice';
import { TOTAL_PLAYERS_ON_FIELD } from './constants';
import { decrementPointsPlayed, incrementPointsPlayed, selectCountSinceLastRatioChange, selectCurrentGenderRatio, selectFemaleIndex, selectMaleIndex, selectPointsPlayed, selectStartingRatio, setCountSinceLastRatioChange, setCurrentGenderRatio, setFemaleIndex, setMaleIndex, setPointsPlayed, setStartingGenderRatio } from './gameSlice';
import { useAppDispatch } from './hooks';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelector } from 'react-redux';

function getPlayersSubset(players: Player[], index: number, count: number): Player[] {
  const length = players.length;
  const startIndex = index % length;
  const endIndex = (index + count) % length;

  if (startIndex < endIndex) {
    return players.slice(startIndex, endIndex);
  } else {
    return players.slice(startIndex).concat(players.slice(0, endIndex));
  }
}

function getNextIndex(max: number, index: number, count: number): number {
  return (index + count) % max;
}

function getNextRatio(current: GenderRatio, count: number): {
  ratio: GenderRatio, count: number
} {
  const flipRatio = (i: GenderRatio) => i === 'male' ? 'female' : 'male';
  const newRatio = count >= 1 ? flipRatio(current) : current;
  const newCount = count >= 1 ? 0 : count + 1;
  return {
    ratio: newRatio,
    count: newCount,
  };
}

function getPreviousIndex(max: number, index: number, count: number): number {
  return (index - count + max) % max;
}

function getPreviousRatio(current: GenderRatio, count: number): {
  ratio: GenderRatio, count: number
} {
  const flipRatio = (i: GenderRatio) => i === 'male' ? 'female' : 'male';
  const newRatio = count >= 1 ? current : flipRatio(current);
  const newCount = count < 1 ? 1 : count - 1;
  return {
    ratio: newRatio,
    count: newCount,
  };
}

const PlayerLineup: React.FC = () => {
  const dispatch = useAppDispatch();
  const players = useSelector(selectPlayers);
  const pointsPlayed = useSelector(selectPointsPlayed);
  const startingRatio = useSelector(selectStartingRatio);
  const maleIndex = useSelector(selectMaleIndex);
  const femaleIndex = useSelector(selectFemaleIndex);
  const currentRatio = useSelector(selectCurrentGenderRatio);
  const countSinceLastRatioChange = useSelector(selectCountSinceLastRatioChange);

  // split roster by gender
  const males = players.filter(player => player.gender === 'male');
  const females = players.filter(player => player.gender === 'female');
  // determine ratio
  const maleCount = currentRatio === 'male' ? 4 : 3;
  // load players by gender index and ratio
  const malesOnField = getPlayersSubset(males, maleIndex, maleCount);
  const femalesOnField = getPlayersSubset(females, femaleIndex, TOTAL_PLAYERS_ON_FIELD - maleCount);

  const handleGenderChange = (_event: React.MouseEvent, value: GenderRatio) => {
    if (value) {
      dispatch(setStartingGenderRatio(value as GenderRatio));
    }
  };

  useEffect(() => {
    // initLineup(startingRatio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartGame = () => {
    dispatch(setPointsPlayed(0));
    // determine starting ratio
    dispatch(setCurrentGenderRatio(startingRatio));
    dispatch(setCountSinceLastRatioChange(10)); // flip after first point
    // reset indexes
    dispatch(setMaleIndex(0));
    dispatch(setFemaleIndex(0));
  };

  const handleResetGame = () => {
    dispatch(setPointsPlayed(-1));

    // determine starting ratio
    dispatch(setCurrentGenderRatio(startingRatio));
    // reset indexes
    dispatch(setMaleIndex(0));
    dispatch(setFemaleIndex(0));
  };

  const handleLineupChange = () => {
    // increment points played
    dispatch(incrementPointsPlayed());
    // rotate ratio and indexes
    const { ratio, count } = getNextRatio(currentRatio, countSinceLastRatioChange);
    const maleRatio = ratio === 'male' ? 4 : 3;
    const femaleRatio = TOTAL_PLAYERS_ON_FIELD - maleRatio;
    dispatch(setCurrentGenderRatio(ratio));
    dispatch(setCountSinceLastRatioChange(count));
    dispatch(setMaleIndex(getNextIndex(males.length, maleIndex, maleRatio)));
    dispatch(setFemaleIndex(getNextIndex(females.length, femaleIndex, femaleRatio)));
    // update score
  };

  const handleUndoLineupChange = () => {
    // decrement points played
    dispatch(decrementPointsPlayed());
    // move indexes before calculating previous ratio
    const oldMaleRatio = currentRatio === 'male' ? 4 : 3;
    const oldFemaleRatio = TOTAL_PLAYERS_ON_FIELD - oldMaleRatio;
    dispatch(setMaleIndex(getPreviousIndex(males.length, maleIndex, oldMaleRatio)));
    dispatch(setFemaleIndex(getPreviousIndex(females.length, femaleIndex, oldFemaleRatio)));
    // rotate ratio back
    const { ratio, count } = getPreviousRatio(currentRatio, countSinceLastRatioChange);
    dispatch(setCurrentGenderRatio(ratio));
    dispatch(setCountSinceLastRatioChange(count));
    // update score
  };

  return (
    <div>
      {pointsPlayed < 0 && <div>
        <Button color="primary" variant="contained" onClick={handleStartGame}>Start Game</Button>
        <p>Starting Gender Ratio on the Field:</p>
        <ToggleButtonGroup
          color="primary"
          value={startingRatio}
          exclusive
          onChange={handleGenderChange}
          aria-label="Platform"
        >
          <ToggleButton value="female">Female</ToggleButton>
          <ToggleButton value="male">Male</ToggleButton>
        </ToggleButtonGroup>
      </div>
      }
      {pointsPlayed >= 0 && <Button color="primary" variant="contained" onClick={handleResetGame}>Reset Game</Button>}
      {pointsPlayed >= 0 &&
        <div>
          <h2>Point #{pointsPlayed + 1}</h2>
          <h2>Gender Ratio on the Field</h2>
          <p>Guys: {malesOnField.length}</p>
          <p>Girls: {femalesOnField.length}</p>

          <h2>Players on the Field</h2>
          <h3>Male Players ({malesOnField.length})</h3>
          <ul>
            {malesOnField.map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>
          <h3>Female Players ({femalesOnField.length})</h3>
          <ul>
            {femalesOnField.map(player => (
              <li key={player.name}>
                {player.name} ({player.gender})
              </li>
            ))}
          </ul>

          <Button variant="contained" onClick={handleLineupChange}>Change Line</Button>
          {pointsPlayed > 0 && <Button onClick={handleUndoLineupChange}>Undo Line Change</Button>}

          {/* <h2>History</h2>
          <ul>
            {lineupHistoryRef.current.map(h => (
              <li key={Math.random() + '12335'}>
                players: {h.players.length}, maleRatio: {h.maleRatio}, count: {h.countSinceLastRatioChange}
              </li>
            ))}
          </ul> */}
        </div>
      }
    </div>
  );
};

export default PlayerLineup;
