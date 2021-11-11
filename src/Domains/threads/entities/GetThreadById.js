class GetThreadById {
  constructor(params) {
    this._verifyParams(params);

    this.threadId = params.threadId;
  }

  _verifyParams(params) {
    const { threadId } = params;
    if (threadId === '' || !threadId) {
      throw new Error('GET_THREAD_BY_ID.NOT_CONTAIN_NEEDED_PARAMS');
    }
  }
}

module.exports = GetThreadById;
