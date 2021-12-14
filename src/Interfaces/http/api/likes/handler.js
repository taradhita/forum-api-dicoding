const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const useCasePayload = {
      owner: request.auth.credentials.id,
    };

    const useCaseParam = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    };

    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
    await addLikeUseCase.execute(useCasePayload, useCaseParam);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = LikesHandler;
