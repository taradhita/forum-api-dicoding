const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'dicoding',
      };

      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when request payload not contain authentication', async () => {
      const requestPayload = {
        content: 'dicoding',
      };

      await ServerTestHelper.getAccessToken();

      const server = await createServer(container);
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: {},
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId)/comments/{commentId}', () => {
    it('should respond with 200 and return success status', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComments({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 403 when user not authorized', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-456';

      await UsersTableTestHelper.addUser({ id: userId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComments({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
