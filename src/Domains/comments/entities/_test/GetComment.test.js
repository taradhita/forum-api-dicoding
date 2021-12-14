const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 123,
      date: '2021-08-08T07:19:09.775Z',
      content: {},
      isDelete: [],
      replies: [],
      likeCount: 1,
    };
    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create getcomment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      content: 'content',
      isDelete: true,
      replies: [],
      likeCount: 1,
    };
    // Action
    const {
      id, content, date, username, isDelete, replies,
    } = new GetComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(isDelete).toEqual(payload.isDelete);
    expect(replies).toEqual(payload.replies);
  });
});
