export type GenderRatio = 'male' | 'female';
export type ScoreTypes = 'home' | 'away';

export type Player = {
  id: number;
  name: string;
  gender: GenderRatio;
};

export function getPlayersSubset(players: Player[], index: number, count: number): Player[] {
  const length = players.length;
  const startIndex = index % length;
  const endIndex = (index + count) % length;

  if (players.length <= count) {
    return players;
  }

  if (startIndex < endIndex) {
    return players.slice(startIndex, endIndex);
  } else {
    return players.slice(startIndex).concat(players.slice(0, endIndex));
  }
}

export function getPreviousIndex(max: number, index: number, count: number): number {
  return (index - count + max) % max;
}

export function getPreviousRatio(current: GenderRatio, count: number): {
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

export function getNextIndex(max: number, index: number, count: number): number {
  return (index + count) % max;
}

export function getNextRatio(current: GenderRatio, count: number): {
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
