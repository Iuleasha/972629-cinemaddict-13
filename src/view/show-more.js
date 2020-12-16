import {createElement, render, RenderPosition} from '../utils/utils';
import {currentFilmsArray, FILMS_QUANTITY, renderFilmsList} from './render-films-list';

const createShowMoreBtnTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreBtn {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  addShowMoreButton() {
    if (currentFilmsArray.filmsArray.length > FILMS_QUANTITY) {
      const filmsListElement = document.querySelector(`.films-list`);

      render(filmsListElement, this.getElement(), RenderPosition.BEFOREEND);
      this._element.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        renderFilmsList(false);
        if (currentFilmsArray.filmsArray.length <= FILMS_QUANTITY && this._element) {
          this._element.remove();
          this.removeElement();
        }
      });
    } else if (currentFilmsArray.filmsArray.length <= FILMS_QUANTITY && this._element) {
      this._element.remove();
      this.removeElement();
    }
  }
}


