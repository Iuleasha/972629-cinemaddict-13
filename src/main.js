import Api from "./api/api";
import Provider from "./api/provider";
import Store from "./api/store";
import {UpdateType} from "./const";
import DisplayedContentModule from "./model/displayed-content";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import {FilmsList} from "./presenter/films-list";
import FilterPresenter from "./presenter/filter";
import ProfilePresenter from "./presenter/profile";
import StatisticPresenter from "./presenter/statistic";
import {render, RenderPosition} from './utils/render';
import FooterStatsView from './view/footer-stats';

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer__statistics`);

const api = new Api();
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const displayedContentModule = new DisplayedContentModule();
const profilePresenter = new ProfilePresenter(headerElement, filmsModel);
const filmListPresenter = new FilmsList(mainElement, filmsModel, filterModel, displayedContentModule, apiWithProvider);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, displayedContentModule);
const statisticPresenter = new StatisticPresenter(mainElement, filmsModel, displayedContentModule);

profilePresenter.init();
filmListPresenter.init();
filterPresenter.init();
statisticPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerElement, new FooterStatsView(films.length), RenderPosition.BEFOREEND);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
