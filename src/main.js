import {renderFilmsList} from './view/render-films-list';
import ProfileView from './view/profile';
import NavigationView, {addFilterEvent} from './view/menu-navigation';
import SortView, {addSortEvent} from './view/sort';
import StatisticView from './view/statistic';
import FilmsContainerView from './view/film-container';
import FilmCardExtrasView from './view/extra';
import FooterStatsView from './view/footer-stats';
import {render, RenderPosition} from './utils/render';
import {filterFilms} from './mock/film';

filterFilms();

const headerElement = () => document.querySelector(`.header`);
const mainElement = () => document.querySelector(`.main`);
const filmsElement = () => mainElement().querySelector(`.films`);
const footerElement = () => document.querySelector(`.footer__statistics`);

render(headerElement(), new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new NavigationView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new SortView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new StatisticView().getElement(), RenderPosition.BEFOREEND);
render(mainElement(), new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);
addFilterEvent();
addSortEvent();
renderFilmsList();

[`Top rated`, `Most commented`].forEach((item)=>{
  const extraItem = new FilmCardExtrasView(item);
  render(filmsElement(), extraItem.getElement(), RenderPosition.BEFOREEND);
  extraItem.getExtraList();
});

render(footerElement(), new FooterStatsView().getElement(), RenderPosition.BEFOREEND);
