const db = require('./db'); 



// Save test result
const saveTestResult = async (tableName, studentId, questionId, answer, time, isCorrect, answerType, feedbackType) => {
    try {
        const [result] = await db.query(
            `INSERT INTO ${tableName} (student_id, question_id, answer, time, isCorrect, answerType, feedbackType) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [studentId, questionId, answer, time, isCorrect, answerType, feedbackType]
        );

        console.log('Save Test Result Query Result:', result); // Debug log
        return result.insertId; // This will now properly access insertId
    } catch (err) {
        console.error('Error saving test result:', err.message);
        throw err;
    }
};





// Fetch pending answers
const getPendingAnswers = async (tableName) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                pr.id, -- Include the primary key 'id' for validation
                pr.student_id,
                pr.question_id,
                pr.answer,
                q.question_text,
                q.correct_answer,
                pr.answerType,
                pr.feedbackType
            FROM 
                ${tableName} AS pr
            JOIN 
                questions AS q 
            ON 
                pr.question_id = q.id 
            WHERE 
                pr.isCorrect IS NULL
        `);
        return rows;
    } catch (err) {
        console.error(`Error fetching pending answers from ${tableName}:`, err);
        throw err;
    }
};



module.exports = {
    saveTestResult,
    getPendingAnswers,
};



