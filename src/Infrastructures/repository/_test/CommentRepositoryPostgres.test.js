const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
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
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      const addComment = new AddComment({
        content: 'dicoding content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return addded comment correctly', async () => {
      const addComment = new AddComment({
        content: 'dicoding content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding content',
        owner: 'user-123',
      }));
    });
    /*
    it('should return error when thread not found', async () => {
      const addComment = new AddComment({
        content: 'dicoding content',
        threadId: 'thread-456',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.addComment(addComment))
        .rejects
        .toThrowError(NotFoundError);
    });
    */
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all comments from thread correctly', async () => {
      const firstComment = {
        id: 'comment-123', date: '2020-01-01', content: 'first comment', isDelete: true, replies: [],
      };
      const secondComment = {
        id: 'comment-456', date: '2020-10-01', content: 'second comment', isDelete: false, replies: [],
      };

      await CommentsTableTestHelper.addComments(firstComment);
      await CommentsTableTestHelper.addComments(secondComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      const getComment = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(getComment).toEqual([
        { ...firstComment, username: 'user' }, { ...secondComment, username: 'user' }]);
    });
  });

  describe('checkIfCommentExist function', () => {
    it('should resolve if comment exists', async () => {
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      await expect(commentRepositoryPostgres.checkIfCommentExist({ threadId: 'thread-123', commentId: 'comment-123' }))
        .resolves.toBeUndefined();
    });

    it('should reject if comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      await expect(commentRepositoryPostgres.checkIfCommentExist({ threadId: 'thread-123', commentId: 'comment-456' }))
        .rejects.toThrowError(NotFoundError);
    });

    it('should reject if comment is already deleted', async () => {
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      await expect(commentRepositoryPostgres.checkIfCommentExist({ threadId: 'thread-123', commentId: 'comment-456' }))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentByUser function', () => {
    it('should not throw error if user has authorization', async () => {
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      await expect(commentRepositoryPostgres.verifyCommentByUser({
        commentId: 'comment-123', owner: 'user-123',
      })).resolves.toBeUndefined();
    });

    it('should throw error if user has no authorization', async () => {
      await CommentsTableTestHelper.addComments({
        id: 'comment-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      await expect(commentRepositoryPostgres.verifyCommentByUser({
        commentId: 'comment-123', owner: 'user-456',
      })).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      const addedComment = {
        id: 'comment-123',
        threadId: 'thread-123',
      };

      await CommentsTableTestHelper.addComments({
        id: addedComment.id, threadId: addedComment.threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById(addedComment.id);

      const [comment] = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment.is_delete).toEqual(true);
    });

    it('should throw error when comment that wants to be deleted does not exist', async () => {
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .rejects.toThrowError(NotFoundError);
    });
  });
});
