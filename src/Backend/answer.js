const db = require('./db');

// Validate Binary Feedback
const validateBinary = (correctAnswer, userAnswer, answerType) => {
    if (answerType === 'linear') {
        const isValid = correctAnswer === userAnswer.trim();
        return {
            isValid,
            message: isValid ? 'Correct!' : 'Wrong!',
        };
    } else if (answerType === 'description') {
        return {
            isValid: null, // Examiner must validate
            message: 'Awaiting examiner validation...',
        };
    }
    throw new Error('Invalid answer type for binary feedback');
};

// Validate Gradual Feedback
const validateGradual = (correctAnswer, userAnswer, answerType) => {
    if (answerType === 'linear') {
        const similarity = calculateSimilarity(correctAnswer, userAnswer.trim());
        const isValid = similarity >= 0.8; // Consider valid if 80% or more similar
        const score = Math.round(similarity * 100); // Score as a percentage of similarity
        return {
            isValid,
            score,
            message: isValid ? 'Correct!' : `Close! You scored ${score}/100.`,
        };
    } else if (answerType === 'description') {
        return {
            isValid: null, // Examiner must provide a score
            message: 'Awaiting examiner score...',
        };
    }
    throw new Error('Invalid answer type for gradual feedback');
};

// Calculate Similarity
const calculateSimilarity = (str1, str2) => {
    const length = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return 1 - distance / length; // Similarity as a fraction
};

// Levenshtein Distance Function
const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => Array(a.length + 1).fill(0));
    for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] =
                b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
        }
    }

    return matrix[b.length][a.length];
};

// Validate Answer Function
const validateAnswer = async (feedbackType, testType, questionId, userAnswer, answerType, answerId, isValid = null, score = null) => {
    console.log('Validating Answer:', { feedbackType, testType, questionId, userAnswer, answerType, answerId, isValid, score });

    if (!answerId) {
        throw new Error('Answer ID is undefined. Cannot perform validation.');
    }

    try {
        const tableName =
            testType === 'pre-test'
                ? 'pretest_results'
                : testType === 'main-test'
                ? 'test_results'
                : 'posttest_results';

        let validationResult;

        if (answerType === 'description') {
            // Description type answers always await manual validation
            if (feedbackType === 'binary') {
                validationResult = {
                    isValid: isValid !== null ? isValid : null, // Await examiner validation for binary
                    score: isValid ? 100 : 0,
                };
            } else if (feedbackType === 'gradual') {
                validationResult = {
                    isValid: isValid !== null ? isValid : null, // Await examiner score for gradual
                    score: score !== null ? score : 0,
                };
            } else {
                throw new Error('Invalid feedback type for description.');
            }

            // Update the database
            const updateResult = await db.query(
                `
                UPDATE ${tableName}
                SET isCorrect = ?, score = ?
                WHERE id = ?
                `,
                [
                    validationResult.isValid !== null ? (validationResult.isValid ? 1 : 0) : null,
                    validationResult.score,
                    answerId,
                ]
            );

            console.log('Pending Examiner Validation Update Result:', updateResult);
            return validationResult;
        }

        // For linear type answers, fetch the correct answer
        const [question] = await db.query('SELECT correct_answer FROM questions WHERE id = ?', [questionId]);

        if (!question || question.length === 0) {
            throw new Error('Invalid question ID');
        }

        const correctAnswer = question[0].correct_answer;

        if (feedbackType === 'binary') {
            validationResult = validateBinary(correctAnswer, userAnswer, answerType);
        } else if (feedbackType === 'gradual') {
            validationResult = validateGradual(correctAnswer, userAnswer, answerType);
        } else {
            throw new Error('Invalid feedback type for linear answers.');
        }

        // Update the database with validation results
        const updateResult = await db.query(
            `
            UPDATE ${tableName}
            SET isCorrect = ?, score = ?
            WHERE id = ?
            `,
            [
                validationResult.isValid !== null ? (validationResult.isValid ? 1 : 0) : null,
                validationResult.score || 0,
                answerId,
            ]
        );

        console.log('Update Result:', updateResult);
        return validationResult;
    } catch (err) {
        console.error('Error validating answer:', err);
        throw err;
    }
};


module.exports = { validateAnswer };
