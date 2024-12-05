const db = require('./db'); 

const savePreTestResult = async (studentId, questionId, answer, time, isCorrect, answerType) => {
    const result = await db.query(
        'INSERT INTO pre_test_results (student_id, question_id, answer, time_taken, is_correct, answer_type) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, questionId, answer, time, isCorrect, answerType]
    );
    return result.insertId; // Return the ID of the newly inserted result
};

const saveTestResult = async (studentId, questionId, answer, time, isCorrect, answerType) => {
    const result = await db.query(
        'INSERT INTO test_results (student_id, question_id, answer, time_taken, is_correct, answer_type) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, questionId, answer, time, isCorrect, answerType]
    );
    return result.insertId; // Return the ID of the newly inserted result
};

const savePostTestResult = async (studentId, questionId, answer, time, isCorrect, answerType) => {
    const result = await db.query(
        'INSERT INTO post_test_results (student_id, question_id, answer, time_taken, is_correct, answer_type) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, questionId, answer, time, isCorrect, answerType]
    );
    return result.insertId; // Return the ID of the newly inserted result
};

module.exports = {
    savePreTestResult,
    saveTestResult,
    savePostTestResult,
};
