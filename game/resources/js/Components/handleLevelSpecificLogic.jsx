const handleLevelSpecificLogic = ({ level, rows, cols, flippedCells, selectedCells }) => {
    if (level >= 3 && level < 20) {
        const randomIndex = getRandomIndex(flippedCells);
        flippedCells[randomIndex] = false;
        return { flippedCells };
    } else if (level >= 20) {
        setTimeout(() => {
            const newFlippedCells = Array(rows * cols).fill(false);
            return { flippedCells: newFlippedCells, selectedCells: [] };
        }, 100);
    }
     return { flippedCells, selectedCells };
};

const getRandomIndex = (flippedCells) => {
    const flippedIndexes = flippedCells.reduce((acc, cell, index) => {
        if (cell) acc.push(index);
        return acc;
    }, []);
    return flippedIndexes[Math.floor(Math.random() * flippedIndexes.length)];
};

export default handleLevelSpecificLogic;
