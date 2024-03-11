import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

function StartScreen({ onStart }) {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartClick = () => {
        setGameStarted(true);
        onStart();
    };

    return (
        <div className="start-screen">
            {!gameStarted && (
                <div className='start-sreen-content'>
                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />

                    <h2>Welcome to Memory Game!</h2>
                    <p>Press the button below to start the game.</p>
                    <button className='start-button' onClick={handleStartClick}>Start</button>
                </div>
            )}
        </div>
    );
}

export default StartScreen;
