import React, { useState } from 'react';

// MUI Components
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Box, SelectChangeEvent } from "@mui/material";
import TextField from '@mui/material/TextField';

// MUI Icons
import { useAppDispatch } from './hooks';
import { addPlayer, removePlayer, selectPlayers, updatePlayerName } from './rosterSlice';
import { GenderRatio, Player } from './Player';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPointsPlayed } from './gameSlice';

const PlayerRoster: React.FC = () => {
  const players = useSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pointsPlayed = useSelector(selectPointsPlayed);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGender, setNewPlayerGender] = useState<GenderRatio>('male');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(event.target.value);
  };

  const handleGenderChange = (event: SelectChangeEvent<GenderRatio>) => {
    setNewPlayerGender(event.target.value as GenderRatio);
  };

  const handleAddPlayer = () => {
    // update store
    dispatch(addPlayer({
      id: new Date().getTime(),
      name: newPlayerName,
      gender: newPlayerGender,
    }));
    // clear inputs
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: number) => {
    // update store
    dispatch(removePlayer(id));
  };

  const handlePlayerNameEdit = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    dispatch(updatePlayerName({
      id,
      name: event.target.value,
    }));
  }

  const malePlayers = players.filter(player => player.gender === 'male');
  const femalePlayers = players.filter(player => player.gender === 'female');

  const getPlayerIndex = (list: Player[], id: number): number => {
    return list.findIndex((p) => p.id === id) + 1;
  }

  return (
    <Box sx={{ margin: '1em' }}>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        fullWidth
        sx={{
          margin: '1rem 0',
        }}
      >
        {pointsPlayed <= 0 ? 'Start Game' : 'Back to Game'}
      </Button>

      <TextField
        id="outlined-basic"
        label="Player Name"
        variant="outlined"
        type="text"
        value={newPlayerName}
        onChange={handleInputChange}
        placeholder="Enter player name"
      />
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={newPlayerGender}
          onChange={handleGenderChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female-matching" />
          <FormControlLabel value="male" control={<Radio />} label="Male-matching" />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleAddPlayer}
        sx={{
          margin: '1rem',
        }}
      >
        Add Player
      </Button>

      <h2>Male Players ({malePlayers.length})</h2>
      {malePlayers.map(player => (
        <Box key={player.id} sx={{ display: 'flex' }}>
          <Box sx={{ flex: '3', padding: '0.5em' }}>
            {getPlayerIndex(malePlayers, player.id)}.
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerNameEdit(e, player.id)}
              placeholder="Enter player name"
            />
          </Box>
          <Box sx={{ flex: '1', textAlign: 'end' }}>
            <Button onClick={() => handleRemovePlayer(player.id)}>Remove</Button>
          </Box>
        </Box>
      ))}
      <h2>Female Players ({femalePlayers.length})</h2>
      {femalePlayers.map(player => (
        <Box key={player.id} sx={{ display: 'flex' }}>
          <Box sx={{ flex: '3', padding: '0.5em' }}>
            {getPlayerIndex(femalePlayers, player.id)}.
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerNameEdit(e, player.id)}
              placeholder="Enter player name"
            />
          </Box>
          <Box sx={{ flex: '1', textAlign: 'end' }}>
            <Button onClick={() => handleRemovePlayer(player.id)}>Remove</Button>
          </Box>
        </Box>
      ))}
    </Box >
  );
};

export default PlayerRoster;
