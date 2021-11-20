const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedThread = new GetThread({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new GetComment({
        id: 'comment-123',
        username: 'user',
        date: '2021-09-08T07:19:09.775Z',
        content: 'comment 1',
        // replies: [],
      }),
      new GetComment({
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-09-08T09:19:09.775Z',
        content: 'comment 2',
        // replies: [],
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const retrievedThread = await getThreadUseCase.execute(useCaseParam);

    expect(retrievedThread).toEqual(new GetThread({
      ...expectedThread, comments: expectedComments,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});