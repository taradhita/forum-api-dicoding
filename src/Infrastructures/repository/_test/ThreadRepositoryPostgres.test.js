const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      const addThread = new AddThread({
        title: 'dicoding title',
        body: 'dicoding body',
        // owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user',
        fullname: 'Dicoding Indonesia',
      });

      await threadRepositoryPostgres.addThread(addThread, 'user-123');

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return addded thread correctly', async () => {
      const addThread = new AddThread({
        title: 'dicoding title',
        body: 'dicoding body',
        // owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user',
        fullname: 'Dicoding Indonesia',
      });

      const addedThread = await threadRepositoryPostgres.addThread(addThread, 'user-123');

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return error when thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await expect(threadRepositoryPostgres.getThreadById('thread-456'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      const newThread = {
        id: 'thread-123', title: 'lorem ipsum', body: 'dolor sit amet', owner: 'user-123', date: '2021-09-08T07:19:09.775Z',
      };
      const expectedThread = {
        id: 'thread-123',
        title: 'lorem ipsum',
        date: '2021-09-08T07:19:09.775Z',
        username: 'dicoding',
        body: 'dolor sit amet',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(newThread);

      const getThread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(getThread).toStrictEqual(expectedThread);
    });
  });
});
