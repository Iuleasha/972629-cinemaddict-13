import {ExtraType, MenuItem, SortType, UpdateType, UserAction} from '../const';
import {filter} from "../utils/filter";
import {remove, render, RenderPosition} from "../utils/render";
import FilmCardExtras from "../view/extra";
import FilmCard from "../view/film-card";
import FilmsComponent from "../view/films";
import FilmsContainerComponent from "../view/films-container";
import FilmsListComponent from "../view/films-list";
import NoMovies from "../view/no-films";
import ShowMoreBtn from "../view/show-more";
import SortView from "../view/sort";
import FilmPresenter from './film';

const FILM_COUNT_PER_STEP = 5;
const MAX_EXTRAS_LENGTH = 2;

export class FilmsList {
  constructor(filmsListContainer, filmsModel, filterModel, displayedContentModule) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._displayedContentModule = displayedContentModule;
    this._filmsListContainer = filmsListContainer;
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    this._filmsPresenters = {};
    this._currentSortType = SortType.DEFAULT;
    this._currentMenyType = MenuItem.FILMS;
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._noMovies = new NoMovies();
    this._showMoreButtonComponent = null;
    this._sortComponent = new SortView(this._currentSortType);

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
        return filtredFilms.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
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
      remove(this._filmsComponent);
    } else {
      render(this._filmsListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
      render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);

      this._renderBoard();
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmsPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmsList({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleFilmUpdate(actionType, updateType, update) {
    if (actionType !== UserAction.UPDATE_FILM) {
      return;
    }

    this._filmsModel.updateFilms(updateType, update);
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
    const filmPresenter = new FilmPresenter(this._filmsContainerComponent, this._handleFilmUpdate, this._handleModeChange);
    filmPresenter.init(film);
    this._filmsPresenters[film.id] = filmPresenter;
  }

  _renderMovies(films) {
    films.forEach((film) => this._renderMovie(film));
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

  _renderExtras() {
    Object.keys(ExtraType).forEach((item) => {
      const extrasMovieArray = this._sortExtras(ExtraType[item]);

      if (extrasMovieArray.length) {
        const extras = new FilmCardExtras(ExtraType[item]);
        const extrasContainerComponent = new FilmsContainerComponent();

        this._sortExtras(ExtraType[item]).slice(0, MAX_EXTRAS_LENGTH).forEach((film) => {
          const filmContainer = new FilmCard(film);
          render(extrasContainerComponent, filmContainer, RenderPosition.BEFOREEND);
        });

        render(extras, extrasContainerComponent, RenderPosition.BEFOREEND);
        render(this._filmsComponent, extras, RenderPosition.BEFOREEND);
      }
    });
  }

  _sortExtras(extraType) {
    switch (extraType) {
      case ExtraType.BY_COMMENTS:
        const sortedByCommentsArray = this._filmsModel.getFilms().sort((a, b) => b.comments.length - a.comments.length);

        return sortedByCommentsArray[0].comments.length ? sortedByCommentsArray : [];
      case ExtraType.BY_RATING:
        const sortedByRatingArray = this._filmsModel.getFilms().sort((a, b) => Number(b.totalRating) - Number(a.totalRating));

        return Number(sortedByRatingArray[0].totalRating) > 0 ? sortedByRatingArray : [];
      default:
        return this._filmsModel.getFilms();
    }
  }

  _clearFilmsList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._filmsPresenters = {};

    remove(this._noMovies);
    remove(this._sortComponent);

    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(filmsCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
