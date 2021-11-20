/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComments({
    id = 'comment-123', idThread = 'thread-123', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', content = 'comment content', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, idThread, owner, date, content, isDelete],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
