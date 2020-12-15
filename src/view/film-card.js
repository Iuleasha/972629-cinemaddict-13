import {createElement, formatDate, getDuration, render, RenderPosition} from '../utils/utils';
import PopupView from './popup';


const addActiveClass = (status) => {
  return status ? `film-card__controls-item--active` : ``;
};

const createCardTemplate = (film) => {
  return `<article class="film-card">
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
            <button class="film-card__controls-item ${addActiveClass(film.controls.addToWatchlist)} button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${addActiveClass(film.controls.markAsWatched)} button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${addActiveClass(film.controls.markAsFavorite)} button film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard {
  constructor(film) {
    this.film = film;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this.film);
  }

  getElement() {
    const popupView = new PopupView(this.film);

    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const target = evt.target;

        if (target.classList.contains(`film-card__title`) || target.classList.contains(`film-card__poster`) || target.classList.contains(`film-card__comments`)) {
          render(document.body, popupView.getElement(), RenderPosition.BEFOREEND);
          popupView.addListener();
        }
      });
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
