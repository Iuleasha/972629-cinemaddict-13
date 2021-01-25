import he from "he";
import {emotions} from "../const";
import SmartView from "./smart";

const createEmojiItemTemplate = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>
  `;
};

export const createEmojiListTemplate = () => {
  const emojiItemsTemplate = emotions
    .map((emoji) => createEmojiItemTemplate(emoji))
    .join(``);

  return `<div class="film-details__emoji-list">${emojiItemsTemplate}</div>`;
};

const createAddCommentTemplate = () => {
  return `<form class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
                <label class="film-details__comment-label">
                    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" type="submit"></textarea>
                </label>
            ${createEmojiListTemplate()}
          </form>`;
};

export default class AddComment extends SmartView {
  constructor() {
    super();

    this._comment = {};
    this.restoreHandlers = this.restoreHandlers.bind(this);
    this._selectEmojiClickHandler = this._selectEmojiClickHandler.bind(this);
    this._textAreaHandler = this._textAreaHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this.setInnerHandlers();
  }

  getTemplate() {
    return createAddCommentTemplate();
  }

  restoreHandlers() {
    this.setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  updateData() {
    this._comment = {};
    this.updateElement();
  }

  setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._selectEmojiClickHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`change`, this._textAreaHandler);
  }

  _textAreaHandler(evt) {
    if (evt.target.classList.contains(`form-error`)) {
      evt.target.classList.remove(`form-error`);
    }
  }

  _selectEmojiClickHandler(evt) {
    evt.preventDefault();

    const emojiWrapper = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const emojiValue = evt.target.value;
    this._comment.emotion = evt.target.value;

    emojiWrapper.classList.remove(`form-error`);
    emojiWrapper.innerHTML = `<img src="./images/emoji/${emojiValue}.png" width="55" height="55" alt="emoji-${emojiValue}">`;
  }

  _formSubmitHandler(evt) {
    if (!(evt.keyCode === 13 && (evt.metaKey || evt.ctrlKey))) {
      return;
    }

    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    const emojiWrapper = this.getElement().querySelector(`.film-details__add-emoji-label`);

    if (commentInput.disabled && emojiWrapper.disabled) {
      return;
    }

    this._comment.comment = he.encode(commentInput.value) || ``;
    this._comment.date = new Date();

    if (!this._comment.comment || !this._comment.emotion) {
      if (!this._comment.comment) {
        commentInput.classList.add(`form-error`);
      }

      if (!this._comment.emotion) {
        emojiWrapper.classList.add(`form-error`);
      }

      this.addAnimation();

      return;
    }

    this.switchDisableFormStus(true);

    this._callback.formSubmit(this._comment);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`keydown`, this._formSubmitHandler);
  }

  switchDisableFormStus(status) {
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    const emojiWrapper = this.getElement().querySelector(`.film-details__add-emoji-label`);

    commentInput.disabled = status;
    emojiWrapper.disabled = status;
  }

  addAnimation() {
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    const emojiWrapper = this.getElement().querySelector(`.film-details__add-emoji-label`);

    commentInput.classList.add(`shake`);
    emojiWrapper.classList.add(`shake`);

    setTimeout(() => {
      commentInput.classList.remove(`shake`);
      emojiWrapper.classList.remove(`shake`);
    }, 600);
  }
}
