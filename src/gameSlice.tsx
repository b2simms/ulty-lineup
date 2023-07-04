import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GenderRatio } from './Player';

// Define a type for the slice state
interface GameState {
    score: {
        home: number,
        away: number,
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
        addScore: (state, action: PayloadAction<'home' | 'away'>) => {
            const team = action.payload;
            state.score[team]++;
            localStorage.setItem('game', JSON.stringify(state));
        },
        setScore: (state, action: PayloadAction<{ team: 'home' | 'away', score: number }>) => {
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
    },
    selectors: {
        selectPointsPlayed: state => state.pointsPlayed,
        selectHomeScore: state => state.score.home,
        selectAwayScore: state => state.score.away,
        selectStartingRatio: state => state.startingRatio,
        selectCurrentGenderRatio: state => state.currentRatio,
        selectCountSinceLastRatioChange: state => state.countSinceLastRatioChange,
        selectFemaleIndex: state => state.femaleIndex,
        selectMaleIndex: state => state.maleIndex,
    },
})

export const {
    addScore,
    setScore,
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
} = gameSlice.actions;

export const {
    selectPointsPlayed,
    selectHomeScore,
    selectAwayScore,
    selectStartingRatio,
    selectCountSinceLastRatioChange,
    selectFemaleIndex,
    selectMaleIndex,
    selectCurrentGenderRatio,
} = gameSlice.selectors;

export default gameSlice.reducer;
