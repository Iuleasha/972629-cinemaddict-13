import {formatDate, getDuration} from '../utils/common';
import Abstract from './abstract';
import {filmControlHandler} from "../handlers/film-controls";

const addActiveClass = (status) => {
  return status ? `film-card__controls-item--active` : ``;
};

const createCardTemplate = (film) => {
  return `<article class="film-card" data-id="${film.id}">
          <h3 class="film-card__title">${film.title}</h3>
          <p class="film-card__rating">${film.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${formatDate(film.releaseDate, `YYYY`)}</span>
            <span class="film-card__duration">${getDuration(film.duration)}</span>
            <span class="film-card__genre">${film.genres[0]}</span>
          </p>
          <img src="${film.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${film.description}</p>
          <a class="film-card__comments">${film.comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item ${addActiveClass(film.controls.watchlist)} button film-card__controls-item--add-to-watchlist" data-type="watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${addActiveClass(film.controls.watched)} button film-card__controls-item--mark-as-watched" data-type="watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${addActiveClass(film.controls.favorite)} button film-card__controls-item--favorite" data-type="favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this.film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this.film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    const moviePoster = this.getElement().querySelector(`.film-card__poster`);
    const movieTitle = this.getElement().querySelector(`.film-card__title`);
    const movieComments = this.getElement().querySelector(`.film-card__comments`);
    const items = [moviePoster, movieTitle, movieComments];

    items.forEach((item) => item.addEventListener(`click`, this._clickHandler));
  }

  setControlsHandler() {
    const controls = this.getElement().querySelectorAll(`.film-card__controls-item`);

    controls.forEach((item) => {
      const type = item.dataset.type;

      item.addEventListener(`click`, () => {
        item.classList.toggle(`film-card__controls-item--active`);
        this.film.controls[type] = item.classList.contains(`film-card__controls-item--active`);

        filmControlHandler(this.film, type);
      });
    });
  }
}
