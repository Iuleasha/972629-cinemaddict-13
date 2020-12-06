import {asWatched, favorites, films, filterFilms, watchlist} from '../mock/film';
import {currentFilmsArray, renderFilmsList} from './render-films-list';

export const createMenuTemplate = () => {
  filterFilms();

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-type ="watchlist">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item" data-type ="history">History <span class="main-navigation__item-count">${asWatched.length}</span></a>
      <a href="#favorites" class="main-navigation__item" data-type ="favorites">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export const addFilterEvent = () => {
  const filterWrapper = document.querySelector(`.main-navigation__items`);
  const filterItem = filterWrapper.querySelectorAll(`.main-navigation__item`);

  filterItem.forEach((item) => {
    item.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      currentFilmsArray.filmsArray = selectArray(item.dataset.type);
      renderFilmsList();
    });
  });
};

const selectArray = (type) => {
  switch (type) {
    case `watchlist`:
      return watchlist;
    case `history`:
      return asWatched;
    case `favorites`:
      return favorites;
    default:
      return films;
  }
};
