import {remove, render, RenderPosition} from '../utils/render';
import {currentFilmsArray, FILMS_QUANTITY, renderFilmsList} from './render-films-list';
import AbstractView from './abstract';

const createShowMoreBtnTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreBtn extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  addShowMoreButton(filmsListElement) {
    if (currentFilmsArray.filmsArray.length > FILMS_QUANTITY) {
      const showMoreBtn = this.getElement();

      showMoreBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        renderFilmsList(false);
        this.removeShowMore();
      });

      render(filmsListElement, showMoreBtn, RenderPosition.BEFOREEND);
    } else {
      this.removeShowMore();
    }
  }

  removeShowMore() {
    if (currentFilmsArray.filmsArray.length <= FILMS_QUANTITY && this._element) {
      remove(this);
    }
  }
}


