import {films} from "./mock/film";
import {MovieList} from "./presenter/movie-list";
import ProfileView from './view/profile';
import StatisticView from './view/statistic';
import FooterStatsView from './view/footer-stats';
import {render, RenderPosition} from './utils/render';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer__statistics`);

render(headerElement, new ProfileView(), RenderPosition.BEFOREEND);
render(mainElement, new StatisticView(), RenderPosition.BEFOREEND);
render(footerElement, new FooterStatsView(), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieList(mainElement);
movieListPresenter.init(films);
