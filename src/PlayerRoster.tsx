import React from 'react';
import { Player } from './Player';

type PlayerRosterProps = {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

const PlayerRoster: React.FC<PlayerRosterProps> = ({ players, setPlayers }) => {
  const [newPlayerName, setNewPlayerName] = React.useState('');
  const [newPlayerGender, setNewPlayerGender] = React.useState<'male' | 'female'>('male');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPlayerGender(event.target.value as 'male' | 'female');
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      const newPlayer: Player = {
        id: new Date().getTime(),
        name: newPlayerName,
        gender: newPlayerGender,
      };

      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (id: number) => {
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers);
  };

  React.useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  return (
    <div>
      <input
        type="text"
        value={newPlayerName}
        onChange={handleInputChange}
        placeholder="Enter player name"
      />
      <select value={newPlayerGender} onChange={handleGenderChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button onClick={handleAddPlayer}>Add Player</button>

      <h2>Male Players ({players.filter(player => player.gender === 'male').length})</h2>
      <ul>
        {players.filter(player => player.gender === 'male').map(player => (
          <li key={player.id}>
            {player.name} ({player.gender})
            <button onClick={() => handleRemovePlayer(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Female Players ({players.filter(player => player.gender === 'female').length})</h2>
      <ul>
        {players.filter(player => player.gender === 'female').map(player => (
          <li key={player.id}>
            {player.name} ({player.gender})
            <button onClick={() => handleRemovePlayer(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerRoster;