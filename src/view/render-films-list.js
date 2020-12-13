import FilmCardView from './film-card';
import {render, RenderPosition} from '../utils/utils';
import {films} from '../mock/film';
import ShowMoreBtn from '../view/show-more';
import NoMovies from './no-movies';
const showMoreBtn = new ShowMoreBtn();

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
  const filmsContainer1 = document.querySelector(`.films-list`);
  const currentLength = currentFilmsArray.filmsArray.length;
  if (!currentFilmsArray.filmsArray.length) {
    filmsContainer.innerHTML = ``;
    render(filmsContainer1, new NoMovies().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  if (clean) {
    startCount = 0;
    FILMS_QUANTITY = 5;
    filmsContainer.innerHTML = ``;
    showMoreBtn.addShowMoreButton();
  } else {
    startCount += 5;
    FILMS_QUANTITY += 5;
  }

  const LENGTH = currentLength < FILMS_QUANTITY ? currentLength : FILMS_QUANTITY;

  for (let i = startCount; i < LENGTH; i++) {
    render(filmsContainer, new FilmCardView(currentFilmsArray.filmsArray[i]).getElement(), RenderPosition.BEFOREEND);
  }
};


