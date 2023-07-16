export type GenderRatio = 'male' | 'female';
export type ScoreTypes = 'home' | 'away';

export type Player = {
  id: number;
  name: string;
  gender: GenderRatio;
};
