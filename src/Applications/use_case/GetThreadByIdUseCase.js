const GetThreadById = require('../../Domains/threads/entities/GetThreadById');

class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(params) {
    const getThread = new GetThreadById(params);
    await this._threadRepository.verifyThreadById(getThread.threadId);
    const getDetailThread = await this._threadRepository.getThread(getThread.threadId);
    return getDetailThread;
  }
}

module.exports = GetThreadByIdUseCase;
