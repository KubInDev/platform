// questions.js
const db = require('./db'); // Import the database connection

// Function to fetch questions by difficulty
const getQuestionsByDifficulty = async (difficulty) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE difficulty = ?', [difficulty]);
    return rows;
};

const getRandomQuestionsByDifficulty = async (difficulty, limit) => {
    const [rows] = await db.query(
        'SELECT * FROM questions WHERE difficulty = ? ORDER BY RAND() LIMIT ?',
        [difficulty, limit]
    );
    return rows;
};


module.exports = {
    getQuestionsByDifficulty,
    getRandomQuestionsByDifficulty,
};
