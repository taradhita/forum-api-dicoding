class AddReply {
  constructor(payload){
    this._verifyPayload(payload);

    const { content, owner, commentId } = payload;

    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload({ content, owner, commentId }) {
    if (!content || !owner || !commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
