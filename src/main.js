import {currentFilmsArray, FILMS_QUANTITY, renderFilmsList} from './view/render-films-list';
import ProfileView from './view/profile';
import NavigationView, {addFilterEvent} from './view/menu-navigation';
import SortView, {addSortEvent} from './view/sort';
import {createStatisticTemplate} from './view/statistic';
import FilmsContainerView from './view/film-container';
import ShowMoreBtnView from './view/show-more';
import FilmCardExtrasView from './view/extra';
import FooterStatsView from './view/footer-stats';
// import PopupView from './view/popup';
import {render, RenderPosition, renderTemplate} from './utils/utils';

const headerElement = () => document.querySelector(`.header`);
const mainElement = () => document.querySelector(`.main`);
const filmsElement = () => mainElement().querySelector(`.films`);
const filmsListElement = () => filmsElement().querySelector(`.films-list`);
const footerElement = () => document.querySelector(`.footer__statistics`);
const showMoreButton = new ShowMoreBtnView();


export const addShowMoreButton = () => {
  if (currentFilmsArray.filmsArray.length > FILMS_QUANTITY) {
    render(filmsListElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);
    showMoreButton.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      renderFilmsList(false);
      if (currentFilmsArray.filmsArray.length <= FILMS_QUANTITY) {
        showMoreButton.getElement().remove();
        showMoreButton.removeElement();
      }
    });
  } else if (currentFilmsArray.filmsArray.length < FILMS_QUANTITY && showMoreButton.getElement()) {
    showMoreButton.getElement().remove();
    showMoreButton.removeElement();
  }
};

render(headerElement(), new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new NavigationView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new SortView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(mainElement(), createStatisticTemplate());
render(mainElement(), new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);
addFilterEvent();
addSortEvent();
renderFilmsList();

render(filmsElement(), new FilmCardExtrasView(`Top rated`).getElement(), RenderPosition.BEFOREEND);
render(filmsElement(), new FilmCardExtrasView(`Most commented`).getElement(), RenderPosition.BEFOREEND);

render(footerElement(), new FooterStatsView().getElement(), RenderPosition.BEFOREEND);
// render(footerElement(), new PopupView(currentFilmsArray.filmsArray[0]).getElement(), RenderPosition.AFTERBEGIN);
