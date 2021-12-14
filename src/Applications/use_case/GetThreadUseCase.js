class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    threadDetail.comments = await this._getLikeCount(threadDetail.comments);

    threadDetail.comments = threadDetail.comments.map((comment) => {
      const { isDelete, ...commentDetail } = comment;
      commentDetail.content = isDelete ? '**komentar telah dihapus**' : commentDetail.content;
      return commentDetail;
    });

    // return reply
    for (let i = 0; i < threadDetail.comments.length; i += 1) {
      threadDetail.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === threadDetail.comments[i].id)
        .map((reply) => {
          const { commentId, isDelete, ...replyDetail } = reply;
          replyDetail.content = isDelete ? '**balasan telah dihapus**' : replyDetail.content;
          return replyDetail;
        });
    }
    return threadDetail;
  }

  async _getLikeCount(comments) {
    await Promise.all(comments.map(async (comment) => {
      const commentItem = comment;
      commentItem.likeCount = await this._likeRepository.getLikeCountByComment(comment.id);
    }));

    return comments;
  }
}

module.exports = GetThreadUseCase;
