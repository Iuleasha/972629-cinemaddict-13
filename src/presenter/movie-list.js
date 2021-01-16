import {remove, render, RenderPosition} from "../utils/render";
import {filter} from "../utils/filter";
import NoMovies from "../view/no-movies";
import ShowMoreBtn from "../view/show-more";
import FilmsComponent from "../view/films";
import FilmsListComponent from "../view/films-list";
import FilmsContainerComponent from "../view/films-container";
import {ExtraType, SortType, UpdateType, UserAction} from '../const';
import MoviePresenter from './movie-card';
import SortView from "../view/sort";
import FilmCardExtras from "../view/extra";
import FilmCard from "../view/film-card";

const FILM_COUNT_PER_STEP = 5;
const MAX_EXTRAS_LENGTH = 2;

export class MovieList {
  constructor(movieListContainer, moviesModel, filterModel) {
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._movieListContainer = movieListContainer;
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    this._moviePresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._noMovies = new NoMovies();
    this._showMoreButtonComponent = null;
    this._sortComponent = new SortView(this._currentSortType);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleMovieUpdate = this._handleMovieUpdate.bind(this);
  }

  init() {
    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});

    remove(this._filmsComponent);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = [...this._moviesModel.getMovies()];
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.BY_RATING:
        return filtredMovies.sort((a, b) => Number(b.rating) - Number(a.rating));
      case SortType.BY_DATE:
        return filtredMovies.sort((a, b) => b.releaseDate - a.releaseDate);
    }

    return filtredMovies;
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearMovieList({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleMovieUpdate(actionType, updateType, update) {
    if (actionType !== UserAction.UPDATE_FILM) {
      return;
    }

    this._moviesModel.updateMovies(updateType, update);
  }

  _handleModeChange() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearMovieList({resetRenderedMovieCount: true});
    this._renderBoard();
  }

  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(moviesCount, this._renderedMovieCount + FILM_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);

    this._renderMovies(movies);
    this._renderedMovieCount = newRenderedMovieCount;

    if (this._renderedMovieCount >= moviesCount) {
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

  _renderMovie(movie) {
    const moviePresenter = new MoviePresenter(this._filmsContainerComponent, this._handleMovieUpdate, this._handleModeChange);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderMovies(movies) {
    movies.forEach((movie) => this._renderMovie(movie));
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
    const movies = this._getMovies();
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this._renderNoMovie();

      return;
    }

    this._renderSort();

    this._renderMovies(movies.slice(0, Math.min(moviesCount, this._renderedMovieCount)));

    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);

    if (moviesCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }
  }

  _renderExtras() {
    Object.keys(ExtraType).forEach((item) => {
      const extrasMovieArray = this._sortExtras(ExtraType[item]);

      if (extrasMovieArray.length) {
        const extras = new FilmCardExtras(ExtraType[item]);
        const extrasContainerComponent = new FilmsContainerComponent();

        this._sortExtras(ExtraType[item]).slice(0, MAX_EXTRAS_LENGTH).forEach((movie) => {
          const movieContainer = new FilmCard(movie);
          render(extrasContainerComponent, movieContainer, RenderPosition.BEFOREEND);
        });

        render(extras, extrasContainerComponent, RenderPosition.BEFOREEND);
        render(this._filmsComponent, extras, RenderPosition.BEFOREEND);
      }
    });
  }

  _sortExtras(extraType) {
    switch (extraType) {
      case ExtraType.BY_COMMENTS:
        const sortedByCommentsArray = this._moviesModel.getMovies().sort((a, b) => b.comments.length - a.comments.length);

        return sortedByCommentsArray[0].comments.length ? sortedByCommentsArray : [];
      case ExtraType.BY_RATING:
        const sortedByRatingArray = this._moviesModel.getMovies().sort((a, b) => Number(b.rating) - Number(a.rating));

        return Number(sortedByRatingArray[0].rating) > 0 ? sortedByRatingArray : [];
      default:
        return this._moviesModel.getMovies();
    }
  }

  _clearMovieList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};

    remove(this._noMovies);
    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(moviesCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
