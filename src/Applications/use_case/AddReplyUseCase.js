const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      content, commentId, owner, threadId,
    } = useCasePayload;
    await this._commentRepository.checkIfCommentExist({
      threadId, commentId,
    });
    const addReply = new AddReply({
      content,
      commentId,
      owner,
      threadId,
    });
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
