import {renderFilmsList} from "../view/render-films-list";
import {render, RenderPosition} from "../utils/render";
import FilmsContainerView from "../view/film-container";
import NavigationView, {addFilterEvent} from "../view/menu-navigation";
import SortView, {addSortEvent} from "../view/sort";
import FilmCardExtrasView from "../view/extra";
import {filterFilms, sortByComments, sortByRating} from '../mock/film';

const topRated = `Top rated`;
const mostCommented = `Most commented`;

export class MovieList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._filmsContainerView = new FilmsContainerView();
    this._navigationView = new NavigationView();
    this._sortView = new SortView();
  }

  init() {
    filterFilms();
    this._renderSort();
    this._renderNavigation();
    this._renderMovieList();
    this._renderExtras();
  }

  _renderExtras() {
    [topRated, mostCommented].forEach((item) => {
      const extraItem = new FilmCardExtrasView(item);

      render(this._filmsContainerView, extraItem, RenderPosition.BEFOREEND);

      extraItem.getExtraList(item === topRated ? sortByRating() : sortByComments());
    });
  }

  _renderMovieList() {
    render(this._movieListContainer, this._filmsContainerView, RenderPosition.BEFOREEND);
    renderFilmsList();
  }

  _renderNavigation() {
    render(this._movieListContainer, this._navigationView, RenderPosition.AFTERBEGIN);
    addFilterEvent();
  }

  _renderSort() {
    render(this._movieListContainer, this._sortView, RenderPosition.AFTERBEGIN);
    addSortEvent();
  }
}
