import FilterView from "../view/filter";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {filter} from "../utils/filter";
import {FilterType, MenuItem, UpdateType} from "../const";

export default class Filter {
  constructor(filterContainer, filterModel, filmsListModel, displayedContentModule) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsListModel = filmsListModel;
    this._displayedContentModule = displayedContentModule;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleShowStatistic = this._handleShowStatistic.bind(this);

    this._filmsListModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setShowStatisticHandler(this._handleShowStatistic);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);

      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._displayedContentModule.setDisplayedContent(MenuItem.FILMS);
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleShowStatistic() {
    this._currentFilter = null;
    this._displayedContentModule.setDisplayedContent(MenuItem.STATISTICS);
  }

  _getFilters() {
    const films = this._filmsListModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All films`,
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.ALREADY_WATCHED,
        name: `History`,
        count: filter[FilterType.ALREADY_WATCHED](films).length,
      },
      {
        type: FilterType.FAVORITE,
        name: `Favorites`,
        count: filter[FilterType.FAVORITE](films).length,
      },
    ];
  }
}
