import {selectArray} from "../mock/film";

export const filmControlHandler = (currentFilm, type) => {
  let filteredList = selectArray(type);
  const menuItem = document.querySelector(`.main-navigation__item[data-type=${type}] .main-navigation__item-count`);
  let sortCounter = Number(menuItem.textContent);

  if (currentFilm.controls[type]) {
    filteredList.push(currentFilm);
    sortCounter++;
  } else {
    const currentFilmIndex = filteredList.findIndex((film) => film.id === currentFilm.id);

    filteredList.splice(currentFilmIndex, 1);
    sortCounter--;
  }

  menuItem.textContent = sortCounter;
};
