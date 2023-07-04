import React, { useState } from 'react';

// MUI Components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { SelectChangeEvent } from "@mui/material";
import TextField from '@mui/material/TextField';

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from './hooks';
import { addPlayer, removePlayer, selectPlayers } from './rosterSlice';
import { GenderRatio } from './Player';
import { useSelector } from 'react-redux';

const PlayerRoster: React.FC = () => {
  const players = useSelector(selectPlayers);
  const dispatch = useAppDispatch();

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

  return (
    <div>
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

      <Button variant="contained" onClick={handleAddPlayer}>Add Player</Button>

      <h2>Male Players ({players.filter(player => player.gender === 'male').length})</h2>
      <ul>
        {players.filter(player => player.gender === 'male').map(player => (
          <li key={player.id}>
            {player.name} ({player.gender})
            <Button onClick={() => handleRemovePlayer(player.id)}>Remove</Button>
          </li>
        ))}
      </ul>
      <h2>Female Players ({players.filter(player => player.gender === 'female').length})</h2>
      {players.filter(player => player.gender === 'female').map(player => (
        <Chip
          avatar={<Avatar>{player.name.charAt(0).toUpperCase()}</Avatar>}
          label={player.name}
          key={player.id}
          onDelete={() => handleRemovePlayer(player.id)}
          deleteIcon={<DeleteIcon />}
        />
      ))}
    </div>
  );
};

export default PlayerRoster;
