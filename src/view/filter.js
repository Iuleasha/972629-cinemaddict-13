import SmartView from './smart';

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
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filter extends SmartView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._showStatisticHandler = this._showStatisticHandler.bind(this);
  }

  restoreHandlers() {
    this.setFilterTypeChangeHandler(this._callback.filterTypeChange);
    this.setShowStatisticHandler(this._callback.showStatistic);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this.getElement().querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__additional--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    this._callback.filterTypeChange(evt.target.dataset.type);
  }

  _showStatisticHandler(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains(`main-navigation__additional--active`)) {
      return;
    }

    this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__additional--active`);
    this._callback.showStatistic(evt);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    const filterItems = this.getElement().querySelectorAll(`.main-navigation__item`);

    filterItems.forEach((item) => item.addEventListener(`click`, this._filterTypeChangeHandler));
  }

  setShowStatisticHandler(callback) {
    this._callback.showStatistic = callback;

    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._showStatisticHandler);
  }
}
