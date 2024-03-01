import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import chessTheme from '@/themes/chessTheme';

function MemoryGame({ auth }) {
    const { rows, cols, icons } = chessTheme;

    const [flippedCells, setFlippedCells] = useState(Array(rows * cols).fill(false));
    const [selectedCells, setSelectedCells] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const [pieces, setPieces] = useState([]);
    const [level, setLevel] = useState(1);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isGameCompleted, setIsGameCompleted] = useState(false);

    useEffect(() => {
        const generateRandomPieces = () => {
            const pairsNeeded = rows * cols / 2;
            const pieces = [];
            const shuffledIcons = [...icons, ...icons].sort(() => Math.random() - 0.5); // Shuffle icons
            for (let i = 0; i < pairsNeeded; i++) {
                const pieceIndex = i * 2;
                const piece1 = shuffledIcons[pieceIndex];
                const piece2 = shuffledIcons[pieceIndex + 1];
                pieces.push(piece1, piece2); // Each pair consists of one black and one white piece
            }
            setPieces(pieces);
        };

        generateRandomPieces();
    }, []);

    useEffect(() => {
        const allFlipped = flippedCells.every(cell => cell);
        if (allFlipped) {
            setIsGameCompleted(true);
            return;
        }

        if (startTime && !isGameCompleted) {
            const intervalId = setInterval(() => {
                setCurrentTime(Date.now() - startTime);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [flippedCells, rows, cols, icons, startTime, isGameCompleted]);

    const handleCellClick = (index) => {
        if (!pieces.length) {
            console.log("error");
            return;
        }
        if (!startTime) {
            setStartTime(Date.now());
        }
        
        if (isLocked || selectedCells.length === 2 || flippedCells[index]) return;

        setFlippedCells((prevState) => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });

        setSelectedCells((prevState) => [...prevState, index]);

        if (selectedCells.length === 1) {
            setIsLocked(true);
            if (pieces[selectedCells[0]] === pieces[index]) {
                setTimeout(() => {
                    setSelectedCells([]);
                    setIsLocked(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    setFlippedCells((prevState) => {
                        const newState = [...prevState];
                        newState[selectedCells[0]] = false;
                        newState[index] = false;
                        return newState;
                    });
                    setSelectedCells([]);
                    setIsLocked(false);
                }, 1000);
            }
        }
    };

    const formattedTime = new Date(currentTime).toISOString().substr(14, 5);

    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const index = i * cols + j;
            row.push(
                <div
                    key={index}
                    className={`cell ${flippedCells[index] ? 'flipped' : ''} ${selectedCells.includes(index) ? 'selected' : ''}`}
                    onClick={() => handleCellClick(index)}
                >
                    {flippedCells[index] ? <span><FontAwesomeIcon icon={pieces[index]} /></span> : null}
                </div>
            );
        }
        grid.push(
            <div key={i} className="row">
                {row}
            </div>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="">Memory Game</h2>}>
            <Head title="Memory Game" />
            <div className='game'>
                <div className="grid-container">
                    <div className='game-indicator'>
                        <div>
                            Level: {level}
                        </div>
                        <div>
                            Time: {formattedTime}
                        </div>
                        {isGameCompleted && (
                            <div>
                                Game completed!
                            </div>
                        )}
                    </div>

                    <div className="grid-background">{grid}</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default MemoryGame;
