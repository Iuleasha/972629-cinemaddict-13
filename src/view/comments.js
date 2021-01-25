import {formatDateToTimeFromNow} from '../utils/common';
import SmartView from "./smart";

const DELETING_TEXT = `Deleting…`;
const DEFAULT_DELETE_TEXT = `Delete`;

const createCommentTemplate = (comment) => {
  return `<li data-id="${comment.id}" class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${formatDateToTimeFromNow(comment.date)}</span>
          <button class="film-details__comment-delete">${DEFAULT_DELETE_TEXT}</button>
        </p>
      </div>
    </li>`;
};

const createCommentsTemplate = (comments) => {
  const commentsList = comments.map((comment) => createCommentTemplate(comment)).join(``);

  return `<div>
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">${commentsList}</ul>
  </div>`;
};

export default class Comments extends SmartView {
  constructor(comments) {
    super();

    this._comments = comments;
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this.restoreHandlers = this.restoreHandlers.bind(this);
  }

  updateData(update) {
    this._comments = update;
    this.updateElement();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === `BUTTON`) {
      const commentId = evt.target.closest(`.film-details__comment`).dataset.id;
      evt.target.innerText = DELETING_TEXT;

      this._callback.deleteCommentClick(commentId);
    }
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentClickHandler);
  }

  restoreHandlers() {
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
  }

  setDefaultDeleteButtonText(commentId) {
    const commentItem = this.getElement().querySelector(`[data-id=${commentId}]`);
    commentItem.innerText = DEFAULT_DELETE_TEXT;
  }
}
