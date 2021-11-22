const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async() => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /*const useCasePayload = {
      owner: 'user-123',
    };*/

    const expectedDeletedComment = {
      id: 'comment-123',
    }; 

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkIfCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentByUser = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockCommentRepository.checkIfCommentExist).toBeCalledWith({
      threadId: useCasePayload.threadId, commentId: useCasePayload.commentId,
    });
    expect(mockCommentRepository.verifyCommentByUser).toBeCalledWith({
      owner: useCasePayload.owner, commentId: useCasePayload.commentId,
    });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(expectedDeletedComment.id);
  });
});