import React from 'react';

const GameOverScreen = ({ level, points, onRetry }) => {
    return (
        <div className="game-over">
            <h3>Game Over!</h3>
            <p>You reached level {level} with {points} points.</p>
            <button className='start-button' onClick={onRetry}>Retry</button>
        </div>
    );
};

export default GameOverScreen;
