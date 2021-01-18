import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const countWrapper = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;
  const activeClass = type === currentFilterType ? `main-navigation__item--active` : ``;

  return (`<a href="#${type}" class="main-navigation__item ${activeClass}" data-type="${type}">${name} ${countWrapper}</a>`);
};

export const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    this._callback.filterTypeChange(evt.target.dataset.type);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    const filterItems = this.getElement().querySelectorAll(`.main-navigation__item`);

    filterItems.forEach((item) => item.addEventListener(`click`, this._filterTypeChangeHandler));
  }
}
