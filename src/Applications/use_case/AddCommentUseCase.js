const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.isThreadAvailable(useCasePayload.threadId);
    const addComment = new AddComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    });
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
