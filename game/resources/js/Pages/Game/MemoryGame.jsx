import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useSound from 'use-sound';
import flipped from '../../../audio/flipped.wav';
import chessTheme from '@/themes/chessTheme';
import StartScreen from '../../Components/StartScreen';
import GameOverScreen from '../../Components/GameOverScreen';
import WinnerScreen from '../../Components/WinnerScreen';
import LevelCompletePopup from '../../Components/LevelCompletePopup';

function MemoryGame({ auth }) {
    const { rows, cols, icons, colors } = chessTheme;
    const maxLevel = 20;

    const [level, setLevel] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [flippedCells, setFlippedCells] = useState(Array(rows * cols).fill(false));
    const [selectedCells, setSelectedCells] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const [pieces, setPieces] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(180 * 1000);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [correctCells, setCorrectCells] = useState([]);
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);
    const [pairOrderVisible, setPairOrderVisible] = useState(true);
    const [levelFinished, setLevelFinished] = useState(false);
    const [completedDueToGiveUp, setCompletedDueToGiveUp] = useState(false);
    
    
    const { data, setData, post, processing, errors, reset } = useForm({
        points: '',
        time: '',
        level: '',
    });

    const [playFlippedSound] = useSound(flipped);

    useEffect(() => {
        generateRandomPieces();
    }, []);

    useEffect(() => {
        if (pairOrderVisible && startTime === null  && gameStarted) {
            const timeoutId = setTimeout(() => {
                setPairOrderVisible(false);
                setStartTime(Date.now());
                setFlippedCells(Array(rows * cols).fill(true));
                setTimeout(() => {
                    setFlippedCells(Array(rows * cols).fill(false));
                }, 2000 - (level * 5));
            }, 1200);
            return () => clearTimeout(timeoutId);
        }
    }, [pairOrderVisible, startTime, rows, cols, level]);

    console.log(180-(currentTime/1000))

    useEffect(() => {
        if (startTime !== null && !isGameCompleted) {
            const intervalId = setInterval(() => {
                setCurrentTime(prevTime => prevTime - 1000);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [startTime, currentTime, isGameCompleted]);

    useEffect(() => {
        if (startTime !== null && currentTime <= 0) {
            setIsGameCompleted(true);
        }
    }, [startTime, currentTime]);

    useEffect(() => {
        setData({
            points: points,
            level: level,
            time: 180-(currentTime/1000),
        });
        
        if (isGameCompleted || levelFinished) {
            // console.log(data)
            post(route('postScore'), {
                data
            });
        }
    }, [isGameCompleted, levelFinished]);

    useEffect(() => {
        const allFlipped = correctCells.length === rows * cols;
        if (allFlipped) {
            setLevelFinished(true);
        } else if (selectedCells.length === 2) {
            const timeoutId = setTimeout(() => {
                const areSelectedCellsCorrect = pieces[selectedCells[0]].icon === pieces[selectedCells[1]].icon &&
                    pieces[selectedCells[0]].color === pieces[selectedCells[1]].color;
                if (!areSelectedCellsCorrect) {
                    closeIncorrectPair(selectedCells[0], selectedCells[1]);
                }
                setSelectedCells([]);
                setIsLocked(false);
            }, 1000);
            return () => clearTimeout(timeoutId);
        } else if (selectedCells.length === 1) {
            const timeoutId = setTimeout(() => {
                setSelectedCells([]);
                setFlippedCells(flippedCells => flippedCells.map((cell, index) => {
                    return correctCells.includes(index) ? cell : false;
                }));
                setIsLocked(false);
            }, 1500 - (level * (level * 2)));
            return () => clearTimeout(timeoutId);
        }
    }, [correctCells, rows, cols, level, selectedCells]);

    const generateRandomPieces = () => {
        const pairsNeeded = rows * cols / 2;
        const newPieces = [];
        const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);
        const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

        for (let i = 0; i < pairsNeeded; i++) {
            const iconIndex = i % icons.length;
            const icon = shuffledIcons[iconIndex];
            const piece1 = { icon, color: shuffledColors[0] };
            const piece2 = { icon, color: shuffledColors[1] };
            newPieces.push(piece1, piece2);
        }

        for (let i = newPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
        }

        setPieces(newPieces);
    };

    const handleCellClick = (index) => {
        if (isLocked || selectedCells.length === 2 || flippedCells[index]) return;
        playFlippedSound();

        if (startTime === null) {
            setStartTime(Date.now());
        }

        setFlippedCells((prevState) => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });

        setSelectedCells((prevState) => [...prevState, index]);

        if (selectedCells.length === 1) {
            setIsLocked(true);
            const selectedPiece1 = pieces[selectedCells[0]];
            const selectedPiece2 = pieces[index];

            if (selectedPiece1.icon === selectedPiece2.icon && selectedPiece1.color === selectedPiece2.color) {
                setCorrectCells((prevState) => [...prevState, selectedCells[0], index]);
                setPoints(prevPoints => prevPoints + (2 * level * (streak + 1)));
                setStreak(prevStreak => prevStreak + 1);
                setTimeout(() => {
                    setSelectedCells([]);
                    setIsLocked(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    closeIncorrectPair(selectedCells[0], index);
                    setSelectedCells([]);
                    setIsLocked(false);
                    setStreak(0);
                }, 500);
            }
        }
    };

    const closeIncorrectPair = (index1, index2) => {
        setFlippedCells((prevState) => {
            const newState = [...prevState];
            newState[index1] = false;
            newState[index2] = false;
            return newState;
        });
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
                    {flippedCells[index] ? (
                        <span>
                            <FontAwesomeIcon
                                icon={pieces[index].icon}
                                style={{ color: pieces[index].color }}
                            />
                        </span>
                    ) : null}
                </div>
            );
        }
        grid.push(
            <div key={i} className="row">
                {row}
            </div>
        );
    }

    const handleStartGame = () => {
        setGameStarted(true);
    };

    const handleRetry = () => {
        setLevel(1);
        setFlippedCells(Array(rows * cols).fill(false));
        setSelectedCells([]);
        setCorrectCells([]); 
        setIsGameCompleted(false); 
        setStartTime(null); 
        setCurrentTime(180 * 1000);
        setPoints(0); 
        setStreak(0);
        setPairOrderVisible(true);
        setLevelFinished(false);
        setCompletedDueToGiveUp(false); 
        generateRandomPieces(); 
        setData({
            points: points,
            level: level,
            time: 180-(currentTime/1000),
        });
    };

    const handleGiveUp = () => {
        setIsGameCompleted(true);
        setLevelFinished(true);
        setCompletedDueToGiveUp(true);
        setData({
            points: points,
            level: level,
            time: 180-(currentTime/1000),
        });
    };

    const handleNextLevel = () => {
        setLevel(prevLevel => prevLevel + 1);
        setFlippedCells(Array(rows * cols).fill(false));
        setSelectedCells([]);
        setCorrectCells([]);
        setIsGameCompleted(false);
        setStartTime(null);
        setCurrentTime(180 * 1000);
        setPoints(prevPoints => prevPoints + (level * 10));
        setStreak(0);
        setPairOrderVisible(true);
        setLevelFinished(false);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="">Memory Game</h2>}>
            <Head title="Memory Game" />
            {gameStarted && !isGameCompleted && !levelFinished ? (
                <div className='game'>
                    <div className="grid-container">
                        <div className='game-indicator'>
                            <div>
                                Level: {level}
                            </div>
                            <div>
                                Points: {points}
                            </div>
                            <div>
                                Time: {formattedTime}
                            </div>
                            <button className='button-give-up' onClick={handleGiveUp}>Give Up</button>
                        </div>
                        <div className="grid-background">{grid}</div>
                    </div>
                </div>
            ) : (
                !isGameCompleted && !levelFinished && <StartScreen onStart={handleStartGame} />
            )}
            
            {levelFinished && level < maxLevel && !completedDueToGiveUp && (
                <LevelCompletePopup onNextLevel={handleNextLevel} onGiveUp={handleGiveUp} />
            )}

            {isGameCompleted && level === maxLevel && !completedDueToGiveUp ? (
                <WinnerScreen />
            ) : (
                isGameCompleted && <GameOverScreen level={level} points={points} onRetry={handleRetry} />
            )}
        </AuthenticatedLayout>
    );
}

export default MemoryGame;
