import {formatDate, getDuration} from '../utils/common';
import SmartView from './smart';
import {emotion} from '../mock/comment-mock';

const createGenreItem = (array) => {
  let genres = ``;
  array.forEach((item) => {
    genres += `<span class="film-details__genre">${item}</span>`;
  });
  return genres;
};

const createCommentItemTemplate = (comment) => {
  return (`<li class="film-details__comment" data-id="${comment.id}">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${formatDate(comment.date, `YYYY/MM/DD HH:mm`)}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>`);
};

export const createCommentsListTemplate = (comments) => {
  const commentItemsTemplate = comments
    .map((comment) => createCommentItemTemplate(comment))
    .join(``);

  return `<ul class="film-details__comments-list">${commentItemsTemplate}</ul>`;
};

const createEmojiItemTemplate = (emoji) => {
  return (`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>
  `);
};

export const createEmojiListTemplate = () => {
  const emojiItemsTemplate = emotion
    .map((emoji) => createEmojiItemTemplate(emoji))
    .join(``);

  return `<div class="film-details__emoji-list">${emojiItemsTemplate}</div>`;
};

const createPopupTemplate = (film) => {
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${film.poster}" alt="">

          <p class="film-details__age">${film.age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${film.title}</h3>
              <p class="film-details__title-original">Original: ${film.title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${film.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${film.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${film.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${film.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(film.releaseDate, `DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getDuration(film.duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${film.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${createGenreItem(film.genres)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${film.description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.watched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.favorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>

        ${createCommentsListTemplate(film.comments)}

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          ${createEmojiListTemplate()}
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();

    this._data = film;

    this._controllerClickHandler = this._controllerClickHandler.bind(this);
    this._selectEmojiClickHandler = this._selectEmojiClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers() {
    this.setCloseClickHandler(this._callback.closeClick);
    this.setControlsHandler(this._callback.controllersClick);
    this._setInnerHandlers();
  }

  _controllerClickHandler(evt) {
    evt.preventDefault();

    const type = evt.target.name;
    const scrollPosition = this.getElement().scrollTop;

    evt.target.classList.toggle(`film-card__controls-item--active`);

    this.updateData(
      {[type]: !this._data[type]},
    );

    this._callback.controllersClick({[type]: this._data[type]});

    document.querySelector(`.film-details`).scroll(0, scrollPosition);
  }

  setControlsHandler(callback) {
    this._callback.controllersClick = callback;

    const controls = this.getElement().querySelectorAll(`.film-details__control-input`);

    controls.forEach((item) => {
      item.addEventListener(`change`, this._controllerClickHandler);
    });
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._callback.closeClick);
  }

  _selectEmojiClickHandler(evt) {
    evt.preventDefault();

    const emojiValue = evt.target.value;

    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="./images/emoji/${emojiValue}.png" width="55" height="55" alt="emoji-${emojiValue}">`;
  }

  _setInnerHandlers() {
    const emoji = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emoji.forEach((item) => item.addEventListener(`change`, this._selectEmojiClickHandler));
  }
}
