import GenericTest from './GenericTest';

const PostTest = () => {
    const questionConfig = [{ difficulty: 'hard', limit: 3 }];

    return <GenericTest testType="post-test" questionConfig={questionConfig} nextPage="/results" />;
};

export default PostTest;
