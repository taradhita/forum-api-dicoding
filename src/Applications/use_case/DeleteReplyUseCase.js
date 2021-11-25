class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { replyId, commentId, owner } = useCasePayload;
    await this._replyRepository.checkIfReplyExist({ commentId, replyId });
    await this._replyRepository.verifyReplyByUser({ replyId, owner });
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
