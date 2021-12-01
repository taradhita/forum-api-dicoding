const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
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
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      const addReply = new AddReply({
        content: 'dicoding content',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const addReply = new AddReply({
        content: 'dicoding content',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'dicoding content',
        owner: 'user-123',
      }));
    });

    it('should return error when comment not found', async () => {
      const addReply = new AddReply({
        content: 'dicoding content',
        commentId: 'comment-456',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.addReply(addReply))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return error when thread not found', async () => {
      const addReply = new AddReply({
        content: 'dicoding content',
        commentId: 'comment-456',
        owner: 'user-123',
        threadId: 'thread-456',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.addReply(addReply))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return all replies from thread correctly', async () => {
      await CommentsTableTestHelper.addComments({
        id: 'comment-456',
        content: 'comment content',
        owner: 'user-123',
      });

      const firstReply = {
        id: 'reply-123', date: '2020-01-01', commentId: 'comment-123', content: 'first reply', isDelete: false,
      };
      const secondReply = {
        id: 'reply-456', date: '2020-10-01', commentId: 'comment-456', content: 'second reply', isDelete: false,
      };

      await RepliesTableTestHelper.addReply(firstReply);
      await RepliesTableTestHelper.addReply(secondReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      const getReply = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      expect(getReply).toEqual([
        { ...firstReply, username: 'user' }, { ...secondReply, username: 'user' }]);
    });
  });

  describe('checkIfReplyExist function', () => {
    it('should resolve if comment exists', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      await expect(replyRepositoryPostgres.checkIfReplyExist({ commentId: 'comment-123', replyId: 'reply-123' }))
        .resolves.toBeUndefined();
    });

    it('should reject if comment does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      await expect(replyRepositoryPostgres.checkIfReplyExist({ commentId: 'comment-123', replyId: 'reply-456' }))
        .rejects.toThrowError(NotFoundError);
    });

    it('should reject if comment is already deleted', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        isDelete: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      await expect(replyRepositoryPostgres.checkIfReplyExist({ commentId: 'comment-123', replyId: 'reply-456' }))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyByUser function', () => {
    it('should not throw error if user has authorization', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      await expect(replyRepositoryPostgres.verifyReplyByUser({
        replyId: 'reply-123', owner: 'user-123',
      })).resolves.toBeUndefined();
    });

    it('should throw error if user has no authorization', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      await expect(replyRepositoryPostgres.verifyReplyByUser({
        replyId: 'reply-123', owner: 'user-456',
      })).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply correctly', async () => {
      const addedReply = {
        id: 'reply-123',
        commentId: 'comment-123',
      };

      await RepliesTableTestHelper.addReply({
        id: addedReply.id, commentId: addedReply.commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReplyById(addedReply.id);

      const [reply] = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(reply.is_delete).toEqual(true);
    });

    it('should throw error when reply that wants to be deleted does not exist', async () => {
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReplyById(replyId))
        .rejects.toThrowError(NotFoundError);
    });
  });
});
