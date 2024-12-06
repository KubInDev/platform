import GenericTest from './GenericTest';

const MainTest = () => {
    const questionConfig = [
        { difficulty: 'easy', limit: 3 },
        { difficulty: 'medium', limit: 5 },
        { difficulty: 'hard', limit: 3 },
    ];

    return <GenericTest testType="main-test" questionConfig={questionConfig} nextPage="/post-test" />;
};

export default MainTest;
