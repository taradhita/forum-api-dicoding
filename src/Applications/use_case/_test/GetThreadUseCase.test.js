const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
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
        isDelete: false,
        replies: [],
        likeCount: 1,
      }),
      new GetComment({
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-10-08T09:19:09.775Z',
        content: '**komentar telah dihapus**',
        isDelete: true,
        replies: [],
        likeCount: 0,
      }),
    ];

    const expectedReplies = [
      new GetReply({
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-09-08T07:19:09.775Z',
        content: 'reply 1',
        isDelete: false,
        commentId: 'comment-123',
      }),
      new GetReply({
        id: 'reply-456',
        username: 'user',
        date: '2021-09-08T09:19:09.775Z',
        content: '**balasan telah dihapus**',
        isDelete: true,
        commentId: 'comment-456',
      }),
    ];

    const { isDelete: commentIsDeleteA, ...commentDetailsA } = expectedComments[0];
    const { isDelete: commentIsDeleteB, ...commentDetailsB } = expectedComments[1];

    const {
      commentId: commentReplyA, isDelete: replyIsDeleteA, ...replyDetailsA
    } = expectedReplies[0];
    const {
      commentId: commentReplyB, isDelete: replyIsDeleteB, ...replyDetailsB
    } = expectedReplies[1];

    const expectedCommentsAndReplies = [
      { ...commentDetailsA, replies: [replyDetailsA] },
      { ...commentDetailsB, replies: [replyDetailsB] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));
    mockLikeRepository.getLikeCountByComment = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-123' ? 1 : 0));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const retrievedThread = await getThreadUseCase.execute(useCaseParam);

    expect(retrievedThread).toEqual(new GetThread({
      ...expectedThread, comments: expectedCommentsAndReplies,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockLikeRepository.getLikeCountByComment).toBeCalledTimes(2);
  });
});
