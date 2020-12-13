import {currentFilmsArray, FILMS_QUANTITY, renderFilmsList} from './view/render-films-list';
import ProfileView from './view/profile';
import NavigationView, {addFilterEvent} from './view/menu-navigation';
import SortView, {addSortEvent} from './view/sort';
import {createStatisticTemplate} from './view/statistic';
import FilmsContainerView from './view/film-container';
import FilmCardExtrasView from './view/extra';
import FooterStatsView from './view/footer-stats';
import {render, RenderPosition, renderTemplate} from './utils/utils';
import {filterFilms} from './mock/film';
filterFilms();

const headerElement = () => document.querySelector(`.header`);
const mainElement = () => document.querySelector(`.main`);
const filmsElement = () => mainElement().querySelector(`.films`);
const footerElement = () => document.querySelector(`.footer__statistics`);

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
