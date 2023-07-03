import { Button, Container } from '@mui/material';
import { useAppSelector, useAppDispatch } from './hooks';
import { decrement, increment } from './counterSlice';
import { useNavigate } from 'react-router-dom';

function Counter() {
    // The `state` arg is correctly typed as `RootState` already
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
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
            <Button
                variant="contained"
                onClick={handleBack}
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

export default Counter;
