const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, owner) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads(id, title, body, owner) VALUES($1,$2,$3,$4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  // get thread here
  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
              FROM threads 
              INNER JOIN users ON threads.owner = users.id
              WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async isThreadAvailable(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const isThread = await this._pool.query(query);

    if (!isThread.rowCount) {
      throw new NotFoundError('comment gagal ditambahkan: thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
