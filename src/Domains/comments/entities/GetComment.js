class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDelete, replies, likeCount,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDelete = isDelete;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({
    id,
    content,
    date,
    username,
    isDelete,
    replies,
    likeCount,
  }) {
    return (
      !id
      || !content
      || !date
      || !username
      || isDelete === undefined
      || !replies
      || likeCount === undefined
    );
  }

  _isPayloadNotMeetDataTypeSpecification({
    id,
    content,
    date,
    username,
    isDelete,
    replies,
    likeCount,
  }) {
    return (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof isDelete !== 'boolean'
      || !(Array.isArray(replies))
      || typeof likeCount !== 'number'
    );
  }
}

module.exports = GetComment;
