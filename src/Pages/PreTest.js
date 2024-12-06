import GenericTest from './GenericTest';

const PreTest = () => {
    const questionConfig = [{ difficulty: 'easy', limit: 3 }];

    return <GenericTest testType="pre-test" questionConfig={questionConfig} nextPage="/main-test" />;
};

export default PreTest;
