import {remove, render, RenderPosition} from "../utils/render";
import {updateItem} from "../utils/common";
import NoMovies from "../view/no-movies";
import ShowMoreBtn from "../view/show-more";
import FilmsComponent from "../view/films";
import FilmsListComponent from "../view/films-list";
import FilmsContainerComponent from "../view/films-container";
import {SortType} from '../const';
import MoviePresenter from './movie-card';
import PopupPresenter from './popup';
import SortView from "../view/sort";
import NavigationView from "../view/menu-navigation";

const topRated = `Top rated`;
const mostCommented = `Most commented`;
const FILM_COUNT_PER_STEP = 5;

export class MovieList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._currentSortType = SortType.DEFAULT;
    this._renderedMovieCount = FILM_COUNT_PER_STEP;
    this._moviePresenter = {};

    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._noMovies = new NoMovies();
    this._popupPresenter = new PopupPresenter();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._navigationView = new NavigationView();
    this._sortComponent = new SortView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._sourcedBoardTasks = movies.slice();

    this._renderList();
    // filterFilms();
    // this._renderSort();
    // this._renderNavigation();
    // this._renderMovieList();
    // this._renderExtras();
  }

  // _renderExtras() {
  //   [topRated, mostCommented].forEach((item) => {
  //     const extraItem = new FilmCardExtrasView(item);
  //
  //     render(this._filmsContainerView, extraItem, RenderPosition.BEFOREEND);
  //
  //     extraItem.getExtraList(item === topRated ? sortByRating() : sortByComments());
  //   });
  // }

  // _renderMovieList() {
  //   render(this._movieListContainer, this._filmsContainerView, RenderPosition.BEFOREEND);
  //   renderFilmsList();
  // }
  //
  _renderNavigation() {
    render(this._movieListContainer, this._navigationView, RenderPosition.AFTERBEGIN);
    addFilterEvent();
  }

  //
  // _renderSort() {
  //   render(this._movieListContainer, this._sortView, RenderPosition.AFTERBEGIN);
  //   addSortEvent();
  // }


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

  _handleMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._moviePresenter[updatedMovie.id].init(updatedMovie);
  }

  _handleOpenPopup(movie) {
    this._popupPresenter.init(movie);
  }

  _renderMovie(movie) {
    const moviePresenter = new MoviePresenter(this._filmsContainerComponent, this._handleMovieChange, this._handleOpenPopup);

    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderFilms(from, to) {
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie));
  }

  _renderNoMovie() {
    render(this._filmsComponent, this._noMovies, RenderPosition.AFTERBEGIN);
    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedMovieCount, this._renderedMovieCount + FILM_COUNT_PER_STEP);
    this._renderedMovieCount += FILM_COUNT_PER_STEP;

    if (this._renderedMovieCount >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovie(sortType);
    this._clearMovieList();
    this._renderMovieList();
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

  _sortMovie(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._movies.sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.BY_RATING:
        this._movies.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case SortType.BY_COMMENTS:
        this._movies.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        this._movies = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _renderMovieList() {
    this._renderFilms(0, Math.min(this._movies.length, FILM_COUNT_PER_STEP));

    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    if (this._movies.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
}
