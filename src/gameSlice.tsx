import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GenderRatio, ScoreTypes } from './Player';
import { PointOfSaleSharp } from '@mui/icons-material';

// Define a type for the slice state
interface GameState {
    score: {
        home: number,
        away: number,
        history: ScoreTypes[],
    },
    pointsPlayed: number,
    homeTeam: string,
    awayTeam: string,
    startingRatio: GenderRatio,
    currentRatio: GenderRatio,
    countSinceLastRatioChange: number,
    maleIndex: number,
    femaleIndex: number,
}

// Load initial state from storage
const storedGame = localStorage.getItem('game');
const initialState: GameState = storedGame ? JSON.parse(storedGame)
    : {
        score: {
            home: 0,
            away: 0,
            history: [],
        },
        pointsPlayed: -1,
        homeTeam: '',
        awayTeam: '',
        startingRatio: 'male',
        currentRatio: 'male',
        maleIndex: 0,
        femaleIndex: 0,
        countSinceLastRatioChange: 0,
    };

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGame: (state) => {
            state.score.home = 0;
            state.score.away = 0;
            state.score.history = [];
            state.pointsPlayed = -1;
            state.maleIndex = 0;
            state.femaleIndex = 0;
            localStorage.setItem('game', JSON.stringify(state));
        },
        incrementPointsPlayed: (state) => {
            state.pointsPlayed++;
            localStorage.setItem('game', JSON.stringify(state));
        },
        decrementPointsPlayed: (state) => {
            state.pointsPlayed--;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setPointsPlayed: (state, action: PayloadAction<number>) => {
            const points = action.payload;
            state.pointsPlayed = points;
            localStorage.setItem('game', JSON.stringify(state));
        },
        addScore: (state, action: PayloadAction<ScoreTypes>) => {
            const team = action.payload;
            state.score[team]++;
            state.score.history.push(team);
            localStorage.setItem('game', JSON.stringify(state));
        },
        removeScore: (state) => {
            const lastScoringTeam = state.score.history.pop();
            if (lastScoringTeam) {
                state.score[lastScoringTeam]--;
            }
            localStorage.setItem('game', JSON.stringify(state));
        },
        setScore: (state, action: PayloadAction<{ team: ScoreTypes, score: number }>) => {
            const { team, score } = action.payload;
            state.score[team] = score;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setStartingGenderRatio: (state, action: PayloadAction<GenderRatio>) => {
            state.startingRatio = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setCurrentGenderRatio: (state, action: PayloadAction<GenderRatio>) => {
            state.currentRatio = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        incrementMaleIndex: (state) => {
            state.maleIndex++;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setMaleIndex: (state, action: PayloadAction<number>) => {
            state.maleIndex = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        incrementFemaleIndex: (state) => {
            state.femaleIndex++;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setFemaleIndex: (state, action: PayloadAction<number>) => {
            state.femaleIndex = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setCountSinceLastRatioChange: (state, action: PayloadAction<number>) => {
            state.countSinceLastRatioChange = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setHomeTeam: (state, action: PayloadAction<string>) => {
            state.homeTeam = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setAwayTeam: (state, action: PayloadAction<string>) => {
            state.awayTeam = action.payload;
            localStorage.setItem('game', JSON.stringify(state));
        },
    },
    selectors: {
        selectPointsPlayed: state => state.pointsPlayed,
        selectHomeScore: state => state.score.home,
        selectAwayScore: state => state.score.away,
        selectHomeTeam: state => state.homeTeam,
        selectAwayTeam: state => state.awayTeam,
        selectStartingRatio: state => state.startingRatio,
        selectCurrentGenderRatio: state => state.currentRatio,
        selectCountSinceLastRatioChange: state => state.countSinceLastRatioChange,
        selectFemaleIndex: state => state.femaleIndex,
        selectMaleIndex: state => state.maleIndex,
    },
})

export const {
    addScore,
    removeScore,
    incrementPointsPlayed,
    decrementPointsPlayed,
    setPointsPlayed,
    setStartingGenderRatio,
    setCurrentGenderRatio,
    incrementMaleIndex,
    setMaleIndex,
    incrementFemaleIndex,
    setFemaleIndex,
    setCountSinceLastRatioChange,
    setHomeTeam,
    setAwayTeam,
    resetGame,
} = gameSlice.actions;

export const {
    selectPointsPlayed,
    selectHomeScore,
    selectAwayScore,
    selectHomeTeam,
    selectAwayTeam,
    selectStartingRatio,
    selectCountSinceLastRatioChange,
    selectFemaleIndex,
    selectMaleIndex,
    selectCurrentGenderRatio,
} = gameSlice.selectors;

export default gameSlice.reducer;
