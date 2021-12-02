const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      content: 'comment body',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkIfCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
        threadId: 'thread-123',
      }),
    );
  });
});
