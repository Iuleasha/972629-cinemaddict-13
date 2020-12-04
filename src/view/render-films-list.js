import {createCardTemplate} from './film-card';
import {render} from '../utils/utils';
import {films} from '../mock/film';
import {addShowMoreButton} from '../main';

let startCount = 0;
export let FILMS_QUANTITY = 5;

export const currentFilmsArray = {
  films,
  get filmsArray() {
    return this.films;
  },

  set filmsArray(data) {
    this.films = data;
  }
};

export const renderFilmsList = (clean = true) => {
  const filmsContainer = document.querySelector(`.films-list__container`);
  const currentLength = currentFilmsArray.filmsArray.length;

  if (clean) {
    startCount = 0;
    FILMS_QUANTITY = 5;
    filmsContainer.innerHTML = ``;
    addShowMoreButton();
  } else {
    startCount += 5;
    FILMS_QUANTITY += 5;
  }

  const LENGTH = currentLength < FILMS_QUANTITY ? currentLength : FILMS_QUANTITY;

  for (let i = startCount; i < LENGTH; i++) {
    render(filmsContainer, createCardTemplate(currentFilmsArray.filmsArray[i]));
  }
};


