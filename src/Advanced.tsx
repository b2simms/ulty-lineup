import './PlayerLineup.css';

import { GenderRatio, Player } from './Player';

import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { selectPlayers } from './rosterSlice';
import { TOTAL_PLAYERS_ON_FIELD } from './constants';
import {
  addScore,
  decrementPointsPlayed,
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
  setAwayTeam,
  setCountSinceLastRatioChange,
  setCurrentGenderRatio,
  setFemaleIndex,
  setHomeTeam,
  setMaleIndex,
  setScore,
} from './gameSlice';
import { useAppDispatch } from './hooks';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, Container, IconButton, List, ListItem, Modal, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { selectThemeMode, toggleTheme } from './themeSlice';

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
  const maleIndex = useSelector(selectMaleIndex);
  const femaleIndex = useSelector(selectFemaleIndex);
  const homeTeam = useSelector(selectHomeTeam);
  const awayTeam = useSelector(selectAwayTeam);
  const homeScore = useSelector(selectHomeScore);
  const awayScore = useSelector(selectAwayScore);
  const currentRatio = useSelector(selectCurrentGenderRatio);
  const countSinceLastRatioChange = useSelector(selectCountSinceLastRatioChange);
  const themeMode = useSelector(selectThemeMode);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      dispatch(setCurrentGenderRatio(value as GenderRatio));
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

  const handleResetGame = () => {
    dispatch(resetGame());
    navigate('/');
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

  const handleAddHomeScore = () => {
    dispatch(addScore('home'));
  };
  const handleRemoveHomeScore = () => {
    dispatch(setScore({
      team: 'home',
      score: homeScore - 1,
    }));
  };
  const handleAddAwayScore = () => {
    dispatch(addScore('away'));
  };
  const handleRemoveAwayScore = () => {
    dispatch(setScore({
      team: 'away',
      score: awayScore - 1,
    }));
  };

  const handleShiftNextMaleLineup = () => {
    if (maleIndex >= males.length) {
      dispatch(setMaleIndex(0));
    } else {
      dispatch(setMaleIndex(maleIndex + 1));
    }
  };
  const handleShiftPreviousMaleLineup = () => {
    if (maleIndex === 0) {
      dispatch(setMaleIndex(males.length - 1));
    } else {
      dispatch(setMaleIndex(maleIndex - 1));
    }
  };

  const handleShiftNextFemaleLineup = () => {
    if (femaleIndex >= females.length) {
      dispatch(setFemaleIndex(0));
    } else {
      dispatch(setFemaleIndex(femaleIndex + 1));
    }
  };
  const handleShiftPreviousFemaleLineup = () => {
    if (femaleIndex === 0) {
      dispatch(setFemaleIndex(females.length - 1));
    } else {
      dispatch(setFemaleIndex(femaleIndex - 1));
    }
  };

  const handleCountChange = (_event: React.MouseEvent, value: number) => {
    if (value) {
      dispatch(setCountSinceLastRatioChange(value));
    }
  };

  const getPlayerIndex = (list: Player[], id: number): number => {
    return list.findIndex((p) => p.id === id) + 1;
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  console.log(themeMode);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '350px', padding: '1em' }}>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        fullWidth
        sx={{
          margin: '1em 0'
        }}
      >
        Back to Game
      </Button>

      <IconButton sx={{ ml: 1 }} onClick={handleToggleTheme} color="inherit">
        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <br />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button disabled={pointsPlayed <= 0} onClick={handleUndoLineupChange}>Undo Last Point</Button>
        <Button disabled={pointsPlayed < 0} color="primary" variant="outlined" onClick={handleOpen}>Reset Game</Button>
      </Box>

      <br />

      <h2 className='centerHeader'>Point #{pointsPlayed + 1}</h2>

      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '1em 0' }}>
        <Box sx={{ display: 'flex', flex: '1', flexDirection: 'column' }}>
          <strong>Home</strong>
          {homeTeam}: {homeScore}
        </Box>
        <AddCircleIcon onClick={handleAddHomeScore} sx={{ height: '48px', width: '48px' }}></AddCircleIcon>
        <RemoveCircleIcon onClick={handleRemoveHomeScore} sx={{ height: '48px', width: '48px' }}></RemoveCircleIcon>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '1em 0' }}>
        <Box sx={{ display: 'flex', flex: '1', flexDirection: 'column' }}>
          <strong>Away</strong>
          {awayTeam}: {awayScore}
        </Box>
        <AddCircleIcon onClick={handleAddAwayScore} sx={{ height: '48px', width: '48px' }}></AddCircleIcon>
        <RemoveCircleIcon onClick={handleRemoveAwayScore} sx={{ height: '48px', width: '48px' }}></RemoveCircleIcon>
      </Box>

      <Box>
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

        <br />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', flex: '1' }}>
              <p>Current Gender Ratio:</p>
            </Box>
            <Box sx={{ display: 'flex', flex: '1' }}>
              <ToggleButtonGroup
                color="primary"
                value={currentRatio}
                exclusive
                onChange={handleGenderChange}
                aria-label="Platform"
              >
                <ToggleButton value="female">Female</ToggleButton>
                <ToggleButton value="male">Male</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
          <br />
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', flex: '1' }}>
              <p>Gender Ratio Shift Count:</p>
            </Box>
            <Box sx={{ display: 'flex', flex: '1' }}>
              <ToggleButtonGroup
                color="primary"
                value={countSinceLastRatioChange + ''}
                exclusive
                onChange={handleCountChange}
                aria-label="Platform"
              >
                <ToggleButton value="0">First</ToggleButton>
                <ToggleButton value="1">Second</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Box>

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
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '1em 0' }}>
            <AddCircleIcon onClick={handleShiftNextMaleLineup} sx={{ height: '48px', width: '48px' }}></AddCircleIcon>
            <RemoveCircleIcon onClick={handleShiftPreviousMaleLineup} sx={{ height: '48px', width: '48px' }}></RemoveCircleIcon>
          </Box>
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
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '1em 0' }}>
            <AddCircleIcon onClick={handleShiftNextFemaleLineup} sx={{ height: '48px', width: '48px' }}></AddCircleIcon>
            <RemoveCircleIcon onClick={handleShiftPreviousFemaleLineup} sx={{ height: '48px', width: '48px' }}></RemoveCircleIcon>
          </Box>
          <List>
            {femalesOnField.map(player => (
              <ListItem key={player.id}>
                {getPlayerIndex(females, player.id)}. {player.name}
              </ListItem>
            ))}
          </List>
        </Container>
      </Container>

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
          padding: '2em',
        }}>
          <CloseIcon onClick={handleClose} sx={{ position: "absolute", top: "1em", right: "1em" }}></CloseIcon>
          <h2>Reset Game?</h2>
          <p>Resetting the game clears the score, the points are reset, and the line up is defaulted.</p>
          <Button variant="contained" onClick={handleResetGame} sx={{ background: 'red' }}>OK</Button>
        </Card>
      </Modal>
    </Box >
  );
};

export default PlayerLineup;

