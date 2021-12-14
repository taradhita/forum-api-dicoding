const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GetReply = require('../../Domains/replies/entities/GetReply');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      commentId, content, owner, threadId,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies(id, content, owner, id_comment) VALUES($1,$2,$3,$4) RETURNING id, content, owner',
      values: [id, content, owner, commentId],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, comments.id AS id_comment, 
              replies.is_delete, replies.content, replies.date, users.username 
              FROM replies 
              INNER JOIN comments ON replies.id_comment = comments.id
              INNER JOIN users ON replies.owner = users.id
              WHERE comments.id_thread = $1
              ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((entry) => new GetReply({
      ...entry, commentId: entry.id_comment, isDelete: entry.is_delete,
    }));
  }

  async checkIfReplyExist({ commentId, replyId }) {
    const query = {
      text: `SELECT 1 
      FROM replies
      INNER JOIN comments ON replies.id_comment = comments.id
      WHERE replies.id = $1
      AND replies.id_comment = $2
      AND replies.is_delete = false`,
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('reply tidak ada');
    }
  }

  async verifyReplyByUser({ replyId, owner }) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE id = $1 and owner = $2',
      values: [replyId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak melakukan aksi tersebut pada reply ini');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete=TRUE WHERE id=$1 returning id',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('reply yang ingin Anda hapus tidak ada');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
