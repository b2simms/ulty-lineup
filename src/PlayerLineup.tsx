import './PlayerLineup.css';

import { GenderRatio, Player, ScoreTypes } from './Player';

import Button from "@mui/material/Button";
import { selectPlayers } from './rosterSlice';
import { TOTAL_PLAYERS_ON_FIELD } from './constants';
import {
  addScore,
  decrementPointsPlayed,
  incrementPointsPlayed,
  removeScore,
  resetGame,
  selectAwayScore,
  selectAwayTeam,
  selectCountSinceLastRatioChange,
  selectCurrentGenderRatio,
  selectFemaleIndex,
  selectHomeScore,
  selectHomeTeam,
  selectMaleIndex,
  selectPointsPlayed,
  selectStartingRatio,
  setAwayTeam,
  setCountSinceLastRatioChange,
  setCurrentGenderRatio,
  setFemaleIndex,
  setHomeTeam,
  setMaleIndex,
  setPointsPlayed,
  setStartingGenderRatio,
} from './gameSlice';
import { useAppDispatch } from './hooks';
import { Card, Container, List, ListItem, Modal, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  const homeTeam = useSelector(selectHomeTeam);
  const awayTeam = useSelector(selectAwayTeam);
  const homeScore = useSelector(selectHomeScore);
  const awayScore = useSelector(selectAwayScore);
  const currentRatio = useSelector(selectCurrentGenderRatio);
  const countSinceLastRatioChange = useSelector(selectCountSinceLastRatioChange);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [teamWhoScored, setTeamWhoScored] = useState<ScoreTypes>('home');

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

  const handleHomeTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value) {
      dispatch(setHomeTeam(e.target.value));
    } else {
      dispatch(setHomeTeam(''));
    }
  };

  const handleAwayTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value) {
      dispatch(setAwayTeam(e.target.value));
    } else {
      dispatch(setAwayTeam(''));
    }
  };

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
    dispatch(resetGame());
  };

  const handleLineupChange = () => {
    handleClose();
    // increment points played
    dispatch(addScore(teamWhoScored));
    dispatch(incrementPointsPlayed());
    // move indexes
    const oldMaleRatio = currentRatio === 'male' ? 4 : 3;
    const oldFemaleRatio = TOTAL_PLAYERS_ON_FIELD - oldMaleRatio;
    const newMaleIndex = getNextIndex(males.length, maleIndex, oldMaleRatio);
    dispatch(setMaleIndex(newMaleIndex));
    const newFemaleIndex = getNextIndex(females.length, femaleIndex, oldFemaleRatio);
    dispatch(setFemaleIndex(newFemaleIndex));

    // update ratio
    const { ratio, count } = getNextRatio(currentRatio, countSinceLastRatioChange);
    dispatch(setCurrentGenderRatio(ratio));
    dispatch(setCountSinceLastRatioChange(count));
  };

  const handleUndoLineupChange = () => {
    // decrement points played
    dispatch(decrementPointsPlayed());

    // rotate ratio back
    const { ratio, count } = getPreviousRatio(currentRatio, countSinceLastRatioChange);
    dispatch(setCurrentGenderRatio(ratio));
    dispatch(setCountSinceLastRatioChange(count));

    // move indexes before calculating previous ratio
    const maleRatio = ratio === 'male' ? 4 : 3;
    const femaleRatio = TOTAL_PLAYERS_ON_FIELD - maleRatio;
    dispatch(setMaleIndex(getPreviousIndex(males.length, maleIndex, maleRatio)));
    dispatch(setFemaleIndex(getPreviousIndex(females.length, femaleIndex, femaleRatio)));
    // update score
    dispatch(removeScore());
  };

  const getPlayerIndex = (list: Player[], id: number): number => {
    return list.findIndex((p) => p.id === id) + 1;
  }

  const handleTeamWhoScoredSelection = (_event: React.MouseEvent, value: ScoreTypes) => {
    if (value) {
      setTeamWhoScored(value);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => navigate("/roster")}
        fullWidth
        sx={{
          margin: '1em 0',
        }}
      >
        Edit Roster
      </Button>

      {pointsPlayed < 0 && <div>
        <TextField
          label="Your team name"
          name="userTeam"
          value={homeTeam}
          onChange={handleHomeTeamInputChange}
          fullWidth
          margin="normal"
          sx={{
            marginBottom: '1rem',
          }}
        />
        <TextField
          label="Opponent's team name"
          name="opponentTeam"
          value={awayTeam}
          onChange={handleAwayTeamInputChange}
          fullWidth
          margin="normal"
          sx={{
            marginBottom: '1rem',
          }}
        />
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
        <br />
        <Button color="primary" variant="contained" onClick={handleStartGame}>Start Game</Button>
      </div>
      }
      {pointsPlayed >= 0 && <Button color="primary" variant="contained" onClick={handleResetGame}>Reset Game</Button>}
      {pointsPlayed > 0 && <Button onClick={handleUndoLineupChange}>Undo Line Change</Button>}
      {pointsPlayed >= 0 &&
        <div>
          <div className="scoreboard">
            <div>
              {homeTeam}: {homeScore}
            </div>
            <div>
              {awayTeam}: {awayScore}
            </div>
          </div>
          <h2>Point #{pointsPlayed + 1}</h2>
          <Container
            disableGutters
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Container
              disableGutters
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
              }}>
              <strong>Male ({malesOnField.length})</strong>
              <List>
                {malesOnField.map(player => (
                  <ListItem key={player.id}>
                    {getPlayerIndex(males, player.id)}. {player.name}
                  </ListItem>
                ))}
              </List>
            </Container>
            <Container
              disableGutters
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                p: 0,
              }}>
              <strong>Female ({femalesOnField.length})</strong>
              <List>
                {femalesOnField.map(player => (
                  <ListItem key={player.id}>
                    {getPlayerIndex(females, player.id)}. {player.name}
                  </ListItem>
                ))}
              </List>
            </Container>
          </Container>

          <Button variant="contained" onClick={handleOpen}>Next Point</Button>
        </div>
      }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "350px",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <h2>Who Scored?</h2>
          <ToggleButtonGroup
            color="primary"
            value={teamWhoScored}
            exclusive
            onChange={handleTeamWhoScoredSelection}
            aria-label="Platform"
            sx={{ margin: "1em" }}
          >
            <ToggleButton value="home">{homeTeam}</ToggleButton>
            <ToggleButton value="away">{awayTeam}</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" onClick={handleLineupChange}>Change Line</Button>
        </Card>
      </Modal>
    </div>
  );
};

export default PlayerLineup;

