import {createProfileTemplate} from './view/profile';
import {createMenuTemplate} from './view/menu-navigation';
import {createFilterTemplate} from './view/filter';
import {createStatisticTemplate} from './view/statistic';
import {createFilmsContainerTemplate} from './view/film-container';
import {createCardTemplate} from './view/film-card';
import {createShowMoreBtnTemplate} from './view/show-more';
import {createExtraTemplate} from './view/extra';
import {createFooterStatsTemplate} from './view/footer-stats';
import {createPopupTemplate} from './view/popup';

const FILMS_QUANTITY = 5;
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const hederElement = document.querySelector(`.header`);

render(hederElement, createProfileTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);

render(mainElement, createMenuTemplate(), `beforeend`);
render(mainElement, createFilterTemplate(), `beforeend`);
render(mainElement, createStatisticTemplate(), `beforeend`);
render(mainElement, createFilmsContainerTemplate(), `beforeend`);

const filmsElement = mainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_QUANTITY; i++) {
  render(filmsListElement, createCardTemplate(), `beforeend`);
}

render(filmsElement, createShowMoreBtnTemplate(), `beforeend`);
render(filmsElement, createExtraTemplate(`Top rated`), `beforeend`);
render(filmsElement, createExtraTemplate(`Most commented`), `beforeend`);

const footerElement = document.querySelector(`.footer`);

render(footerElement, createFooterStatsTemplate(), `beforeend`);
render(footerElement, createPopupTemplate(), `afterend`);
