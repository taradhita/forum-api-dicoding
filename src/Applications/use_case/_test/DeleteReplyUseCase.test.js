const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedDeletedReply = {
      id: 'reply-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkIfReplyExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByUser = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockReplyRepository.checkIfReplyExist).toBeCalledWith({
      commentId: useCasePayload.commentId, replyId: useCasePayload.replyId,
    });
    expect(mockReplyRepository.verifyReplyByUser).toBeCalledWith({
      replyId: useCasePayload.replyId, owner: useCasePayload.owner,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(expectedDeletedReply.id);
  });
});
