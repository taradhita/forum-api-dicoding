const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const getThread = await getThreadUseCase.execute(request.params);

    return h.response({
      status: 'success',
      data: {
        thread: getThread,
      },
    });
  }
}

module.exports = ThreadsHandler;
