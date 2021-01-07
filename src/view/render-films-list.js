// import FilmCardView from './film-card';
// import {render, RenderPosition} from '../utils/render';
// import {films} from '../mock/film';
// import ShowMoreBtn from '../view/show-more';
// import NoMovies from './no-movies';
// import Popup from '../presenter/popup';
//
// const showMoreBtn = new ShowMoreBtn();
//
// let startCount = 0;
// export let FILMS_QUANTITY = 5;
//
// export const currentFilmsArray = {
//   films,
//   get filmsArray() {
//     return this.films;
//   },
//
//   set filmsArray(data) {
//     this.films = data;
//   }
// };
//
// export const renderFilmsList = (clean = true) => {
//   const filmsContainer = document.querySelector(`.films-list__container`);
//   const filmsListElement = document.querySelector(`.films-list`);
//   const currentLength = currentFilmsArray.filmsArray.length;
//
//   if (!currentFilmsArray.filmsArray.length) {
//     const noMovies = new NoMovies();
//     filmsContainer.innerHTML = ``;
//
//     render(filmsListElement, noMovies, RenderPosition.AFTERBEGIN);
//
//     return;
//   }
//
//   if (clean) {
//     startCount = 0;
//     FILMS_QUANTITY = 5;
//     filmsContainer.innerHTML = ``;
//     showMoreBtn.addShowMoreButton(filmsListElement);
//   } else {
//     startCount += 5;
//     FILMS_QUANTITY += 5;
//   }
//
//   const popup = new Popup();
//   const LENGTH = currentLength < FILMS_QUANTITY ? currentLength : FILMS_QUANTITY;
//
//   for (let i = startCount; i < LENGTH; i++) {
//     const filmCard = new FilmCardView(currentFilmsArray.filmsArray[i]);
//
//     filmCard.setClickHandler(() => {
//       popup.init(currentFilmsArray.filmsArray[i]);
//     });
//
//     filmCard.setControlsHandler();
//
//     render(filmsContainer, filmCard, RenderPosition.BEFOREEND);
//   }
// };
//
//
