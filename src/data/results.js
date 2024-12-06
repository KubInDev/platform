const db = require('./db'); 

const saveTestResult = async (tableName, studentId, questionId, answer, time, isCorrect, answerType) => {

    try {
        const result = await db.query(
            `INSERT INTO ${tableName} (student_id, question_id, answer, time, isCorrect, answerType) VALUES (?, ?, ?, ?, ?, ?)`,
            [studentId, questionId, answer, time, isCorrect, answerType]
        );
        console.log('Query executed successfully:', result);
        return result.insertId;
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err; // Rethrow the error to the calling function
    }
};



module.exports = {
    saveTestResult,
};
