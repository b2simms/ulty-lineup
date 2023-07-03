import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Player } from './Player'

// Define a type for the slice state
interface RosterState {
    players: Player[],
}

// Load initial state from storage
const storedPlayers = localStorage.getItem('players');
const initialPlayers: Player[] = storedPlayers ? JSON.parse(storedPlayers) : [];

const initialState: RosterState = {
    players: initialPlayers,
}

export const rosterSlice = createSlice({
    name: 'roster',
    initialState,
    reducers: {
        addPlayer: (state, action: PayloadAction<Player>) => {
            const { id, name, gender } = action.payload;
            if (name.trim() !== '') {
                const newPlayer: Player = {
                    id,
                    name,
                    gender,
                };
                state.players = [...state.players, newPlayer];
            }
            localStorage.setItem('players', JSON.stringify(state.players));
        },
        removePlayer: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.players = state.players.filter(player => player.id !== id);
            localStorage.setItem('players', JSON.stringify(state.players));
        },
    },
})

export const { addPlayer, removePlayer } = rosterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayers = (state: RootState) => state.roster.players;

export default rosterSlice.reducer
