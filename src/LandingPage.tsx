import React, { useState } from 'react';
import { Button, Container, TextField } from '@mui/material';
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
        navigate("/lineup");
    };

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
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
                    margin: '1rem',
                }}
            >
                New game
            </Button>
            <Button
                variant="contained"
                onClick={() => navigate("/roster")}
                fullWidth
                sx={{
                    margin: '1rem',
                }}
            >
                Edit Roster
            </Button>
        </Container>
    );
}

export default LandingPage;
