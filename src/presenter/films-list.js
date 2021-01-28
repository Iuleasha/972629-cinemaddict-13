import {ExtraType, MenuItem, SortType, UpdateType, UserAction} from '../const';
import {filter} from "../utils/filter";
import {remove, render, RenderPosition} from "../utils/render";
import FilmCardExtras from "../view/extra";
import FilmsComponent from "../view/films";
import FilmsContainerComponent from "../view/films-container";
import FilmsListComponent from "../view/films-list";
import LoadingView from "../view/loading.js";
import NoMovies from "../view/no-films";
import ShowMoreBtn from "../view/show-more";
import SortView from "../view/sort";
import FilmPresenter from './film';

const FILM_COUNT_PER_STEP = 5;
const MAX_EXTRAS_LENGTH = 2;

export class FilmsList {
  constructor(filmsListContainer, filmsModel, filterModel, displayedContentModule, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._displayedContentModule = displayedContentModule;
    this._filmsListContainer = filmsListContainer;
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._currentMenyType = MenuItem.FILMS;
    this._filmsPresenters = {};
    this._filmsExtrasByCommentsPresenters = {};
    this._filmsExtrasByRatingPresenters = {};
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._loadingComponent = new LoadingView();
    this._noMovies = new NoMovies();
    this._sortComponent = new SortView(this._currentSortType);
    this._showMoreButtonComponent = null;
    this._extrasByCommentsComponent = null;
    this._extrasByRatingComponent = null;
    this._isLoading = true;
    this._api = api;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._showStatusEvent = this._showStatusEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmUpdate = this._handleFilmUpdate.bind(this);
  }

  init() {
    render(this._filmsListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._displayedContentModule.addObserver(this._showStatusEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearFilmsList({resetRenderedMovieCount: true, resetSortType: true});

    remove(this._filmsComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = [...this._filmsModel.getFilms()];
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_RATING:
        return filtredFilms.sort((a, b) => Number(b.filmInfo.totalRating) - Number(a.filmInfo.totalRating));
      case SortType.BY_DATE:
        return filtredFilms.sort((a, b) => new Date(b.filmInfo.release.date) - new Date(a.filmInfo.release.date));
    }

    return filtredFilms;
  }

  _showStatusEvent(menuType) {
    if (this._currentMenyType === menuType) {
      return;
    }

    this._currentMenyType = menuType;

    if (MenuItem.FILMS !== menuType) {
      this._clearFilmsList({resetRenderedMovieCount: true, resetSortType: true});
      this._clearExtras();

      remove(this._filmsComponent);
    } else {
      render(this._filmsListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
      render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);

      this._renderBoard();
      this._renderMostCommented();
      this._renderMostRated();
    }
  }

  updatePresenters(data) {
    if (this._filmsPresenters[data.id]) {
      this._filmsPresenters[data.id].init(data);
    }

    if (this._filmsExtrasByCommentsPresenters[data.id]) {
      this._filmsExtrasByCommentsPresenters[data.id].init(data);
    }

    if (this._filmsExtrasByRatingPresenters[data.id]) {
      this._filmsExtrasByRatingPresenters[data.id].init(data);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this.updatePresenters(data);
        break;
      case UpdateType.EXTRA:
        this.updatePresenters(data);
        this._renderMostCommented();
        break;
      case UpdateType.MINOR:
        this.updatePresenters(data);
        this._clearFilmsList();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        this._renderMostRated();
        this._renderMostCommented();
        break;
    }
  }

  _handleFilmUpdate(actionType, updateType, update) {
    if (actionType !== UserAction.UPDATE_FILM) {
      return;
    }

    this._api.updateFilm(update).then((response) => {
      this._filmsModel.updateFilms(updateType, response);
    });
  }

  _handleModeChange() {
    Object
      .values(this._filmsPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsList({resetRenderedMovieCount: true});
    this._renderBoard();
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedMovieCount = Math.min(filmsCount, this._renderedMovieCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedMovieCount, newRenderedMovieCount);

    this._renderMovies(films);
    this._renderedMovieCount = newRenderedMovieCount;

    if (this._renderedMovieCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(film) {
    const filmPresenter = new FilmPresenter(this._filmsContainerComponent, this._handleFilmUpdate, this._handleModeChange, this._filterModel, this._api);
    filmPresenter.init(film);
    this._filmsPresenters[film.id] = filmPresenter;
  }

  _renderMovies(films) {
    films.forEach((film) => this._renderMovie(film));
  }

  _renderLoading() {
    render(this._filmsComponent, this._loadingComponent, RenderPosition.BEFOREEND);
    render(this._filmsListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderNoMovie() {
    render(this._filmsComponent, this._noMovies, RenderPosition.AFTERBEGIN);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreBtn();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoMovie();

      return;
    }

    this._renderSort();

    this._renderMovies(films.slice(0, Math.min(filmsCount, this._renderedMovieCount)));

    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    if (filmsCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }
  }

  _renderMostCommented() {
    if (this._extrasByCommentsComponent !== null) {
      remove(this._extrasByCommentsComponent);
    }

    const filmsSortedByComments = this._filmsModel.getFilms().sort((a, b) => b.comments.length - a.comments.length);

    if (filmsSortedByComments.length && filmsSortedByComments[0].comments.length) {
      this._extrasByCommentsComponent = new FilmCardExtras(ExtraType.BY_COMMENTS);

      this._renderExtra(this._extrasByCommentsComponent, filmsSortedByComments, this._filmsExtrasByCommentsPresenters);
    }
  }

  _renderMostRated() {
    if (this._extrasByRatingComponent !== null) {
      remove(this._extrasByRatingComponent);
    }

    const filmsSortedByRating = this._filmsModel.getFilms().sort((a, b) => Number(b.filmInfo.totalRating) - Number(a.filmInfo.totalRating));

    if (filmsSortedByRating.length && filmsSortedByRating[0].filmInfo.totalRating !== `0`) {
      this._extrasByRatingComponent = new FilmCardExtras(ExtraType.BY_RATING);

      this._renderExtra(this._extrasByRatingComponent, filmsSortedByRating, this._filmsExtrasByRatingPresenters);
    }
  }

  _renderExtra(extraComponent, extrasFilms, presenter) {
    const extrasContainerComponent = new FilmsContainerComponent();

    extrasFilms.slice(0, MAX_EXTRAS_LENGTH).forEach((film) => {
      const filmPresenter = new FilmPresenter(extrasContainerComponent, this._handleFilmUpdate, this._handleModeChange, this._filterModel, this._api);
      filmPresenter.init(film);
      presenter[film.id] = filmPresenter;
    });

    render(extraComponent, extrasContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, extraComponent, RenderPosition.BEFOREEND);
  }

  _clearExtras() {
    Object
      .values(this._filmsExtrasByRatingPresenters)
      .forEach((presenter) => presenter.destroy());

    this._filmsExtrasByRatingPresenters = {};

    Object
      .values(this._filmsExtrasByRatingPresenters)
      .forEach((presenter) => presenter.destroy());

    this._filmsExtrasByRatingPresenters = {};
  }

  _clearFilmsList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._filmsPresenters = {};

    remove(this._noMovies);
    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }

    if (resetRenderedMovieCount || this._renderedMovieCount === FILM_COUNT_PER_STEP) {
      this._renderedMovieCount = FILM_COUNT_PER_STEP;
    } else if (filmsCount % this._renderedMovieCount === 1) {
      this._renderedMovieCount = filmsCount;
    } else {
      this._renderedMovieCount = Math.min(filmsCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
