const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const expectedGetThread = new GetThread({
      id: useCaseParams.threadId,
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-09T07:19:09.775Z',
      owner: 'abc',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    const getThread = await getThreadByIdUseCase.execute(useCaseParams);

    expect(getThread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCaseParams.threadId);
  });
});
