const LikeRepository = require('../../Domains/likes/LikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLike) {
    const id = `like-${this._idGenerator(10)}`;
    const { commentId, owner } = addLike;

    const query = {
      text: 'INSERT INTO likes (id, id_comment, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async checkIfLikeExist({ commentId, owner }) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE id_comment = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async deleteLike({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE id_comment = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('tidak bisa menghapus like karena like tidak ada');
    }
  }

  async getLikeCountByComment(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE id_comment = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }
}

module.exports = LikeRepositoryPostgres;
