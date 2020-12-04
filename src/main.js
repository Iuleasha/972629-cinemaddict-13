import {renderFilmsList, FILMS_QUANTITY, currentFilmsArray} from './view/render-films-list';
import {createProfileTemplate} from './view/profile';
import {addFilterEvent, createMenuTemplate} from './view/menu-navigation';
import {addSortEvent, createSortTemplate} from './view/sort';
import {createStatisticTemplate} from './view/statistic';
import {createFilmsContainerTemplate} from './view/film-container';
import {createShowMoreBtnTemplate} from './view/show-more';
import {createExtraTemplate} from './view/extra';
import {createFooterStatsTemplate} from './view/footer-stats';
import {createPopupTemplate} from './view/popup';
import {render} from './utils/utils';

const headerElement = () => document.querySelector(`.header`);
const mainElement = () => document.querySelector(`.main`);
const filmsElement = () => mainElement().querySelector(`.films`);
const filmsListElement = () => filmsElement().querySelector(`.films-list`);
const footerElement = () => document.querySelector(`.footer`);
const showMoreButtonEvent = (evt)=>{
  evt.preventDefault();
  renderFilmsList(false);
  if (currentFilmsArray.filmsArray.length <= FILMS_QUANTITY) {
    evt.target.remove();
    evt.target.removeEventListener(`click`, showMoreButtonEvent);
  }
};
export const addShowMoreButton = () => {
  let showMoreButton = filmsElement().querySelector(`.films-list__show-more`);

  if (currentFilmsArray.filmsArray.length > FILMS_QUANTITY && !showMoreButton) {
    render(filmsListElement(), createShowMoreBtnTemplate(), `afterend`);
    showMoreButton = filmsElement().querySelector(`.films-list__show-more`);
    showMoreButton.addEventListener(`click`, showMoreButtonEvent);
  } else if (currentFilmsArray.filmsArray.length < FILMS_QUANTITY && showMoreButton) {
    showMoreButton.remove();
  }
};

render(headerElement(), createProfileTemplate());
render(mainElement(), createMenuTemplate());
render(mainElement(), createSortTemplate());
render(mainElement(), createStatisticTemplate());
render(mainElement(), createFilmsContainerTemplate());
addFilterEvent();
addSortEvent();
renderFilmsList();

render(filmsElement(), createExtraTemplate(`Top rated`));
render(filmsElement(), createExtraTemplate(`Most commented`));

render(footerElement(), createFooterStatsTemplate());
render(footerElement(), createPopupTemplate(currentFilmsArray.filmsArray[0]), `afterend`);
