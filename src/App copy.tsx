import React from 'react';
import { Player } from './Player';
import PlayerLineup from './PlayerLineup';
import PlayerRoster from './PlayerRoster';
import LandingPage from './LandingPage';

const App: React.FC = () => {
  const storedPlayers = localStorage.getItem('players');
  const initialPlayers: Player[] = storedPlayers ? JSON.parse(storedPlayers) : [];

  const [players, setPlayers] = React.useState<Player[]>(initialPlayers);

  React.useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  return (
    <div>
      <LandingPage></LandingPage>
      <PlayerRoster players={players} setPlayers={setPlayers} />
      <PlayerLineup roster={players} />
    </div>
  );
};

export default App;
