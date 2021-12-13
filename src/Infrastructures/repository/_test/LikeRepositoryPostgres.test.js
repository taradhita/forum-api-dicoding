const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikesRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user',
      fullname: 'Dicoding Indonesia',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });

    await CommentsTableTestHelper.addComments({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add comment', async () => {
      const addLike = new AddLike({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLike(addLike);

      const comments = await LikesTableTestHelper.getLikeByCommentAndOwner({ commentId: 'comment-123', owner: 'user-123' });
      expect(comments).toStrictEqual({
        id: 'like-123',
        id_comment: 'comment-123',
        owner: 'user-123',
      });
    });
  });

  describe('checkIfLikeExist', () => {
    it('checkIfLikeExist should return true if like exists', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeRepositoryPostgres.checkIfLikeExist({ commentId: 'comment-123', owner: 'user-123' });
      expect(statusCheck).toEqual(true);
    });

    it('checkIfLikeExist should return false if like does not exists', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const statusCheck = await likeRepositoryPostgres.checkIfLikeExist({ commentId: 'comment-456', owner: 'user-456' });
      expect(statusCheck).toEqual(false);
    });
  });

  describe('deleteLike', () => {
    it('deleteLike should not throw error when deleting like', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      await expect(likeRepositoryPostgres.deleteLike({ commentId: 'comment-123', owner: 'user-123' })).resolves.not.toThrowError();
    });
    it('deleteLike should throw error when deleting nonexistent like', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      await expect(likeRepositoryPostgres.deleteLike({ commentId: 'comment-123', owner: 'user-123' })).rejects.toThrowError();
    });
  });

  describe('getLikeCountByComment', () => {
    it('getLikeCountByComment should get the right like count if like exist', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const likeCount = await likeRepositoryPostgres.getLikeCountByComment('comment-123');
      expect(likeCount).toEqual(1);
    });

    it('getLikeCountByComment should get 0 like count if there is no like', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
      const likeCount = await likeRepositoryPostgres.getLikeCountByComment('comment-123');
      expect(likeCount).toEqual(0);
    });
  });
});
