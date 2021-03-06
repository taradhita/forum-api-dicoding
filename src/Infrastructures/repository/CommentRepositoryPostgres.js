const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { threadId, content, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, id_thread, owner, content) VALUES($1,$2,$3,$4) RETURNING id, content, owner',
      values: [id, threadId, owner, content],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id,
              comments.content,
              comments.is_delete,
              comments.date, 
              users.username
              FROM comments INNER JOIN users
              ON comments.owner = users.id
              WHERE comments.id_thread = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((entry) => new GetComment({
      ...entry, isDelete: entry.is_delete, replies: [], likeCount: 0,
    }));
  }

  async checkIfCommentExist({ threadId, commentId }) {
    const query = {
      text: ` SELECT 1
      FROM comments INNER JOIN threads ON comments.id_thread = threads.id
      WHERE threads.id = $1
      AND comments.id = $2
      AND comments.is_delete = FALSE
      `,
      values: [threadId, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ada');
    }
  }

  async verifyCommentByUser({ commentId, owner }) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('comment tidak ada');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete=TRUE WHERE id=$1 RETURNING id',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ada');
    }
  }
}

module.exports = CommentRepositoryPostgres;
