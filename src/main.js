import {films} from "./mock/film";
import DisplayedContentModule from "./model/displayed-content";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import {FilmsList} from "./presenter/films-list";
import FilterPresenter from "./presenter/filter";
import ProfilePresenter from "./presenter/profile";
import StatisticPresenter from "./presenter/statistic";
import {render, RenderPosition} from './utils/render';
import FooterStatsView from './view/footer-stats';

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();
const displayedContentModule = new DisplayedContentModule();
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer__statistics`);

render(footerElement, new FooterStatsView(), RenderPosition.BEFOREEND);

const profilePresenter = new ProfilePresenter(headerElement, filmsModel);
const filmListPresenter = new FilmsList(mainElement, filmsModel, filterModel, displayedContentModule);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, displayedContentModule);
const statisticPresenter = new StatisticPresenter(mainElement, filmsModel, displayedContentModule);

profilePresenter.init();
filmListPresenter.init();
filterPresenter.init();
statisticPresenter.init();
