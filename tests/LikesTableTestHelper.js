/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', commentId = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes (id, id_comment, owner) VALUES ($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async getLikeByCommentAndOwner({ commentId = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'SELECT * FROM likes WHERE id_comment = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
