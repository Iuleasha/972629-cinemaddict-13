import {renderFilmsList, currentFilmsArray} from './render-films-list';
import {defaultSort, sortByRating, sortFilmByData} from '../mock/film';
import {createElement} from '../utils/utils';

const createSortTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-type="default">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-type="byDate">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-type="byRating">Sort by rating</a></li>
  </ul>`;
};

export const addSortEvent = () => {
  const sortWrapper = document.querySelector(`.sort`);
  const sortButtons = sortWrapper.querySelectorAll(`.sort__button`);

  sortButtons.forEach((item) => {
    item.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (item.dataset.type === `byDate`) {
        currentFilmsArray.filmsArray = sortFilmByData();
      } else if (item.dataset.type === `byRating`) {
        currentFilmsArray.filmsArray = sortByRating();
      } else {
        currentFilmsArray.filmsArray = defaultSort;
      }

      renderFilmsList();

      sortButtons.forEach((btn) => btn.classList.remove(`sort__button--active`));
      item.classList.add(`sort__button--active`);
    });
  });
};
export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
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
}
