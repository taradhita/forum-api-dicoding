const GetThreadById = require('../GetThreadById');

describe('a GetThreadById entities', () => {
  it('should throw error when payload did not exist', () => {
    const params = {
      threadId: '',
    };

    expect(() => new GetThreadById(params).toThrowError('GET_THREAD_BY_ID.NOT_CONTAIN_NEEDED_PARAMS'));
  });
});
