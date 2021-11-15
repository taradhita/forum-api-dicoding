const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'comment body',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addcomment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addcomment).toBeCalledWith(
      new AddComment({
        threadId: 'comment-123',
        content: useCasePayload.content,
      }), useCasePayload.owner,
    );
  });
});
