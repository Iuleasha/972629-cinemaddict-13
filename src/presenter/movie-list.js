import {remove, render, RenderPosition} from "../utils/render";
import {updateItem} from "../utils/common";
import NoMovies from "../view/no-movies";
import ShowMoreBtn from "../view/show-more";
import FilmsComponent from "../view/films";
import FilmsListComponent from "../view/films-list";
import FilmsContainerComponent from "../view/films-container";
import {ExtraType, FilterType, SortType} from '../const';
import MoviePresenter from './movie-card';
import SortView from "../view/sort";
import FilmCardExtras from "../view/extra";
import FilmCard from "../view/film-card";
import Navigation from "../view/menu-navigation";

const FILM_COUNT_PER_STEP = 5;
const MAX_EXTRAS_LENGTH = 2;

export class MovieList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._currentSortType = SortType.DEFAULT;
    this._currentFilterType = FilterType.ALL_MOVIES;
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    this._moviePresenter = {};

    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._noMovies = new NoMovies();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._sortComponent = new SortView(this._currentSortType);
    this._navigatioComponent = new Navigation();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handlerUpdateFilterCount = this._handlerUpdateFilterCount.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._filteredMovies = movies.slice();
    this._sourcedBoardTasks = movies.slice();

    this._navigatioComponent.setCountsValue(this._setFilterCount(movies));

    this._renderList();
    this._renderExtras();
    this._renderFilter();
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

  _handleMovieChange(updatedMovie) {
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedMovie);
    this._moviePresenter[updatedMovie.id].init(updatedMovie);
  }

  _handlerUpdateFilterCount(updatedType) {
    this._navigatioComponent.updateCount(updatedType);
  }

  _handleOpenPopup() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedMovieCount, this._renderedMovieCount + FILM_COUNT_PER_STEP);
    this._renderedMovieCount += FILM_COUNT_PER_STEP;

    if (this._renderedMovieCount >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._currentSortType = SortType.DEFAULT;
    this._sortComponent.setActiveStatus(this._currentSortType);
    this._filterMovie(filterType);
    this._sortMovie(this._currentSortType);
    this._clearMovieList();
    this._renderMovieList();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovie(sortType);
    this._clearMovieList();
    this._renderMovieList();
  }

  _renderFilter() {
    render(this._movieListContainer, this._navigatioComponent, RenderPosition.AFTERBEGIN);
    this._navigatioComponent.setSortTypeChangeHandler(this._handleFilterTypeChange);
  }

  _renderSort() {
    render(this._movieListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderList() {
    if (!this._movies.length) {
      this._renderNoMovie();

      return;
    }

    this._renderSort();
    this._renderMovieList();
  }

  _renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container, this._handleMovieChange, this._handleOpenPopup, this._handlerUpdateFilterCount);

    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderFilms(from, to) {
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie, this._filmsContainerComponent));
  }

  _renderNoMovie() {
    render(this._filmsComponent, this._noMovies, RenderPosition.AFTERBEGIN);
    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearMovieList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());

    this._moviePresenter = {};
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _filterMovie(filterType) {
    switch (filterType) {
      case FilterType.ALL_MOVIES:
        this._filteredMovies = this._sourcedBoardTasks.slice();
        break;
      case FilterType.BY_FAVORITE:
        this._filteredMovies = this._sourcedBoardTasks.slice().filter((item) => item.favorite);
        break;
      case FilterType.BY_WATCHED:
        this._filteredMovies = this._sourcedBoardTasks.slice().filter((item) => item.watched);
        break;
      case FilterType.BY_WATCHLIST:
        this._filteredMovies = this._sourcedBoardTasks.slice().filter((item) => item.watchlist);
        break;
    }

    this._currentFilterType = filterType;
  }

  _sortMovie(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._movies = this._filteredMovies.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.BY_RATING:
        this._movies = this._filteredMovies.slice().sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        this._movies = this._filteredMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _renderMovieList() {
    this._renderFilms(0, Math.min(this._movies.length, FILM_COUNT_PER_STEP));

    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    if (this._movies.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _sortExtras(extraType) {
    switch (extraType) {
      case ExtraType.BY_COMMENTS:
        const sortedByCommentsArray = this._sourcedBoardTasks.sort((a, b) => b.comments.length - a.comments.length);

        return sortedByCommentsArray[0].comments.length ? sortedByCommentsArray : [];
      case ExtraType.BY_RATING:
        const sortedByRatingArray = this._sourcedBoardTasks.sort((a, b) => Number(b.rating) - Number(a.rating));

        return Number(sortedByRatingArray[0].rating) > 0 ? sortedByRatingArray : [];
      default:
        return this._movies;
    }
  }

  _setFilterCount(movies) {
    const startCont = {
      watchlist: 0,
      watched: 0,
      favorite: 0,
    };

    movies.forEach((item) => {
      if (item.watchlist) {
        startCont.watchlist++;
      }

      if (item.watched) {
        startCont.watched++;

      }

      if (item.favorite) {
        startCont.favorite++;
      }
    });

    return startCont;
  }
}
