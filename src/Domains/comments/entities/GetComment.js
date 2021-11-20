class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({
    id,
    content,
    date,
    username,
  }) {
    if (!id || !content || !date || !username ) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
