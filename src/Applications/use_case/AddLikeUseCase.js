const AddLike = require('../../Domains/likes/entities/AddLike');

class AddLikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    const { owner } = useCasePayload;
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.isThreadAvailable(threadId);
    await this._commentRepository.checkIfCommentExist({
      threadId, commentId,
    });

    const addLike = new AddLike({
      commentId,
      owner,
    });

    if (await this._likeRepository.checkIfLikeExist({ commentId, owner })) {
      await this._likeRepository.deleteLike({ commentId, owner });
    } else {
      await this._likeRepository.addLike(addLike);
    }
  }
}

module.exports = AddLikeUseCase;
