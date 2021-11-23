class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, replies
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  _verifyPayload({
    id,
    content,
    date,
    username,
    replies
  }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !(Array.isArray(replies))
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
