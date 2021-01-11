import AbstractView from './abstract';
import {FilterType} from '../const';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active" data-type="${FilterType.ALL_MOVIES}">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-type="${FilterType.BY_WATCHLIST}">Watchlist <span class="main-navigation__item-count" data-type="watchlist">0</span></a>
      <a href="#history" class="main-navigation__item" data-type="${FilterType.BY_WATCHED}">History <span class="main-navigation__item-count" data-type="watched">0</span></a>
      <a href="#favorites" class="main-navigation__item" data-type="${FilterType.BY_FAVORITE}">Favorites <span class="main-navigation__item-count" data-type="favorite">0</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A` && !evt.target.classList.contains(`main-navigation__item`)) {
      return;
    }

    evt.preventDefault();
    this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this._callback.filterTypeChange(evt.target.dataset.type);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  updateCount(type) {
    const key = Object.keys(type)[0];
    const el = this.getElement().querySelector(`[data-type=${key}]`);
    let currentCount = Number(el.innerText);

    if (type[key]) {
      currentCount++;
    } else {
      currentCount--;
    }

    el.innerText = currentCount;
  }

  setCountsValue(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const el = this.getElement().querySelector(`[data-type=${key}]`);
        el.innerText = data[key];
      }
    }
  }
}
