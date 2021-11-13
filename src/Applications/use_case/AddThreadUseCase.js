const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread({ title: useCasePayload.title, body: useCasePayload.body });
    return this._threadRepository.addThread(addThread, useCasePayload.owner);
  }
}

module.exports = AddThreadUseCase;
