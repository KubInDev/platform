const db = require('./db'); 

const findMaxStudentId = async() => {
    const maxStudentId = await db.query('SELECT MAX(student_id) FROM results');
    return maxStudentId;
}

module.exports = {
    findMaxStudentId,
    
};