import {formatDate, formatFilmRuntime} from '../utils/common';
import Abstract from './abstract';

const addActiveClass = (status) => status ? `film-card__controls-item--active` : ``;

const createCardTemplate = (film) => {
  const {id, comments, filmInfo, userDetails} = film;

  return `<article class="film-card" data-id="${id}">
          <h3 class="film-card__title">${filmInfo.title}</h3>
          <p class="film-card__rating">${filmInfo.totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${formatDate(filmInfo.release.date, `YYYY`)}</span>
            <span class="film-card__duration">${formatFilmRuntime(filmInfo.runtime)}</span>
            <span class="film-card__genre">${filmInfo.genre[0]}</span>
          </p>
          <img src="${filmInfo.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${filmInfo.description}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item ${addActiveClass(userDetails.watchlist)} button film-card__controls-item--add-to-watchlist" data-type="watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${addActiveClass(userDetails.alreadyWatched)} button film-card__controls-item--mark-as-watched" data-type="alreadyWatched" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${addActiveClass(userDetails.favorite)} button film-card__controls-item--favorite" data-type="favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this.film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._controllerClickHandler = this._controllerClickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this.film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _controllerClickHandler(evt) {
    evt.preventDefault();

    this._callback.controllersClick(evt.target.dataset.type);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    const posterElement = this.getElement().querySelector(`.film-card__poster`);
    const titleElement = this.getElement().querySelector(`.film-card__title`);
    const commentsElement = this.getElement().querySelector(`.film-card__comments`);
    const items = [posterElement, titleElement, commentsElement];

    items.forEach((item) => item.addEventListener(`click`, this._clickHandler));
  }

  setControlsHandler(callback) {
    this._callback.controllersClick = callback;

    const controls = this.getElement().querySelectorAll(`.film-card__controls-item`);
    controls.forEach((item) => {
      item.addEventListener(`click`, this._controllerClickHandler);
    });
  }
}
