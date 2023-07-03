import React, { useState } from 'react';
import { Button, Container, TextField } from '@mui/material';
import { useAppSelector, useAppDispatch } from './hooks';
import { decrement, increment } from './counterSlice';
import { useNavigate } from 'react-router-dom';

interface FormData {
    userTeam: string;
    opponentTeam: string;
}

function LandingPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        userTeam: '',
        opponentTeam: '',
    });
    // The `state` arg is correctly typed as `RootState` already
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNewGame = () => {
        console.log('New game clicked!');
        console.log('User Team:', formData.userTeam);
        console.log('Opponent Team:', formData.opponentTeam);
        navigate("/roster");
    };

    const handleUp = () => {
        dispatch(increment());
    }

    const handleDown = () => {
        dispatch(decrement());
    }

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <p>
                Count: {count}
            </p>
            <Button
                onClick={handleUp}
                sx={{
                    marginTop: '1rem',
                }}
            >
                Up!
            </Button>
            <Button
                onClick={handleDown}
                sx={{
                    marginTop: '1rem',
                }}
            >
                Down!
            </Button>
            <TextField
                label="Your team name"
                name="userTeam"
                value={formData.userTeam}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{
                    marginBottom: '1rem',
                }}
            />
            <TextField
                label="Opponent's team name"
                name="opponentTeam"
                value={formData.opponentTeam}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{
                    marginBottom: '1rem',
                }}
            />
            <Button
                variant="contained"
                onClick={handleNewGame}
                fullWidth
                sx={{
                    marginTop: '1rem',
                }}
            >
                New game
            </Button>
        </Container>
    );
}

export default LandingPage;
