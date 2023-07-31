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
        updatePlayerName: (state, action: PayloadAction<{ id: number, name: string }>) => {
            const { id, name } = action.payload;
            const updatedPlayerList = state.players.map((item) => {
                if (item.id === id) {
                    // Merge the existing item with the updated data
                    const tempPlayer = { ...item };
                    tempPlayer.name = name
                    return { ...item, ...tempPlayer };
                }
                return item;
            });

            localStorage.setItem('players', JSON.stringify(updatedPlayerList));

            return {
                ...state,
                players: updatedPlayerList,
            };
        },
    },
})

export const { addPlayer, removePlayer, updatePlayerName } = rosterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayers = (state: RootState) => state.roster.players;

export default rosterSlice.reducer
