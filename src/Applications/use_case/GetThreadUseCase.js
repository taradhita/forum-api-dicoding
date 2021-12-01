class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

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
}

module.exports = GetThreadUseCase;
