import React from 'react';

function LevelCompletePopup({ onNextLevel, onGiveUp }) {
    return (
        <div className="level-complete-popup">
            <h3>Level Completed!</h3>
            <div className='level-options'>
                <button className='start-button' onClick={onNextLevel}>Next Level</button>
                <button className='start-button' onClick={onGiveUp}>Give Up</button>
            </div>
        </div>
    );
}

export default LevelCompletePopup;
