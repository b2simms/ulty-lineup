import './PlayerLineup.css';

import { GenderRatio, Player, ScoreTypes, getNextIndex, getNextRatio, getPlayersSubset } from './Player';

import Button from "@mui/material/Button";
import { selectPlayers } from './rosterSlice';
import { TOTAL_PLAYERS_ON_FIELD } from './constants';
import {
  addScore,
  incrementPointsPlayed,
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
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, Chip, Container, Divider, List, ListItem, Modal, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    dispatch(setCountSinceLastRatioChange(1)); // flip after first point
    // reset indexes
    dispatch(setMaleIndex(0));
    dispatch(setFemaleIndex(0));
    navigate('/roster');
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

  const getPlayerIndex = (list: Player[], id: number): number => {
    return list.findIndex((p) => p.id === id) + 1;
  }

  const handleTeamWhoScoredSelection = (_event: React.MouseEvent, value: ScoreTypes) => {
    if (value) {
      setTeamWhoScored(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minWidth: '350px', padding: '1em' }}>
      <Box sx={{ display: 'flex', flex: '3', flexDirection: 'column' }}>
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
            <ToggleButton value="female">Female ({startingRatio === 'female' ? 4 : 3})</ToggleButton>
            <ToggleButton value="male">Male ({startingRatio === 'male' ? 4 : 3})</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <Button color="primary" fullWidth variant="contained" onClick={handleStartGame} sx={{ margin: '1em 0' }}>
            Next: Review Roster
          </Button>
        </div>
        }
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
            <h2 className='centerHeader'>Point #{pointsPlayed + 1}</h2>
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

            <Button variant="contained" fullWidth onClick={handleOpen} sx={{ margin: "0 auto", height: '48px' }}>Next Point</Button>
          </div>
        }
      </Box>
      <Box sx={{ display: 'flex', flex: '1', flexDirection: 'column' }}>
        <Divider sx={{ margin: "1em" }} >
          <Chip label="Menu" />
        </Divider>
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
        <Button
          variant="outlined"
          onClick={() => navigate("/advanced")}
          fullWidth
        >
          Advanced
        </Button>
      </Box>
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
          padding: '1em',
        }}>
          <CloseIcon onClick={handleClose} sx={{ position: "absolute", top: "1em", right: "1em" }}></CloseIcon>
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
          <br />
          <Button variant="contained" fullWidth onClick={handleLineupChange} sx={{ height: '48px' }}>OK</Button>
        </Card>
      </Modal>
    </Box>
  );
};

export default PlayerLineup;

