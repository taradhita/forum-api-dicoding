class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, commentId, content, date, username, isDelete,
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDelete = isDelete;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({
    id,
    commentId,
    content,
    date,
    username,
    isDelete,
  }) {
    return (!id || !commentId || !content || !date || !username || isDelete === undefined);
  }

  _isPayloadNotMeetDataTypeSpecification({
    id,
    commentId,
    content,
    date,
    username,
    isDelete,
  }) {
    return (
      typeof id !== 'string'
      || typeof commentId !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof isDelete !== 'boolean'
    );
  }
}

module.exports = GetReply;
