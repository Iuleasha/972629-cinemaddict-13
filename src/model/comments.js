import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comment = update;
    this._comment.id = this._comments.length;

    this._comments = [
      this._comment,
      ...this._comments,
    ];

    this._notify(updateType, this._comment);
  }

  deleteComment(updateType, commentId) {
    const index = this._comments.findIndex(
        (comment) => comment.id === Number(commentId)
    );

    if (index === -1) {
      throw new Error(`Can't delete unexisting movie`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
