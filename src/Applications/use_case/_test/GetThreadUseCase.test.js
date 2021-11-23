const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
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
        replies: [],
      }),
      new GetComment({
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-09-08T09:19:09.775Z',
        content: 'comment 2',
        replies: [],
      }),
    ];

    const expectedReplies = [
      new GetReply({
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-09-08T07:19:09.775Z',
        content: 'reply 1',
        commentId: 'comment-123',
      }),
      new GetReply({
        id: 'reply-456',
        username: 'user',
        date: '2021-09-08T09:19:09.775Z',
        content: 'reply 2',
        commentId: 'comment-456',
      }),
    ];

    const { commentId: commentReplyA, ...replyDetailsA } = expectedReplies[0];
    const { commentId: commentReplyB, ...replyDetailsB } = expectedReplies[1];

    const expectedCommentsAndReplies = [
      { ...expectedComments[0], replies: [replyDetailsA] },
      { ...expectedComments[1], replies: [replyDetailsB] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const retrievedThread = await getThreadUseCase.execute(useCaseParam);

    //console.log(retrievedThread);

    expect(retrievedThread).toEqual(new GetThread({
      ...expectedThread, comments: expectedCommentsAndReplies,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});