import Observer from "../utils/observer";

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

    this._notify(updateType, this._comment);
  }

  deleteComment(updateType, commentId) {
    this._comments = [...this._comments.filter(({id}) => id !== commentId)];

    this._notify(updateType, commentId);
  }
}
