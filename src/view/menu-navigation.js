import {favorite, selectArray, watched, watchlist} from '../mock/film';
import {currentFilmsArray, renderFilmsList} from './render-films-list';
import AbstractView from './abstract';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-type="watchlist">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item" data-type="watched">History <span class="main-navigation__item-count">${watched.length}</span></a>
      <a href="#favorites" class="main-navigation__item" data-type="favorite">Favorites <span class="main-navigation__item-count">${favorite.length}</span></a>
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

export default class Navigation extends AbstractView {
  getTemplate() {
    return createMenuTemplate();
  }
}
