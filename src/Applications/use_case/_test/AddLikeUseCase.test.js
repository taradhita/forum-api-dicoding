const AddLike = require('../../../Domains/likes/entities/AddLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it("should orchestrating the add like action correctly when like doesn't exist", async () => {
    const useCasePayload = {
      owner: 'user-123',
    };

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkIfCommentExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkIfLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await addLikeUseCase.execute(useCasePayload, useCaseParam);

    expect(mockLikeRepository.addLike).toBeCalledWith(new AddLike({
      commentId: useCaseParam.commentId,
      owner: useCasePayload.owner,
    }));
  });

  it('should orchestrating the dislike action correctly when like exist', async () => {
    const useCasePayload = {
      owner: 'user-123',
    };

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkIfCommentExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkIfLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await addLikeUseCase.execute(useCasePayload, useCaseParam);

    expect(mockLikeRepository.deleteLike).toBeCalledWith(new AddLike({
      commentId: useCaseParam.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
